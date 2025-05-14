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
