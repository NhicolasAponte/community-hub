import { z } from "zod";

export const newVendorSchema = z.object({
  name: z.string().min(1, { message: "Enter the name of the Vendor" }),
  description: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  services: z.string().optional(),
  links: z.string().optional(),
  // instagram: z.string().url().optional(),
  // twitter: z.string().url().optional(),
  // linkedin: z.string().url().optional(),
  // facebook: z.string().url().optional(),
});

/**
 * Type for the vendor form data, inferred using Zod from the newVendorSchema.
 */
export type VendorFormData = z.infer<typeof newVendorSchema>; 

export type VendorFormState = {
    success: boolean;
    message: string; 
    errors?: Record<string, string[]>;
    fields?: Record<string, string>;
    // errors?: {
    //     [key: string]: string[];
    // }
}

export const vendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Enter the name of the Vendor" }),
  description: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  services: z.string().optional(),
  links: z.string().optional(),
  // instagram: z.string().url().optional(),
  // twitter: z.string().url().optional(),
  // linkedin: z.string().url().optional(),
  // facebook: z.string().url().optional(),
});
