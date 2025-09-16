import { Resend } from "resend";
import { render } from "@react-email/render";
import { db, subscriberTable, emailQueueTable, newsletterTable } from "@/db";
import { eq, and, lte, inArray } from "drizzle-orm";
import NewsletterEmail from "@/emails/newsletter-template";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface SendNewsletterOptions {
  title: string;
  content: string;
}

// Constants
const BATCH_SIZE = 100; // Resend's maximum batch size
const FROM_EMAIL = "delivered@resend.dev"; // Resend's verified testing domain

/**
 * Send newsletter emails using Resend's batch API
 * Handles up to 100 emails per batch with automatic batching for larger lists
 */
export async function sendNewsletterEmails({
  title,
  content,
}: SendNewsletterOptions) {
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
        stats: { totalSent: 0, totalBatches: 0, failures: 0 },
      };
    }

    console.log(`Found ${subscribers.length} subscribers`);

    // Prepare email data for all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      // Generate unsubscribe URL
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=${subscriber.unsubscribeToken}`;

      // Render the email template
      const emailHtml = await render(
        NewsletterEmail({
          title,
          content,
          recipientName: subscriber.name || undefined,
          unsubscribeUrl,
        })
      );

      return {
        from: FROM_EMAIL,
        to: [subscriber.email],
        subject: title,
        html: emailHtml,
      };
    });

    // Wait for all email templates to be rendered
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
    const failedEmails: string[] = [];

    // Send each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Sending batch ${i + 1}/${batches.length} (${batch.length} emails)`
      );

      try {
        const { data, error } = await resend.batch.send(batch);

        if (error) {
          console.error(`❌ Batch ${i + 1} failed:`, error);
          totalFailures += batch.length;
          failedEmails.push(...batch.map((email) => email.to[0]));
        } else {
          console.log(`✅ Batch ${i + 1} sent successfully`);
          console.log(`📊 Batch response:`, data);
          totalSent += batch.length;
        }

        // Add delay between batches to respect rate limits (2 requests/second)
        if (i < batches.length - 1) {
          console.log("Waiting 1 second before next batch...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error sending batch ${i + 1}:`, error);
        totalFailures += batch.length;
        failedEmails.push(...batch.map((email) => email.to[0]));
      }
    }

    const results = {
      success: totalSent > 0,
      message: `Newsletter sent: ${totalSent} successful, ${totalFailures} failed`,
      stats: {
        totalSent,
        totalBatches: batches.length,
        failures: totalFailures,
        failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
      },
    };

    console.log("📊 Final results:", results);
    return results;
  } catch (error) {
    console.error("Error in sendNewsletterEmails:", error);
    return {
      success: false,
      message: "Failed to send newsletter emails",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a single test email (useful for testing purposes)
 */
export async function sendTestEmail({
  recipientEmail,
  recipientName,
  title,
  content,
}: {
  recipientEmail: string;
  recipientName?: string;
  title: string;
  content: string;
}) {
  try {
    console.log(`🔍 Sending test email to: ${recipientEmail}`);

    // Generate a dummy unsubscribe URL for test
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=test`;

    // Render the email template
    const emailHtml = await render(
      NewsletterEmail({
        title,
        content,
        recipientName,
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
      console.error(`🚫 Test email failed:`, error);
      return {
        success: false,
        message: `Failed to send test email: ${error.message}`,
        error: error.message,
      };
    }

    console.log(`✅ Test email sent successfully! Resend ID: ${data?.id}`);
    return {
      success: true,
      message: "Test email sent successfully",
      emailId: data?.id,
    };
  } catch (error) {
    console.error("Error sending test email:", error);
    return {
      success: false,
      message: "Failed to send test email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
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
 * Get subscriber statistics
 */
export async function getSubscriberStats() {
  try {
    const totalSubscribers = await db
      .select()
      .from(subscriberTable)
      .where(eq(subscriberTable.subscribed, true));

    return {
      success: true,
      stats: {
        totalActiveSubscribers: totalSubscribers.length,
        estimatedBatches: Math.ceil(totalSubscribers.length / BATCH_SIZE),
      },
    };
  } catch (error) {
    console.error("Error getting subscriber stats:", error);
    return {
      success: false,
      message: "Failed to get subscriber statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send immediate emails (up to 100) and queue the rest
 * This is the main function called when creating a newsletter
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
    let immediateResult = { success: true, totalSent: 0, message: "" };
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
      queueResult = await addEmailsToQueue(
        newsletterId,
        queuedSubscribers,
        title,
        content
      );
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

/**
 * Send emails to a list of subscribers (helper function)
 */
async function sendEmailsToSubscribers(
  subscribers: Array<{
    email: string;
    name: string | null;
    unsubscribeToken: string;
  }>,
  title: string,
  content: string
) {
  try {
    // Prepare email data for all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      // Generate unsubscribe URL
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/unsubscribe?token=${subscriber.unsubscribeToken}`;

      // Render the email template
      const emailHtml = await render(
        NewsletterEmail({
          title,
          content,
          recipientName: subscriber.name || undefined,
          unsubscribeUrl,
        })
      );

      return {
        from: FROM_EMAIL,
        to: [subscriber.email],
        subject: title,
        html: emailHtml,
      };
    });

    // Wait for all email templates to be rendered
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

      try {
        const { data, error } = await resend.batch.send(batch);

        if (error) {
          console.error(`❌ Batch ${i + 1} failed:`, error);
          totalFailures += batch.length;
        } else {
          console.log(`✅ Batch ${i + 1} sent successfully`);
          totalSent += batch.length;
        }

        // Add delay between batches to respect rate limits (2 requests/second)
        if (i < batches.length - 1) {
          console.log("Waiting 1 second before next batch...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error sending batch ${i + 1}:`, error);
        totalFailures += batch.length;
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
 */
async function addEmailsToQueue(
  newsletterId: string,
  subscribers: Array<{
    email: string;
    name: string | null;
    unsubscribeToken: string;
  }>,
  title: string,
  content: string
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
        status: "pending" as const,
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
          eq(emailQueueTable.status, "pending"),
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

      // Get subscriber tokens for unsubscribe URLs
      const emailsWithTokens = [];
      for (const email of newsletterEmails) {
        const [subscriber] = await db
          .select({ unsubscribeToken: subscriberTable.unsubscribeToken })
          .from(subscriberTable)
          .where(eq(subscriberTable.email, email.recipientEmail))
          .limit(1);

        if (subscriber) {
          emailsWithTokens.push({
            ...email,
            unsubscribeToken: subscriber.unsubscribeToken,
          });
        } else {
          console.warn(
            `Subscriber not found for email: ${email.recipientEmail}`
          );
        }
      }

      // Send emails for this newsletter
      const result = await sendEmailsToSubscribers(
        emailsWithTokens.map((email) => ({
          email: email.recipientEmail,
          name: email.recipientName,
          unsubscribeToken: email.unsubscribeToken,
        })),
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
 * Mark emails as sent
 */
async function markEmailsAsSent(emailIds: string[]) {
  if (emailIds.length === 0) return;

  await db
    .update(emailQueueTable)
    .set({
      status: "sent",
      sentAt: new Date(),
    })
    .where(inArray(emailQueueTable.id, emailIds));
}

/**
 * Mark emails as failed and increment attempts
 */
async function markEmailsAsFailed(emailIds: string[], errorMessage: string) {
  if (emailIds.length === 0) return;

  // For simplicity, we'll update them one by one to increment attempts
  for (const id of emailIds) {
    // First get current attempts count
    const [currentEmail] = await db
      .select({ attempts: emailQueueTable.attempts })
      .from(emailQueueTable)
      .where(eq(emailQueueTable.id, id))
      .limit(1);

    const newAttempts = (currentEmail?.attempts || 0) + 1;

    await db
      .update(emailQueueTable)
      .set({
        status: "failed",
        errorMessage,
        attempts: newAttempts,
      })
      .where(eq(emailQueueTable.id, id));
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  try {
    const [pendingCount] = await db
      .select({ count: emailQueueTable.id })
      .from(emailQueueTable)
      .where(eq(emailQueueTable.status, "pending"));

    const [sentCount] = await db
      .select({ count: emailQueueTable.id })
      .from(emailQueueTable)
      .where(eq(emailQueueTable.status, "sent"));

    const [failedCount] = await db
      .select({ count: emailQueueTable.id })
      .from(emailQueueTable)
      .where(eq(emailQueueTable.status, "failed"));

    return {
      success: true,
      stats: {
        pending: pendingCount?.count || 0,
        sent: sentCount?.count || 0,
        failed: failedCount?.count || 0,
        totalInQueue:
          (pendingCount?.count || 0) +
          (sentCount?.count || 0) +
          (failedCount?.count || 0),
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
