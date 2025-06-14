/**
 * @fileoverview This file contains the client component VendorForm
 * @module components/forms/vendor-form
 * @author Nhicolas Aponte
 * @version 0.0.0
 * @date 03-03-2025
 */
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
  newVendorSchema,
  VendorFormData,
  VendorFormState,
} from "@/lib/zod-schema/vendor-schema";
import { createVendor } from "@/lib/actions/vendor-actions";
import { useFormStatus } from "react-dom";

interface VendorFormProps {
  defaultValues?: VendorFormData;
  action?: (data: VendorFormData) => Promise<VendorFormState>;
  closeForm: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({
  defaultValues,
  action = createVendor,
  closeForm,
}) => {
  const form = useForm<VendorFormData>({
    resolver: zodResolver(newVendorSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      email: "",
      phone: undefined,
      address: undefined,
      services: undefined,
      links: undefined,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { pending } = useFormStatus();

  async function onSubmit(data: VendorFormData) {
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
        className="form-grid space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Business name" {...field} />
              </FormControl>
              <FormDescription>The name of the vendor.</FormDescription>
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
              <FormDescription>What they do or offer.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <Input placeholder="Hair, makeup, rentals, etc." {...field} />
              </FormControl>
              <FormDescription>Optional – comma-separated list.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="links"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Links</FormLabel>
              <FormControl>
                <Input placeholder="Website, socials, etc." {...field} />
              </FormControl>
              <FormDescription>Optional – comma-separated list.</FormDescription>
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

export default VendorForm;
