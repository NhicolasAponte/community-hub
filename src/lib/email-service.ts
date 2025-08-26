import { Resend } from "resend";
import { render } from "@react-email/render";
import { db } from "@/db";
import { subscriberTable, emailQueueTable, newsletterTable } from "@/db/schema";
import { eq, and, lte, count } from "drizzle-orm";
import NewsletterEmail from "@/emails/newsletter-template";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface QueueEmailOptions {
  newsletterId: string;
  title: string;
  content: string;
}

interface EmailData {
  queueId: string;
  newsletterId: string;
  recipientEmail: string;
  recipientName: string | null;
  attempts: number;
  title: string | null;
  content: string | null;
}

// Constants
const EMAILS_PER_DAY = 99; // Leave 1 email buffer for other system emails
const FROM_EMAIL = "Community Hub <onboarding@resend.dev>"; // Resend's verified testing domain

/**
 * Send emails immediately for small subscriber lists or handle failures for larger lists
 */
export async function sendImmediateEmails({
  newsletterId,
  title,
  content,
}: QueueEmailOptions) {
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
        stats: { immediate: 0, queued: 0 },
      };
    }

    console.log(`Found ${subscribers.length} subscribers`);

    // If 99 or fewer subscribers, send immediately
    if (subscribers.length <= EMAILS_PER_DAY) {
      console.log(`Sending ${subscribers.length} emails immediately`);

      let successCount = 0;
      let failureCount = 0;
      const failedEmails: Array<{
        email: string;
        name: string | null;
        error: string;
      }> = [];

      // Send emails immediately
      for (const subscriber of subscribers) {
        try {
          await sendSingleEmailDirect({
            recipientEmail: subscriber.email,
            recipientName: subscriber.name,
            title,
            content,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          failedEmails.push({
            email: subscriber.email,
            name: subscriber.name,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          failureCount++;
        }
      }

      // Queue any failed emails for retry
      if (failedEmails.length > 0) {
        console.log(`Queueing ${failedEmails.length} failed emails for retry`);

        const queueEntries = failedEmails.map((failed) => ({
          newsletterId,
          recipientEmail: failed.email,
          recipientName: failed.name,
          status: "pending" as const,
          scheduledFor: new Date(Date.now() + 5 * 60 * 1000), // Retry in 5 minutes
          sentAt: null,
          attempts: 1, // This is a retry
          errorMessage: failed.error.substring(0, 500),
          batchNumber: 0,
        }));

        await db.insert(emailQueueTable).values(queueEntries);
      }

      return {
        success: true,
        message: `Sent ${successCount} emails immediately${failureCount > 0 ? `, queued ${failureCount} failed emails for retry` : ""}`,
        stats: {
          immediate: successCount,
          queued: failureCount,
          total: subscribers.length,
        },
      };
    } else {
      // For larger lists, use the queue system
      console.log(
        `Large subscriber list (${subscribers.length}), using queue system`
      );
      return await queueNewsletterEmails({ newsletterId, title, content });
    }
  } catch (error) {
    console.error("Error in sendImmediateEmails:", error);
    return {
      success: false,
      message: "Failed to process newsletter emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a single email directly without queue tracking (for immediate sending)
 */
async function sendSingleEmailDirect({
  recipientEmail,
  recipientName,
  title,
  content,
}: {
  recipientEmail: string;
  recipientName: string | null;
  title: string;
  content: string;
}) {
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

  // Send the email via Resend
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [recipientEmail],
    subject: title,
    html: emailHtml,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log(`Successfully sent email to ${recipientEmail} (ID: ${data?.id})`);
}

/**
 * Queue emails for all active subscribers when a newsletter is created
 */
export async function queueNewsletterEmails({
  newsletterId,
}: QueueEmailOptions) {
  try {
    // Get all active subscribers
    const subscribers = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.subscribed, true));

    if (subscribers.length === 0) {
      console.log("No active subscribers found");
      return { success: true, message: "No subscribers to send to" };
    }

    // Calculate batch distribution
    const emailsToSend = subscribers.length;
    const totalBatches = Math.ceil(emailsToSend / EMAILS_PER_DAY);

    console.log(
      `Queueing ${emailsToSend} emails across ${totalBatches} batches`
    );

    // Create queue entries for each subscriber
    const queueEntries = subscribers.map((subscriber, index) => {
      const batchNumber = Math.floor(index / EMAILS_PER_DAY);
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + batchNumber);

      return {
        newsletterId,
        recipientEmail: subscriber.email,
        recipientName: subscriber.name,
        status: "pending" as const,
        scheduledFor: scheduledDate,
        sentAt: null,
        attempts: 0,
        errorMessage: null,
        batchNumber,
      };
    });

    // Insert all queue entries
    await db.insert(emailQueueTable).values(queueEntries);

    return {
      success: true,
      message: `Successfully queued ${emailsToSend} emails across ${totalBatches} days`,
      stats: {
        totalEmails: emailsToSend,
        totalBatches,
        emailsPerDay: EMAILS_PER_DAY,
      },
    };
  } catch (error) {
    console.error("Error queueing newsletter emails:", error);
    return {
      success: false,
      message: "Failed to queue newsletter emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process pending emails that are scheduled for today or earlier
 */
export async function processPendingEmails() {
  try {
    const now = new Date();

    // Get pending emails that are scheduled for now or earlier
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
          lte(emailQueueTable.scheduledFor, now)
        )
      )
      .limit(EMAILS_PER_DAY);

    if (pendingEmails.length === 0) {
      console.log("No pending emails to process");
      return { success: true, processed: 0 };
    }

    console.log(`Processing ${pendingEmails.length} pending emails`);

    let successCount = 0;
    let failureCount = 0;

    // Process each email
    for (const emailData of pendingEmails) {
      try {
        await sendSingleEmail(emailData);
        successCount++;
      } catch (error) {
        console.error(
          `Failed to send email to ${emailData.recipientEmail}:`,
          error
        );
        await handleEmailFailure(emailData.queueId, error);
        failureCount++;
      }
    }

    console.log(
      `Email processing complete: ${successCount} sent, ${failureCount} failed`
    );

    return {
      success: true,
      processed: pendingEmails.length,
      successCount,
      failureCount,
    };
  } catch (error) {
    console.error("Error processing pending emails:", error);
    return {
      success: false,
      message: "Failed to process pending emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a single email and update the queue status
 */
async function sendSingleEmail(emailData: EmailData) {
  const { queueId, recipientEmail, recipientName, title, content, attempts } =
    emailData;

  if (!title || !content) {
    throw new Error("Newsletter title or content is missing");
  }

  // Generate unsubscribe URL (you'll need to implement the unsubscribe endpoint)
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${encodeURIComponent(recipientEmail)}`;

  // Render the email template
  const emailHtml = await render(
    NewsletterEmail({
      title,
      content,
      recipientName: recipientName || undefined,
      unsubscribeUrl,
    })
  );

  // Send the email via Resend
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

  console.log(`Successfully sent email to ${recipientEmail} (ID: ${data?.id})`);
}

/**
 * Handle email sending failure
 */
async function handleEmailFailure(queueId: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  // Get current attempts count first
  const currentEntry = await db
    .select({ attempts: emailQueueTable.attempts })
    .from(emailQueueTable)
    .where(eq(emailQueueTable.id, queueId))
    .limit(1);

  const currentAttempts = currentEntry[0]?.attempts || 0;

  // Update the queue entry with error info
  await db
    .update(emailQueueTable)
    .set({
      status: "failed",
      attempts: currentAttempts + 1,
      errorMessage: errorMessage.substring(0, 500), // Truncate if too long
    })
    .where(eq(emailQueueTable.id, queueId));
}

/**
 * Add a new subscriber to the newsletter
 */
export async function addSubscriber(email: string, name?: string) {
  try {
    // Generate a secure random token for unsubscribe
    const unsubscribeToken = randomBytes(32).toString("hex");

    await db.insert(subscriberTable).values({
      email,
      name: name || null,
      subscribed: true,
      subscribedAt: new Date(),
      unsubscribeToken,
    });

    return { success: true, message: "Successfully subscribed to newsletter" };
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return {
      success: false,
      message: "Failed to subscribe to newsletter",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeUser(token: string) {
  try {
    await db
      .update(subscriberTable)
      .set({ subscribed: false })
      .where(eq(subscriberTable.unsubscribeToken, token));

    return {
      success: true,
      message: "Successfully unsubscribed from newsletter",
    };
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return {
      success: false,
      message: "Failed to unsubscribe from newsletter",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  try {
    const stats = await db
      .select({
        status: emailQueueTable.status,
        count: count(),
      })
      .from(emailQueueTable)
      .groupBy(emailQueueTable.status);

    return {
      success: true,
      stats: stats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat.count;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  } catch (error) {
    console.error("Error getting queue stats:", error);
    return {
      success: false,
      message: "Failed to get queue statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
