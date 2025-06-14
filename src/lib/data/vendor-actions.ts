"use server";
import { db, vendorTable } from "@/db";
import { revalidatePath } from "next/cache";
import {
  newVendorSchema,
  VendorFormData,
  FormSubmissionResult,
} from "../zod-schema/form-schema";
import { VendorsPage } from "../routes";
import { Vendor } from "../data-model/schema-types";
import { eq } from "drizzle-orm";

export async function fetchVendors(): Promise<Vendor[]> {
  console.log("Fetching vendors...");
  const vendors = await db.select().from(vendorTable);
  console.log("Vendors: ", vendors);
  return vendors;
}
// server action signature
// export async function createVendor(previousState: VendorFormState, formData: FormData): Promise<VendorFormState>
// {
//   console.log("Creating vendor...");
//   console.log("FormData: ", formData);

//   try {
//     const rawData = Object.fromEntries(formData.entries());
//     const parsedData = newVendorSchema.safeParse(rawData);

//     if (!parsedData.success) {
//       console.log(
//         "Validation failed: ",
//         parsedData.error.flatten().fieldErrors
//       );
//       // return data to repopulate fields in case of validation failure
//       return { success: false, message: "invalid fields", errors: parsedData.error.flatten().fieldErrors, fields: rawData };
//     }
//     console.log("data validated");
//     const validatedData = parsedData.data;

//     await db.insert(vendorTable).values(validatedData);

//     revalidatePath(VendorsPage.href);
//     return { success: true, message: "Vendor created successfully" };
//   } catch (error) {
//     console.error("Error creating vendor: ", error);
//     return { success: false, message: ("Unexpected error occurred. Please try again.")};
//   }
// }
export async function createVendor(
  formData: VendorFormData
): Promise<FormSubmissionResult> {
  console.log("Creating vendor...");
  console.log("FormData: ", formData);

  try {
    // IMPLEMENTATION NOTE: authorization and authentication should be handled here
    const parsedData = newVendorSchema.safeParse(formData);

    if (!parsedData.success) {
      console.log(
        "Validation failed: ",
        parsedData.error.flatten().fieldErrors
      );
      // return data to repopulate fields in case of validation failure
      return {
        success: false,
        message: "invalid fields",
        errors: parsedData.error.flatten().fieldErrors,
        fields: formData,
      };
    }
    const validatedData = parsedData.data;

    await db.insert(vendorTable).values(validatedData);

    revalidatePath(VendorsPage.href);
    return { success: true, message: "Vendor created successfully" };
  } catch (error) {
    console.error("Error creating vendor: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function updateVendor(
  vendorId: string,
  formData: VendorFormData
): Promise<FormSubmissionResult> {
  console.log("Updating vendor...");
  // const rawData = Object.fromEntries(formData.entries());
  try {
    const parsedData = newVendorSchema.safeParse(formData);

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
      // return { success: false, error: parsedData.error.flatten().fieldErrors };
    }
    console.log("data validated");
    const validatedData = parsedData.data;

    await db
      .update(vendorTable)
      .set(validatedData)
      .where(eq(vendorTable.id, vendorId));

    revalidatePath(VendorsPage.href);
    return { success: true, message: "Vendor updated successfully" };
  } catch (error) {
    console.error("Error updating vendor: ", error);
    return {
      success: false,
      message: "Unexpected error occurred. Please try again.",
    };
  }
}

export async function deleteVendor(vendorId: string) {
  console.log("Deleting vendor...");
  await db.delete(vendorTable).where(eq(vendorTable.id, vendorId));

  revalidatePath(VendorsPage.href);
}
