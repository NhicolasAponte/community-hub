import { db } from "@/db";
import { emailQueueTable, newsletterTable, subscriberTable } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { Resend } from "resend";
import { render } from "@react-email/render";
import NewsletterEmail from "@/emails/newsletter-template";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = "delivered@resend.dev";

// Rate limiting constants
const DELAY_BETWEEN_EMAILS = 1100; // 1.1 seconds between emails (safe buffer under 2/second limit)

interface QueuedEmailData {
  queueId: string;
  newsletterId: string;
  recipientEmail: string;
  recipientName: string | null;
  attempts: number;
  title: string | null;
  content: string | null;
}

export interface EmailQueueProcessor {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

class RateLimitedEmailQueue implements EmailQueueProcessor {
  private isProcessing = false;
  private shouldStop = false;
  private processingInterval: NodeJS.Timeout | null = null;

  async start() {
    if (this.isProcessing) {
      console.log("Email queue is already running");
      return;
    }

    console.log("🚀 Starting rate-limited email queue processor");
    this.isProcessing = true;
    this.shouldStop = false;

    // Process emails every 2 seconds to stay under rate limit
    this.processingInterval = setInterval(async () => {
      if (this.shouldStop) {
        this.stop();
        return;
      }

      await this.processBatch();
    }, 2000); // 2 second intervals
  }

  stop() {
    console.log("⏹️ Stopping email queue processor");
    this.shouldStop = true;
    this.isProcessing = false;

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  isRunning(): boolean {
    return this.isProcessing;
  }

  private async processBatch() {
    try {
      // Get pending emails that are ready to send
      const pendingEmails = await db
        .select({
          queueId: emailQueueTable.id,
          newsletterId: emailQueueTable.newsletterId,
          recipientEmail: emailQueueTable.recipientEmail,
          recipientName: emailQueueTable.recipientName,
          attempts: emailQueueTable.attempts,
          title: newsletterTable.title,
          content: newsletterTable.content,
        })
        .from(emailQueueTable)
        .leftJoin(
          newsletterTable,
          eq(emailQueueTable.newsletterId, newsletterTable.id)
        )
        .where(
          and(
            eq(emailQueueTable.status, "pending"),
            lte(emailQueueTable.scheduledFor, new Date()),
            // Only get emails that haven't failed too many times
            lte(emailQueueTable.attempts, 3)
          )
        )
        .limit(1); // Process 1 email at a time to respect rate limits

      if (pendingEmails.length === 0) {
        return; // No emails to process
      }

      const email = pendingEmails[0];
      console.log(
        `📧 Processing email ${email.queueId} to ${email.recipientEmail}`
      );

      try {
        await this.sendSingleQueuedEmail(email);
        console.log(`✅ Successfully sent email ${email.queueId}`);
      } catch (error) {
        console.error(`❌ Failed to send email ${email.queueId}:`, error);
        await this.handleEmailFailure(email.queueId, error);
      }
    } catch (error) {
      console.error("Error processing email batch:", error);
    }
  }

  private async sendSingleQueuedEmail(emailData: QueuedEmailData) {
    const { queueId, recipientEmail, recipientName, title, content, attempts } =
      emailData;

    if (!title || !content) {
      throw new Error("Newsletter title or content is missing");
    }

    // Generate unsubscribe URL
    const subscriber = await db
      .select({ unsubscribeToken: subscriberTable.unsubscribeToken })
      .from(subscriberTable)
      .where(eq(subscriberTable.email, recipientEmail))
      .limit(1);

    const unsubscribeUrl = subscriber[0]
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=${subscriber[0].unsubscribeToken}`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=${encodeURIComponent(recipientEmail)}`;

    // Render the email template
    const emailHtml = await render(
      NewsletterEmail({
        title,
        content,
        recipientName: recipientName || undefined,
        unsubscribeUrl,
      })
    );

    // Send the email via Resend with rate limiting
    console.log(`📤 Sending email via Resend (attempt ${attempts + 1})`);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [recipientEmail],
      subject: title,
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }

    // Update queue entry as sent
    await db
      .update(emailQueueTable)
      .set({
        status: "sent",
        sentAt: new Date(),
        attempts: attempts + 1,
      })
      .where(eq(emailQueueTable.id, queueId));

    console.log(`🎉 Email sent successfully! Resend ID: ${data?.id}`);
  }

