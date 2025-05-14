"use server"; 
import { db, vendorTable } from "@/db";
import { revalidatePath } from "next/cache";
import { newVendorSchema } from "../zod-schema/vendor-schema";
import { VendorsPage } from "../routes";

export async function createVendor(formData: FormData) {
    console.log("Creating vendor...")
    console.log("FormData: ", formData);
    const rawData = Object.fromEntries(formData.entries());
    const parsedData = newVendorSchema.safeParse(rawData);

    if ( !parsedData.success) {
        console.log("Validation failed: ", parsedData.error.flatten().fieldErrors);
        throw new Error("Validation failed: " + JSON.stringify(parsedData.error.flatten().fieldErrors));
        // return { success: false, error: parsedData.error.flatten().fieldErrors };
    }
    console.log("data validated")
    const validatedData = parsedData.data;

    await db.insert(vendorTable).values(validatedData)

    revalidatePath(VendorsPage.href)
    // return { success: true };
}