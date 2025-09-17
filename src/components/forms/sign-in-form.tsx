"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signInFormSchema,
  SignInFormData,
  FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { useFormStatus } from "react-dom";

interface SignInFormProps {
  action?: (data: SignInFormData) => Promise<FormSubmissionResult>;
}

const SignInForm: React.FC<SignInFormProps> = ({ action }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { pending } = useFormStatus();

  async function onSubmit(data: SignInFormData) {
    if (!action) return;

    setIsSubmitting(true);
    try {
      const result = await action(data);

      if (!result.success) {
        console.error("Sign in failed:", result.message);

        // Set form errors if provided
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof SignInFormData, {
              type: "server",
              message: messages[0],
            });
          });
        } else {
          // Set a general error
          form.setError("root", {
            type: "server",
            message: result.message || "Sign in failed. Please try again.",
          });
        }

        // Reset form with preserved field values if provided
        if (result.fields) {
          form.reset(result.fields as SignInFormData);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to access the admin dashboard
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    {...field}
                    disabled={isSubmitting || pending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={isSubmitting || pending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display root form errors */}
          {form.formState.errors.root && (
            <div className="text-sm text-red-500 text-center">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || pending}
          >
            {isSubmitting || pending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Development credentials: <br />
          Email: admin@communhub.local <br />
          Password: admin123
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
