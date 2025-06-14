"use server";
import { db, eventTable } from "@/db";
import { revalidatePath } from "next/cache";
import {
  eventFormSchema,
  EventFormData,
  FormSubmissionResult,
} from "../zod-schema/form-schema";
import { eq } from "drizzle-orm";
import { Event } from "../data-model/schema-types";
import { EventsPage, ManageEventsPage } from "../routes";

// Adjust this to your events page route

export async function fetchEvents(): Promise<Event[]> {
  console.log("Fetching events...");

  const events = await db.select().from(eventTable);
  return events;
}

export async function createEvent(
  formData: EventFormData
): Promise<FormSubmissionResult> {
  console.log("Creating event...");
  console.log("FormData: ", formData);

  try {
    const parsedData = eventFormSchema.safeParse(formData);

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

    await db.insert(eventTable).values(validatedData);

    revalidatePath(ManageEventsPage.href);
    revalidatePath(EventsPage.href);

    return { success: true, message: "Event created successfully" };
  } catch (error) {
    console.error("Error creating event: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function updateEvent(
  eventId: string,
  formData: EventFormData
): Promise<FormSubmissionResult> {
  console.log("Updating event...");
  try {
    const parsedData = eventFormSchema.safeParse(formData);

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
      .update(eventTable)
      .set(validatedData)
      .where(eq(eventTable.id, eventId));

    revalidatePath(ManageEventsPage.href);
    revalidatePath(EventsPage.href);
    return { success: true, message: "Event updated successfully" };
  } catch (error) {
    console.error("Error updating event: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteEvent(eventId: string) {
  console.log("Deleting event...");
  await db.delete(eventTable).where(eq(eventTable.id, eventId));
  revalidatePath(ManageEventsPage.href);
  revalidatePath(EventsPage.href);
}
