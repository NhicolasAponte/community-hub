"use client";
import NewsletterCard from "@/components/newsletter/newsletter-card";
import { Newsletter } from "@/lib/data-model/schema-types";
import React, { useState } from "react";

interface NewsletterControllerProps {
  newsletters: Newsletter[];
}

const NewsletterController = ({ newsletters }: NewsletterControllerProps) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };
  // Mock data for development - remove when actual data is passed from server
  const mockNewsletters: Newsletter[] = newsletters?.length
    ? newsletters
    : [
        {
          id: "1",
          title: "Welcome to Our Community Hub!",
          content:
            "We're excited to launch our new community platform where neighbors can connect, discover local events, and support each other. This newsletter will keep you updated on all the latest happenings in our vibrant community. From upcoming farmers markets to volunteer opportunities, we've got you covered.",
          date: "2025-08-01",
        },
        {
          id: "2",
          title: "August Events Roundup",
          content:
            "This month is packed with exciting events! Join us for the Summer Music Festival on August 15th, participate in the Community Garden Workshop on August 22nd, and don't miss the local artisan market every Saturday. We also have several volunteer opportunities available for those looking to give back to the community.",
          date: "2025-08-03",
        },
        {
          id: "3",
          title: "New Local Businesses Spotlight",
          content:
            "We're thrilled to welcome three new businesses to our neighborhood! Green Bean Coffee Co. just opened on Main Street, offering locally roasted coffee and fresh pastries. The Corner Bookstore is now open with a wonderful selection of books and community reading events. Finally, Fresh Harvest Market brings organic produce directly from local farms.",
          date: "2025-08-04",
        },
      ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Community Newsletter
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay connected with the latest news, events, and updates from our
          community
        </p>
      </header>

      {/* Newsletter Grid */}
      <section className="space-y-6">
        {mockNewsletters.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {mockNewsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                isExpanded={expandedCards.has(newsletter.id)}
                onToggleExpand={() => toggleExpanded(newsletter.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No newsletters yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for community updates and news!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Future: Newsletter subscription section */}
      <section className="mt-12 sm:mt-16 text-center">
        <div className="bg-primary/5 rounded-lg p-6 sm:p-8 border border-primary/20">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            Stay In The Loop
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to receive the latest community updates directly in your
            inbox
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsletterController;
