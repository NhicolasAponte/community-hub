"use client";
import React from "react";
import NewsletterController from "./newletter-controller";

const NewsletterPage = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8">
      <NewsletterController />
    </div>
  );
};

export default NewsletterPage;
