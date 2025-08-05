import React from "react";
import { Newsletter } from "@/lib/data-model/schema-types";
import { Calendar, Clock } from "lucide-react";

interface NewsletterCardProps {
  newsletter: Newsletter;
}

const NewsletterCard = ({ newsletter }: NewsletterCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // fallback to original string if parsing fails
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <article className="rounded-lg overflow-hidden bg-card text-card-foreground shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border">
      <CardHeader 
        title={newsletter.title} 
        date={formatDate(newsletter.date)} 
      />
      <CardContent>
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            {truncateContent(newsletter.content)}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Published {formatDate(newsletter.date)}</span>
            </div>
            <button 
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              onClick={() => {
                // This will be handled by the parent controller for navigation/modal
                console.log('Read more clicked for newsletter:', newsletter.id);
              }}
            >
              Read More →
            </button>
          </div>
        </div>
      </CardContent>
    </article>
  );
};

function CardHeader({ title, date }: { title: string; date: string }) {
  return (
    <header className="bg-primary text-primary-foreground p-4 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold leading-tight line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center space-x-2 text-primary-foreground/80">
          <Clock className="w-4 h-4" />
          <time className="text-sm">{date}</time>
        </div>
      </div>
    </header>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted p-4 sm:p-6">
      {children}
    </div>
  );
}

export default NewsletterCard;
