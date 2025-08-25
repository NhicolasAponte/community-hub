"use server";
import { db, newsletterTable } from "@/db";
import { revalidatePath } from "next/cache";
import {
  newsletterFormSchema,
  NewsletterFormData,
  FormSubmissionResult,
} from "../zod-schema/form-schema";
import { eq } from "drizzle-orm";
import { Newsletter } from "../data-model/schema-types";
import { NewsletterPage, ManageNewslettersPage } from "../routes";
import { queueNewsletterEmails } from "../email-service";

export async function fetchNewsletters(): Promise<Newsletter[]> {
  console.log("Fetching newsletters...");
  const newsletters = await db.select().from(newsletterTable);
  console.log("Newsletters: ", newsletters);
  return newsletters;
}

export async function createNewsletter(
  formData: NewsletterFormData
): Promise<FormSubmissionResult> {
  console.log("Creating newsletter...");
  console.log("FormData: ", formData);

  try {
    // IMPLEMENTATION NOTE: authorization and authentication should be handled here
    const parsedData = newsletterFormSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log(
        "Validation failed: ",
        parsedData.error.flatten().fieldErrors
      );
      return {
        success: false,
        message: "invalid fields",
        errors: parsedData.error.flatten().fieldErrors,
        fields: formData,
      };
    }
    const validatedData = parsedData.data;

    // Insert the newsletter and get the created record
    const [createdNewsletter] = await db
      .insert(newsletterTable)
      .values(validatedData)
      .returning();

    // Queue emails for all subscribers
    const emailResult = await queueNewsletterEmails({
      newsletterId: createdNewsletter.id,
      title: createdNewsletter.title,
      content: createdNewsletter.content,
    });

    if (!emailResult.success) {
      console.warn(
        "Newsletter created but email queuing failed:",
        emailResult.message
      );
      // Don't fail the newsletter creation if email queuing fails
    } else {
      console.log("Newsletter created and emails queued:", emailResult.message);
    }

    revalidatePath(ManageNewslettersPage.href);
    revalidatePath(NewsletterPage.href);

    return {
      success: true,
      message: emailResult.success
        ? `Newsletter created successfully. ${emailResult.message}`
        : "Newsletter created successfully, but email queuing failed. Emails can be queued manually later.",
    };
  } catch (error) {
    console.error("Error creating newsletter: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function updateNewsletter(
  newsletterId: string,
  formData: NewsletterFormData
): Promise<FormSubmissionResult> {
  console.log("Updating newsletter...");
  try {
    const parsedData = newsletterFormSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log(
        "Validation failed: ",
        parsedData.error.flatten().fieldErrors
      );
      return {
        success: false,
        message: "invalid fields",
        errors: parsedData.error.flatten().fieldErrors,
        fields: formData,
      };
    }
    const validatedData = parsedData.data;

    await db
      .update(newsletterTable)
      .set(validatedData)
      .where(eq(newsletterTable.id, newsletterId));

    revalidatePath(ManageNewslettersPage.href);
    revalidatePath(NewsletterPage.href);
    return { success: true, message: "Newsletter updated successfully" };
  } catch (error) {
    console.error("Error updating newsletter: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteNewsletter(newsletterId: string) {
  console.log("Deleting newsletter...");
  await db.delete(newsletterTable).where(eq(newsletterTable.id, newsletterId));

  revalidatePath(ManageNewslettersPage.href);
  revalidatePath(NewsletterPage.href);
}
