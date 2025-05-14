/**
 * @fileoverview This file contains the client component NewVendorForm
 * @module components/forms/new-vendor-form
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
import { newVendorSchema } from "@/lib/zod-schema/vendor-schema";
import { z } from "zod";
import { createVendor } from "@/lib/actions/vendor-actions";

const NewVendorForm = () => {
  const form = useForm<z.infer<typeof newVendorSchema>>({
    resolver: zodResolver(newVendorSchema),
    defaultValues: {
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
  });

  // function onSubmit(data: z.infer<typeof newVendorSchema>) {
  //   console.log("DATA: ")
  //   console.log(data);
  // }
  // TODO: add error handling 
  return (
    <Form {...form}>
      <form action={createVendor} className="form">
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
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default NewVendorForm;
