"use server"; 
import { db, vendorTable } from "@/db";
import { revalidatePath } from "next/cache";
import { newVendorSchema } from "../zod-schema/vendor-schema";
import { VendorsPage } from "../routes";
import { Vendor } from "../data-model/schema-types";
import { eq } from "drizzle-orm";

export async function fetchVendors(): Promise<Vendor[]>{
    console.log("Fetching vendors...")
    const vendors = await db.select().from(vendorTable)
    console.log("Vendors: ", vendors)
    return vendors
}

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

export async function updateVendor(vendorId: string, formData: FormData) {
    console.log("Updating vendor...")
    const rawData = Object.fromEntries(formData.entries());
    const parsedData = newVendorSchema.safeParse(rawData);

    if ( !parsedData.success) {
        console.log("Validation failed: ", parsedData.error.flatten().fieldErrors);
        throw new Error("Validation failed: " + JSON.stringify(parsedData.error.flatten().fieldErrors));
        // return { success: false, error: parsedData.error.flatten().fieldErrors };
    }
    console.log("data validated")
    const validatedData = parsedData.data;

    await db.update(vendorTable).set(validatedData).where(eq(vendorTable.id, vendorId))

    revalidatePath(VendorsPage.href)
}

export async function deleteVendor(vendorId: string) {
    console.log("Deleting vendor...")
    await db.delete(vendorTable).where(eq(vendorTable.id, vendorId))

    revalidatePath(VendorsPage.href)
}

