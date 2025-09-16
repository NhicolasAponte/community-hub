"use server";
import React from "react";
import NewsletterController from "./newsletter-controller";
import { Newsletter } from "@/lib/data-model/schema-types";

const NewsletterPage = () => {
  // TODO: Replace with actual database fetch
  // const newsletters = await fetchNewsletters();
  const newsletters: Newsletter[] = []; // Empty array for now, mock data will be used in controller

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8">
      <NewsletterController newsletters={newsletters} />
    </div>
  );
};

export default NewsletterPage;
