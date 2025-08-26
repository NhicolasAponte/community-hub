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
import React from "react";
import { useForm } from "react-hook-form";
import {
  newsletterFormSchema,
  NewsletterFormData,
  FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { createNewsletter } from "@/lib/data/newsletter-actions";
import { useFormStatus } from "react-dom";

interface NewsletterFormProps {
  defaultValues?: NewsletterFormData;
  action?: (data: NewsletterFormData) => Promise<FormSubmissionResult>;
  closeForm: () => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  defaultValues,
  action = createNewsletter,
  closeForm,
}) => {
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: defaultValues || {
      title: "",
      content: "",
      date: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { pending } = useFormStatus();

  async function onSubmit(data: NewsletterFormData) {
    const { success, errors, fields } = await action(data);
    // NOTE TODO: implement toast notifications for success and error
    if (!success) {
      console.error("Action failed with errors: ", errors);
      form.reset({
        ...data,
        ...fields,
      });
    }

    if (success) {
      form.reset();
      closeForm();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Newsletter title" {...field} />
              </FormControl>
              <FormDescription>The title of the newsletter.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Write your newsletter content here..."
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The main content of your newsletter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                The publication date of the newsletter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsletterForm;
