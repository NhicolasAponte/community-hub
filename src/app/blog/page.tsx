"use client";
import ComingSoonCard from "@/components/cards/coming-soon";
import React from "react";

const BlogPage = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-6 md:p-8">
      <ComingSoonCard
        title="Blog"
        message="Please check back later for event updates and articles!"
      />
    </div>
  );
};

export default BlogPage;
