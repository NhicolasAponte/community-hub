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

export type FormSubmissionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  fields?: Record<string, string>;
  // errors?: {
  //     [key: string]: string[];
  // }
};

export const eventFormSchema = z.object({
  name: z.string().min(1, { message: "Enter the name of the Event" }),
  description: z.string(),
  date: z.string().min(1, { message: "Enter the date of the Event" }),
  location: z.string().min(1, { message: "Enter the location of the Event" }),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const newsletterFormSchema = z.object({
  title: z.string().min(1, { message: "Enter the title of the Newsletter" }),
  content: z
    .string()
    .min(1, { message: "Enter the content of the Newsletter" }),
  date: z.string().min(1, { message: "Enter the date of the Newsletter" }),
});

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

export const subscriptionFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  movingTimeline: z.string().min(1, { message: "Please select your moving timeline" }),
  message: z.string().min(10, { message: "Please provide more details (at least 10 characters)" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
