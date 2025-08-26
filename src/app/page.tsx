"use client";

import ResponsiveCarousel from "@/components/main-page/Carousel/responsive-carousel";
import NewsletterSubscriptionForm from "@/components/newsletter/newsletter-subscription";
import { useRef } from "react";
// import { useMediaQuery } from "@/lib/hooks/use-media-query";

const events = [
  {
    id: 1,
    name: "Thrifty Photo Shoot!",
    place: "Central Park",
    description: "bring your favorite thrifted pieces for a sunny photoshoot.",
  },
  {
    id: 2,
    name: "Dog Day at the Park",
    place: "Riverside Park",
    description: "A fun day for dog lovers and their furry friends.",
  },
  {
    id: 3,
    name: "Valentine's Speed Dating",
    place: "Downtown Cafe",
    description: "Meet new people in a relaxed and friendly environment.",
  },
];

export default function Home() {
  // const isMobile = useMediaQuery("(max-width: 767px)");
  const eventsRef = useRef<HTMLDivElement>(null);

  // const handleJumpToEvents = () => {
  //   eventsRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 space-y-12">
      <section>
        <NewsletterSubscriptionForm />
      </section>
      {/* Instagram Carousel */}
      <ResponsiveCarousel />
      {/* TODO : Add back the button (uncomment) and only have it appear when you can't see the upcoming events on mobile*/}
      {/* TODO : OR! make the words "upcoming events" themselves be a button that when tapped scrolls u down to the events */}
      {/* {isMobile && (
        <button
          onClick={handleJumpToEvents}
          className="fixed bottom-20 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg z-50"
        >
          Upcoming Events
        </button>
      )} */}

      {/* Events Section */}
      <div ref={eventsRef} className="w-full max-w-2xl p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Upcoming Events
        </h1>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-card rounded-xl shadow-sm border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {event.name}
              </h2>
              <p className="text-muted-foreground">📍 {event.place}</p>
              <p className="text-muted-foreground mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
