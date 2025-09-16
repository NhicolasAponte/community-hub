/**
 * Email Service Module
 *
 * This module handles all email operations for the community hub, including:
 * - Newsletter subscription management
 * - Bulk email sending with rate limiting and batching
 * - Email queue management for large subscriber lists
 * - Unsubscribe handling
 *
 * Key features:
 * - Respects Resend's 100 email batch limit
 * - Implements rate limiting to avoid API limits
 * - Queues emails for large lists to process over multiple days
 * - Proper error handling and retry logic
 */

import { Resend } from "resend";
import { render } from "@react-email/render";
import { db, subscriberTable, emailQueueTable, newsletterTable } from "@/db";
import { eq, and, lte, inArray, sql } from "drizzle-orm";
import NewsletterEmail from "@/emails/newsletter-template";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ============================================================================
// CONSTANTS AND TYPES
// ============================================================================

// Email status constants
export const EMAIL_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];

// Configuration constants
const BATCH_SIZE = 100; // Resend's maximum batch size
const FROM_EMAIL = "delivered@resend.dev"; // Resend's verified testing domain
const RATE_LIMIT_DELAY = 1000; // 1 second between batches

// Type definitions
export interface SubscriberData {
  email: string;
  name: string | null;
  unsubscribeToken: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  totalSent: number;
  totalFailures: number;
  error?: string;
}

