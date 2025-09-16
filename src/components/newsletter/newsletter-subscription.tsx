"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  subscriptionFormSchema,
  SubscriptionFormData,
  FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { createSubscription } from "@/lib/data/subscription-actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

interface NewsletterSubscriptionProps {
  className?: string;
  title?: string;
  description?: string;
  action?: (data: SubscriptionFormData) => Promise<FormSubmissionResult>;
}

export default function NewsletterSubscriptionForm({
  className = "",
  title = "Subscribe to Our Newsletter",
  description = "Stay updated with the latest community news and events.",
  action = createSubscription,
}: NewsletterSubscriptionProps) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { pending } = useFormStatus();

  async function onSubmit(data: SubscriptionFormData) {
    setMessage(null);

    const {
      success,
      errors,
      fields,
      message: resultMessage,
    } = await action(data);

    if (!success) {
      console.error("Subscription failed with errors: ", errors);
      setMessage({
        type: "error",
        text: resultMessage || "Failed to subscribe. Please try again.",
      });

      // Reset form with the data that failed validation
      form.reset({
        ...data,
        ...fields,
      });
    }

    if (success) {
      setMessage({
        type: "success",
        text: resultMessage || "Successfully subscribed to newsletter!",
      });
      form.reset();
    }
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    disabled={pending}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll use this to personalize your emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    disabled={pending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-gray-500 mt-3">
        By subscribing, you agree to receive newsletter emails. You can
        unsubscribe at any time.
      </p>
    </div>
  );
}
