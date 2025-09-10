// Optional hybrid approach example - combines custom queue with batch API
import { Resend } from 'resend';
import { db } from '@/db';
import { emailQueue } from '@/db/schema';
import { eq, and, lte, isNull } from 'drizzle-orm';

interface EmailQueueProcessor {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
}

export class HybridEmailQueue implements EmailQueueProcessor {
  private static instance: HybridEmailQueue | null = null;
  private resend: Resend;
  private isProcessing = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly batchSize = 50; // Smaller than Resend's 100 limit for safety
  private readonly delayBetweenBatches = 1100; // 1.1 seconds to respect rate limits

  private constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY!);
  }

  public static getInstance(): HybridEmailQueue {
    if (!HybridEmailQueue.instance) {
      HybridEmailQueue.instance = new HybridEmailQueue();
    }
    return HybridEmailQueue.instance;
  }

  public async start(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('📧 Starting hybrid email queue processor...');
    
    this.intervalId = setInterval(async () => {
      await this.processBatch();
    }, this.delayBetweenBatches);
  }

  public async stop(): Promise<void> {
    this.isProcessing = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Hybrid email queue processor stopped');
  }

  public isRunning(): boolean {
    return this.isProcessing;
  }

  private async processBatch(): Promise<void> {
    if (!this.isProcessing) return;

    try {
      const pendingEmails = await db
        .select()
        .from(emailQueue)
        .where(
          and(
            isNull(emailQueue.sentAt),
            lte(emailQueue.scheduledFor, new Date()),
            eq(emailQueue.status, 'pending')
          )
        )
        .limit(this.batchSize);

      if (pendingEmails.length === 0) return;

      // Separate emails that can use batch API vs need individual processing
      const batchableEmails = pendingEmails.filter(email => 
        !email.attachments && !email.tags && !email.headers
      );
      const individualEmails = pendingEmails.filter(email => 
        email.attachments || email.tags || email.headers
      );

      // Process batchable emails using Resend batch API
      if (batchableEmails.length > 0) {
        await this.processBatchEmails(batchableEmails);
      }

      // Process individual emails one by one for special features
      for (const email of individualEmails) {
        await this.sendSingleQueuedEmail(email);
      }

    } catch (error) {
      console.error('❌ Error processing email batch:', error);
    }
  }

  private async processBatchEmails(emails: any[]): Promise<void> {
    try {
      const batchPayload = emails.map(email => ({
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo: email.replyTo,
      }));

      const response = await this.resend.batch.send(batchPayload);
      
      if (response.error) {
        console.error('❌ Batch send error:', response.error);
        // Mark all emails as failed
        for (const email of emails) {
          await this.markEmailFailed(email.id, response.error.message);
        }
        return;
      }

      // Mark all emails as sent
      const emailIds = emails.map(e => e.id);
      await db
        .update(emailQueue)
        .set({ 
          status: 'sent', 
          sentAt: new Date(),
          resendId: 'batch-processed' // Could store individual IDs if needed
        })
        .where(
          emailIds.length === 1 
            ? eq(emailQueue.id, emailIds[0])
            : and(...emailIds.map(id => eq(emailQueue.id, id)))
        );

      console.log(`✅ Successfully sent batch of ${emails.length} emails`);

    } catch (error) {
      console.error('❌ Batch processing error:', error);
      // Mark all emails as failed and allow individual retry
      for (const email of emails) {
        await this.markEmailFailed(email.id, String(error));
      }
    }
  }

  private async sendSingleQueuedEmail(email: any): Promise<void> {
    // Same individual email processing logic as before
    // This handles emails with attachments, tags, custom headers, etc.
    try {
      const emailPayload: any = {
        from: email.from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        replyTo: email.replyTo,
      };

      // Add special features that batch API doesn't support
      if (email.attachments) emailPayload.attachments = JSON.parse(email.attachments);
      if (email.tags) emailPayload.tags = JSON.parse(email.tags);
      if (email.headers) emailPayload.headers = JSON.parse(email.headers);

      const response = await this.resend.emails.send(emailPayload);
      
      if (response.error) {
        await this.markEmailFailed(email.id, response.error.message);
        return;
      }

      await db
        .update(emailQueue)
        .set({ 
          status: 'sent', 
          sentAt: new Date(),
          resendId: response.data?.id 
        })
        .where(eq(emailQueue.id, email.id));

      console.log(`✅ Successfully sent individual email ${email.id}`);

    } catch (error) {
      await this.markEmailFailed(email.id, String(error));
    }
  }

  private async markEmailFailed(emailId: string, errorMessage: string): Promise<void> {
    const currentEmail = await db
      .select()
      .from(emailQueue)
      .where(eq(emailQueue.id, emailId))
      .limit(1);

    if (currentEmail.length === 0) return;

    const email = currentEmail[0];
    const newRetryCount = (email.retryCount || 0) + 1;
    const maxRetries = 3;

    if (newRetryCount < maxRetries) {
      const nextRetry = new Date(Date.now() + Math.pow(2, newRetryCount) * 60000);
      await db
        .update(emailQueue)
        .set({ 
          retryCount: newRetryCount,
          scheduledFor: nextRetry,
          status: 'pending'
        })
        .where(eq(emailQueue.id, emailId));
      
      console.log(`⏰ Scheduled retry ${newRetryCount} for email ${emailId}`);
    } else {
      await db
        .update(emailQueue)
        .set({ 
          status: 'failed',
          error: errorMessage
        })
        .where(eq(emailQueue.id, emailId));
      
      console.log(`❌ Email ${emailId} failed permanently: ${errorMessage}`);
    }
  }
}
