/**
 * @fileoverview This file contains the client component NewVendorForm
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
// import { useActionState } from "react"; // implement when migrating to Nextjs 15
import { useFormStatus } from "react-dom";
// import { useFormState } from "react-dom"; // deprecated, use useActionState instead

interface VendorFormProps {
  defaultValues?: VendorFormData;
  // action: (previousState: VendorFormState, formData: FormData) => Promise<VendorFormState>;
  action?: (data: VendorFormData) => Promise<VendorFormState>;
  closeForm: () => void; // Optional prop to control visibility of the form 
}

// not needed when using react-hook-form with zod
// const initialFormState: VendorFormState = {
//   success: false,
//   message: "",
// }

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
      // instagram: undefined,
      // twitter: undefined,
      // linkedin: undefined,
      // facebook: undefined,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  // Next.js 15 convention
  // const [state, formAction, isPending] = useActionState(action, initialFormState)
  // Next.js 14 convention
  const { pending } = useFormStatus();
  // formState is what the server returns after the server action is completed
  // const [formState, formAction] = useFormState(action, initialFormState);

  // console.log("Form state: ", formState);

  async function onSubmit(data: VendorFormData) {
    console.log("DATA: ");
    console.log(data);
    const {success, message, errors, fields } = await action(data);
    console.log("Action message: ", message);
    if (!success) {
      console.error("Action failed with errors: ", errors);
      // repopulate the form with the previous values
      form.reset({
        ...data,
        ...fields, // this will repopulate the fields with the values from the server action
      });
    } 
    if (success) {
      console.log("Vendor created successfully");
      // reset the form to the default values
      form.reset();
      closeForm(); 
    }
  }

  // NOTE: the shadcn form component uses react-hook-form under the hood, so we can use its methods directly
  // NOTE: to use the client side validation provided by the zod schema and react-hook-form, use the `handleSubmit` method from the form instance instead of the action prop
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the vendor.</FormDescription>
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
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Enter a description of the vendor.
              </FormDescription>
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
                <Input
                  placeholder="Services"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Enter the services of the vendor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the email of the vendor.
                </FormDescription>
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
                  <Input
                    placeholder="Phone"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>
                  Enter the phone number of the vendor.
                </FormDescription>
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
                <Input
                  placeholder="Address"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                Enter the address of the vendor.
              </FormDescription>
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
                <Input
                  placeholder="Links"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormDescription>
                Enter links for the vendor&#39;s website, social media, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Instagram"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>
                  Enter the Instagram of the vendor.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Twitter"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>Twitter link of the vendor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LinkedIn"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>LinkedIn of the vendor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Facebook"
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormDescription>Facebook of the vendor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
        <Button type="submit" aria-disabled={pending}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default VendorForm;
