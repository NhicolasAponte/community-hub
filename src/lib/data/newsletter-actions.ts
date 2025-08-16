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

    await db.insert(newsletterTable).values(validatedData);

    revalidatePath(ManageNewslettersPage.href);
    revalidatePath(NewsletterPage.href);
    return { success: true, message: "Newsletter created successfully" };
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