  private async handleEmailFailure(queueId: string, error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Get current attempts count
    const currentEntry = await db
      .select({ attempts: emailQueueTable.attempts })
      .from(emailQueueTable)
      .where(eq(emailQueueTable.id, queueId))
      .limit(1);

    const currentAttempts = currentEntry[0]?.attempts || 0;
    const newAttempts = currentAttempts + 1;

    // If we've tried 3 times, mark as failed
    const status = newAttempts >= 3 ? "failed" : "pending";

    // Schedule retry in 5 minutes if not failed
    const scheduledFor =
      status === "pending" ? new Date(Date.now() + 5 * 60 * 1000) : undefined;

    await db
      .update(emailQueueTable)
      .set({
        status,
        attempts: newAttempts,
        errorMessage: errorMessage.substring(0, 500),
        ...(scheduledFor && { scheduledFor }),
      })
      .where(eq(emailQueueTable.id, queueId));

    console.log(
      `${status === "failed" ? "💀" : "🔄"} Email ${queueId} ${status} (${newAttempts}/3 attempts)`
    );
  }
}

// Global queue instance
let queueProcessor: RateLimitedEmailQueue | null = null;

/**
 * Get or create the email queue processor
 */
export function getEmailQueueProcessor(): EmailQueueProcessor {
  if (!queueProcessor) {
    queueProcessor = new RateLimitedEmailQueue();
  }
  return queueProcessor;
}

/**
 * Start the email queue processor
 */
export function startEmailQueue() {
  const processor = getEmailQueueProcessor();
  processor.start();
  return processor;
}

/**
 * Stop the email queue processor
 */
export function stopEmailQueue() {
  if (queueProcessor) {
    queueProcessor.stop();
    queueProcessor = null;
  }
}

/**
 * Queue emails for immediate processing with rate limiting
 */
export async function queueEmailsForImmediateProcessing({
  newsletterId,
}: {
  newsletterId: string;
  title: string;
  content: string;
}) {
  try {
    // Get all active subscribers
    const subscribers = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.subscribed, true));

    if (subscribers.length === 0) {
      console.log("No active subscribers found");
      return {
        success: true,
        message: "No subscribers to send to",
        stats: { queued: 0 },
      };
    }

    console.log(
      `📬 Queueing ${subscribers.length} emails for immediate processing`
    );

    // Create queue entries for immediate processing
    const queueEntries = subscribers.map((subscriber, index) => ({
      newsletterId,
      recipientEmail: subscriber.email,
      recipientName: subscriber.name,
      status: "pending" as const,
      scheduledFor: new Date(Date.now() + index * DELAY_BETWEEN_EMAILS), // Stagger emails
      sentAt: null,
      attempts: 0,
      errorMessage: null,
      batchNumber: 0,
    }));

    // Insert all queue entries
    await db.insert(emailQueueTable).values(queueEntries);

    // Start the queue processor if not already running
    const processor = getEmailQueueProcessor();
    if (!processor.isRunning()) {
      processor.start();
    }

    return {
      success: true,
      message: `Successfully queued ${subscribers.length} emails for rate-limited sending`,
      stats: {
        queued: subscribers.length,
        estimatedTime: Math.ceil(
          (subscribers.length * DELAY_BETWEEN_EMAILS) / 1000 / 60
        ), // minutes
      },
    };
  } catch (error) {
    console.error("Error queueing emails:", error);
    return {
      success: false,
      message: "Failed to queue emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
