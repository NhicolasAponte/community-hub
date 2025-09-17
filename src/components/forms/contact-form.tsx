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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
    contactFormSchema,
    ContactFormData,
    FormSubmissionResult,
} from "@/lib/zod-schema/form-schema";
import { useFormStatus } from "react-dom";

interface ContactFormProps {
    defaultValues?: ContactFormData;
    action?: (data: ContactFormData) => Promise<FormSubmissionResult>;
    closeForm: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
    defaultValues,
    action,
    closeForm,
}) => {
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: defaultValues || {
            name: "",
            email: "",
            phone: "",
            movingTimeline: "",
            message: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const { pending } = useFormStatus();

    async function onSubmit(data: ContactFormData) {
        if (!action) {
            // For now, just log the data and close the form
            console.log("Contact form submission:", data);
            closeForm();
            return;
        }

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
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Get Moving Support</h2>
                <p className="text-muted-foreground">
                    Tell me about your move and I&apos;ll connect you with trusted, affirming professionals who can help.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4 sm:space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your full name" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="your.email@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(555) 123-4567" type="tel" {...field} />
                                    </FormControl>
                                    <FormDescription>Optional - for easier communication</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="movingTimeline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Moving Timeline *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="When are you planning to move?" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immediately (within 1 month)</SelectItem>
                                            <SelectItem value="short-term">1-3 months</SelectItem>
                                            <SelectItem value="medium-term">3-6 months</SelectItem>
                                            <SelectItem value="long-term">6+ months</SelectItem>
                                            <SelectItem value="exploring">Just exploring options</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tell me about your move *</FormLabel>
                                <FormControl>
                                    <textarea
                                        placeholder="What brings you to the Triad? What kind of support are you looking for? Any specific needs or questions about the area?"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Share as much or as little as you&apos;re comfortable with. This helps me connect you with the right people and resources.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={closeForm}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending}>
                            {pending ? "Sending..." : "Send Message"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ContactForm;