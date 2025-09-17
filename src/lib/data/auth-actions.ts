"use server";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import {
  signInFormSchema,
  SignInFormData,
  FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { AuthError } from "next-auth";

export async function signInAction(
  formData: SignInFormData
): Promise<FormSubmissionResult> {
  console.log("Sign in attempt:", { email: formData.email });

  try {
    // Validate the form data
    const parsedData = signInFormSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log("Validation failed:", parsedData.error.flatten().fieldErrors);
      return {
        success: false,
        message: "Invalid form data",
        errors: parsedData.error.flatten().fieldErrors,
        fields: formData,
      };
    }

    const validatedData = parsedData.data;

    // Attempt to sign in with credentials
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    // If we get here, sign in was successful
    console.log("Sign in successful, redirecting to admin");
  } catch (error) {
    console.error("Sign in error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
            fields: formData,
          };
        default:
          return {
            success: false,
            message: "An error occurred during sign in",
            fields: formData,
          };
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred",
      fields: formData,
    };
  }

  // Redirect to admin dashboard on success
  redirect("/admin");
}