export interface QueueStats {
  pending: number;
  sent: number;
  failed: number;
  totalInQueue: number;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  processed: number;
  successCount: number;
  failureCount: number;
  error?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Render email template for a subscriber
 */
async function renderEmailTemplate({
  title,
  content,
  subscriber,
}: {
  title: string;
  content: string;
  subscriber: SubscriberData;
}) {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=${subscriber.unsubscribeToken}`;

  return await render(
    NewsletterEmail({
      title,
      content,
      recipientName: subscriber.name || undefined,
      unsubscribeUrl,
    })
  );
}

/**
 * Send a batch of emails via Resend
 */
async function sendEmailBatch(
  emails: Array<{
    from: string;
    to: string[];
    subject: string;
    html: string;
  }>
): Promise<{ success: boolean; sentCount: number; failureCount: number }> {
  try {
    const { error } = await resend.batch.send(emails);

    if (error) {
      console.error("❌ Batch send failed:", error);
      return { success: false, sentCount: 0, failureCount: emails.length };
    }

    console.log(`✅ Batch sent successfully (${emails.length} emails)`);
    return { success: true, sentCount: emails.length, failureCount: 0 };
  } catch (error) {
    console.error("❌ Error sending batch:", error);
    return { success: false, sentCount: 0, failureCount: emails.length };
  }
}

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Add a new subscriber to the newsletter
 *
 * @param email - The subscriber's email address
 * @param name - Optional name of the subscriber
 * @returns Promise with success status and message
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
 *
 * @param token - The unique unsubscribe token
 * @returns Promise with success status and message
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
 * Send immediate emails (up to 100) and queue the rest
 * This is the main function called when creating a newsletter
 *
 * @param newsletterId - The ID of the newsletter to send
 * @param title - The newsletter title
 * @param content - The newsletter content
 * @returns Promise with processing results including immediate and queued counts
 */
export async function sendImmediateEmails({
  newsletterId,
  title,
  content,
}: {
  newsletterId: string;
  title: string;
  content: string;
}) {
  try {
    console.log(`📧 Processing newsletter: ${title} (ID: ${newsletterId})`);

    // Get all active subscribers
    const subscribers = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.subscribed, true));

    if (subscribers.length === 0) {
      console.log("No active subscribers found");
      return {
        success: true,
        message: "Newsletter created but no subscribers to send to",
      };
    }

    console.log(`Found ${subscribers.length} subscribers`);

    // Determine how many to send immediately vs queue
    const immediateCount = Math.min(subscribers.length, BATCH_SIZE);
    const queueCount = Math.max(0, subscribers.length - BATCH_SIZE);

    console.log(`Sending ${immediateCount} immediately, queuing ${queueCount}`);

    // Split subscribers
    const immediateSubscribers = subscribers.slice(0, immediateCount);
    const queuedSubscribers = subscribers.slice(immediateCount);

    // Send immediate emails
    let immediateResult: EmailResult = {
      success: true,
      totalSent: 0,
      totalFailures: 0,
      message: "",
    };
    if (immediateSubscribers.length > 0) {
      console.log(
        `📤 Sending to ${immediateSubscribers.length} immediate recipients`
      );
      immediateResult = await sendEmailsToSubscribers(
        immediateSubscribers,
        title,
        content
      );
    }

    // Queue remaining emails
    let queueResult = { success: true, queued: 0 };
    if (queuedSubscribers.length > 0) {
      console.log(
        `📝 Queuing ${queuedSubscribers.length} emails for later processing`
      );
      queueResult = await addEmailsToQueue(newsletterId, queuedSubscribers);
    }

    // Compile results
    const totalImmediate = immediateResult.totalSent || 0;
    const totalQueued = queueResult.queued || 0;

    let message = `Newsletter processed: ${totalImmediate} sent immediately`;
    if (totalQueued > 0) {
      const batchDays = Math.ceil(totalQueued / BATCH_SIZE);
      message += `, ${totalQueued} queued for processing over ${batchDays} day(s)`;
    }

    return {
      success: immediateResult.success && queueResult.success,
      message,
      details: {
        immediateSent: totalImmediate,
        queued: totalQueued,
        totalSubscribers: subscribers.length,
      },
    };
  } catch (error) {
    console.error("Error in sendImmediateEmails:", error);
    return {
      success: false,
      message: "Failed to process newsletter emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// INTERNAL HELPER FUNCTIONS
// ============================================================================

/**
 * Send emails to a list of subscribers (helper function)
 * Handles batching, rate limiting, and error reporting
 */
async function sendEmailsToSubscribers(
  subscribers: SubscriberData[],
  title: string,
  content: string
): Promise<EmailResult> {
  try {
    console.log(`📤 Preparing to send ${subscribers.length} emails`);

    // Render email templates for all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      const emailHtml = await renderEmailTemplate({
        title,
        content,
        subscriber,
      });
      return {
        from: FROM_EMAIL,
        to: [subscriber.email],
        subject: title,
        html: emailHtml,
      };
    });

    console.log("Rendering email templates...");
    const emailsToSend = await Promise.all(emailPromises);

    // Split into batches of 100 (Resend's limit)
    const batches = [];
    for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
      batches.push(emailsToSend.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `Sending ${emailsToSend.length} emails in ${batches.length} batches`
    );

    let totalSent = 0;
    let totalFailures = 0;

    // Send each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Sending batch ${i + 1}/${batches.length} (${batch.length} emails)`
      );

      const result = await sendEmailBatch(batch);
      totalSent += result.sentCount;
      totalFailures += result.failureCount;

      // Add delay between batches to respect rate limits (2 requests/second)
      if (i < batches.length - 1) {
        console.log("Waiting 1 second before next batch...");
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }

