"use server";
import { addSubscriber } from "../email-service";
import { revalidatePath } from "next/cache";
import {
  subscriptionFormSchema,
  SubscriptionFormData,
  FormSubmissionResult,
} from "../zod-schema/form-schema";

export async function createSubscription(
  formData: SubscriptionFormData
): Promise<FormSubmissionResult> {
  console.log("Creating subscription...");
  console.log("FormData: ", formData);

  try {
    // Validate the form data
    const parsedData = subscriptionFormSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log(
        "Validation failed: ",
        parsedData.error.flatten().fieldErrors
      );
      return {
        success: false,
        message: "Invalid fields",
        errors: parsedData.error.flatten().fieldErrors,
        fields: formData,
      };
    }

    const validatedData = parsedData.data;

    // Call the email service to add subscriber
    const result = await addSubscriber(
      validatedData.email,
      validatedData.name || undefined
    );

    if (result.success) {
      // Revalidate any paths that might show subscription info
      revalidatePath("/");
      return {
        success: true,
        message: result.message,
      };
    } else {
      // Handle specific error cases
      if (
        result.error?.includes("unique") ||
        result.error?.includes("duplicate")
      ) {
        return {
          success: false,
          message: "Email address is already subscribed",
          fields: formData,
        };
      }

      return {
        success: false,
        message: result.message || "Failed to subscribe to newsletter",
        fields: formData,
      };
    }
  } catch (error) {
    console.error("Error creating subscription: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
      fields: formData,
    };
  }
}
