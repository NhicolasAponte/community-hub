"use server";
import React from "react";
import { fetchNewsletters } from "@/lib/data/newsletter-actions";
import NewsletterAdminController from "@/components/admin/newsletter-admin-controller";

const AdminNewsletterPage = async () => {
  const newsletters = await fetchNewsletters();

  return (
    <section className="bg-background text-foreground p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manage Newsletters</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage community newsletters.
        </p>
      </div>
      <NewsletterAdminController newsletters={newsletters} />
    </section>
  );
};

export default AdminNewsletterPage;
