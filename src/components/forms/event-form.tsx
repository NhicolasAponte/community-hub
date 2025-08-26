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
  eventFormSchema,
  EventFormData,
  FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { useFormStatus } from "react-dom";

interface EventFormProps {
  defaultValues?: EventFormData;
  action?: (data: EventFormData) => Promise<FormSubmissionResult>;
  closeForm: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  defaultValues,
  action,
  closeForm,
}) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      date: "",
      location: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { pending } = useFormStatus();

  async function onSubmit(data: EventFormData) {
    if (!action) return;
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormDescription>The name of the event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A brief description" {...field} />
              </FormControl>
              <FormDescription>What is this event about?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;