    return {
      success: totalSent > 0,
      message: `${totalSent} emails sent, ${totalFailures} failed`,
      totalSent,
      totalFailures,
    };
  } catch (error) {
    console.error("Error in sendEmailsToSubscribers:", error);
    return {
      success: false,
      message: "Failed to send emails to subscribers",
      totalSent: 0,
      totalFailures: subscribers.length,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Add emails to the queue for later processing
 * Schedules emails across multiple days to respect daily limits
 */
async function addEmailsToQueue(
  newsletterId: string,
  subscribers: SubscriberData[]
) {
  try {
    console.log(
      `📝 Adding ${subscribers.length} emails to queue for newsletter ${newsletterId}`
    );

    const queueEntries = [];
    let currentBatchNumber = 1;
    let currentBatchCount = 0;

    for (const subscriber of subscribers) {
      // Calculate which batch (day) this email should be processed
      if (currentBatchCount >= BATCH_SIZE) {
        currentBatchNumber++;
        currentBatchCount = 0;
      }

      // Schedule for the next day + batch number
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + currentBatchNumber);

      queueEntries.push({
        newsletterId,
        recipientEmail: subscriber.email,
        recipientName: subscriber.name,
        status: EMAIL_STATUS.PENDING,
        scheduledFor: scheduledDate,
        attempts: 0,
        batchNumber: currentBatchNumber,
      });

      currentBatchCount++;
    }

    // Insert all queue entries
    await db.insert(emailQueueTable).values(queueEntries);

    console.log(
      `✅ Queued ${queueEntries.length} emails across ${currentBatchNumber} batch(es)`
    );

    return {
      success: true,
      queued: queueEntries.length,
      batches: currentBatchNumber,
    };
  } catch (error) {
    console.error("Error adding emails to queue:", error);
    return {
      success: false,
      queued: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process pending emails from the queue (up to 100 per day)
 * This function should be called by a cron job or scheduled task
 *
 * @returns Promise with processing results including success/failure counts
 */
export async function processPendingEmails() {
  try {
    console.log("🔄 Processing pending emails from queue...");

    // Get pending emails scheduled for today or earlier (limit to 100)
    const pendingEmails = await db
      .select({
        id: emailQueueTable.id,
        newsletterId: emailQueueTable.newsletterId,
        recipientEmail: emailQueueTable.recipientEmail,
        recipientName: emailQueueTable.recipientName,
        attempts: emailQueueTable.attempts,
        batchNumber: emailQueueTable.batchNumber,
      })
      .from(emailQueueTable)
      .where(
        and(
          eq(emailQueueTable.status, EMAIL_STATUS.PENDING),
          lte(emailQueueTable.scheduledFor, new Date())
        )
      )
      .limit(BATCH_SIZE);

    if (pendingEmails.length === 0) {
      console.log("📭 No pending emails to process");
      return {
        success: true,
        message: "No pending emails to process",
        processed: 0,
        successCount: 0,
        failureCount: 0,
      };
    }

    console.log(`📬 Found ${pendingEmails.length} pending emails to process`);

    // Get newsletter details for the emails (assuming they're all from the same newsletter for this batch)
    const newsletterIds = Array.from(
      new Set(pendingEmails.map((email) => email.newsletterId))
    );

    let totalSuccess = 0;
    let totalFailures = 0;

    // Process each newsletter's emails
    for (const newsletterId of newsletterIds) {
      const newsletterEmails = pendingEmails.filter(
        (email) => email.newsletterId === newsletterId
      );

      // Get newsletter details
      const [newsletter] = await db
        .select()
        .from(newsletterTable)
        .where(eq(newsletterTable.id, newsletterId))
        .limit(1);

      if (!newsletter) {
        console.error(`Newsletter not found: ${newsletterId}`);
        // Mark these emails as failed
        await markEmailsAsFailed(
          newsletterEmails.map((e) => e.id),
          "Newsletter not found"
        );
        totalFailures += newsletterEmails.length;
        continue;
      }

      console.log(
        `📤 Processing ${newsletterEmails.length} emails for newsletter: ${newsletter.title}`
      );

      // Get all subscriber tokens in a single query
      const subscriberEmails = newsletterEmails.map((e) => e.recipientEmail);
      const subscribers = await db
        .select({
          email: subscriberTable.email,
          unsubscribeToken: subscriberTable.unsubscribeToken,
        })
        .from(subscriberTable)
        .where(inArray(subscriberTable.email, subscriberEmails));

      // Create a map for quick lookup
      const tokenMap = new Map(
        subscribers.map((s) => [s.email, s.unsubscribeToken])
      );

      // Build the subscriber data with tokens and maintain mapping to original emails
      const emailsWithTokens: Array<{
        id: string;
        email: string;
        name: string | null;
        unsubscribeToken: string;
      }> = newsletterEmails
        .map((email) => {
          const token = tokenMap.get(email.recipientEmail);
          if (!token) {
            console.warn(
              `Subscriber not found for email: ${email.recipientEmail}`
            );
            return null;
          }
          return {
            id: email.id,
            email: email.recipientEmail,
            name: email.recipientName,
            unsubscribeToken: token,
          };
        })
        .filter((email): email is NonNullable<typeof email> => email !== null);

      // Send emails for this newsletter
      const subscriberData: SubscriberData[] = emailsWithTokens.map(
        (email) => ({
          email: email.email,
          name: email.name,
          unsubscribeToken: email.unsubscribeToken,
        })
      );

      const result = await sendEmailsToSubscribers(
        subscriberData,
        newsletter.title,
        newsletter.content
      );

      // Update email statuses
      if (result.success && result.totalSent > 0) {
        // Mark successful emails as sent
        const successfulEmailIds = emailsWithTokens
          .slice(0, result.totalSent)
          .map((e) => e.id);
        await markEmailsAsSent(successfulEmailIds);
        totalSuccess += result.totalSent;
      }

      if (result.totalFailures > 0) {
        // Mark failed emails and increment attempts
        const failedEmailIds = emailsWithTokens
          .slice(result.totalSent)
          .map((e) => e.id);
        await markEmailsAsFailed(failedEmailIds, "Send failed");
        totalFailures += result.totalFailures;
      }
    }

    console.log(
      `✅ Queue processing completed: ${totalSuccess} sent, ${totalFailures} failed`
    );

    return {
      success: true,
      message: `Processed ${pendingEmails.length} emails: ${totalSuccess} sent, ${totalFailures} failed`,
      processed: pendingEmails.length,
      successCount: totalSuccess,
      failureCount: totalFailures,
    };
  } catch (error) {
    console.error("Error processing pending emails:", error);
    return {
      success: false,
      message: "Failed to process pending emails",
      processed: 0,
      successCount: 0,
      failureCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mark emails as sent in the queue
 * Updates status and records sent timestamp
 */
async function markEmailsAsSent(emailIds: string[]) {
  if (emailIds.length === 0) return;

  await db
    .update(emailQueueTable)
    .set({
      status: EMAIL_STATUS.SENT,
      sentAt: new Date(),
    })
    .where(inArray(emailQueueTable.id, emailIds));
}

/**
 * Mark emails as failed and increment attempts counter
 * Uses batch update for better performance
 */
async function markEmailsAsFailed(emailIds: string[], errorMessage: string) {
  if (emailIds.length === 0) return;

  // Batch update all failed emails
  await db
    .update(emailQueueTable)
    .set({
      status: EMAIL_STATUS.FAILED,
      errorMessage,
      attempts: sql`${emailQueueTable.attempts} + 1`,
    })
    .where(inArray(emailQueueTable.id, emailIds));
}

/**
 * Get queue statistics including pending, sent, and failed email counts
 *
 * @returns Promise with queue statistics or error information
 */
export async function getQueueStats() {
  try {
    // Get all status counts in a single query
    const stats = await db
      .select({
        status: emailQueueTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(emailQueueTable)
      .groupBy(emailQueueTable.status);

    // Initialize counters
    let pending = 0;
    let sent = 0;
    let failed = 0;

    // Populate counters from query results
    stats.forEach((stat) => {
      switch (stat.status) {
        case EMAIL_STATUS.PENDING:
          pending = stat.count;
          break;
        case EMAIL_STATUS.SENT:
          sent = stat.count;
          break;
        case EMAIL_STATUS.FAILED:
          failed = stat.count;
          break;
      }
    });

    const totalInQueue = pending + sent + failed;

    return {
      success: true,
      stats: {
        pending,
        sent,
        failed,
        totalInQueue,
      },
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
