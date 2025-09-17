"use client";

import ResponsiveCarousel from "@/components/main-page/Carousel/responsive-carousel";
import NewsletterSubscriptionForm from "@/components/newsletter/newsletter-subscription";
import EventCard from "@/components/events/event-card";
import VendorCard from "@/components/cards/vendor-card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Calendar, Users, Store, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

const events = [
  {
    id: "1",
    name: "Thrifty Photo Shoot!",
    location: "Central Park",
    date: "March 15, 2025",
    description:
      "Bring your favorite thrifted pieces for a sunny photoshoot in the heart of the city.",
  },
  {
    id: "2",
    name: "Dog Day at the Park",
    location: "Riverside Park",
    date: "March 22, 2025",
    description:
      "A fun day for dog lovers and their furry friends. Food trucks and pet activities included!",
  },
  {
    id: "3",
    name: "Valentine's Speed Dating",
    location: "Downtown Cafe",
    date: "February 14, 2025",
    description:
      "Meet new people in a relaxed and friendly environment with coffee and conversation.",
  },
];

const featuredVendors = [
  {
    id: "1",
    name: "Sunrise Coffee Co.",
    description:
      "Local artisan coffee roasters specializing in ethically sourced beans",
    services: "Coffee, Pastries, Catering",
    address: "123 Main Street",
    email: "hello@sunrisecoffee.com",
    phone: "(555) 123-4567",
    links: null,
  },
  {
    id: "2",
    name: "Green Thumb Gardens",
    description: "Organic plant nursery and garden consultation services",
    services: "Plants, Garden Design, Workshops",
    address: "456 Garden Way",
    email: "info@greenthumb.com",
    phone: "(555) 987-6543",
    links: null,
  },
];

export default function Home() {
  const eventsRef = useRef<HTMLDivElement>(null);
  const vendorsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/10 to-secondary/20 py-12 sm:py-16 lg:py-20 px-4"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div
              className="p-3 sm:p-4 bg-primary/10 rounded-full"
              aria-hidden="true"
            >
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </div>
          </div>
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
          >
            Welcome to Our
            <span className="text-primary block mt-2">Community Hub</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Connecting neighbors, celebrating local businesses, and building
            stronger communities together. Discover events, support local
            vendors, and stay connected with what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={() => scrollToSection(eventsRef)}
              className="gap-2 min-h-[44px] touch-manipulation"
              aria-describedby="events-description"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              View Upcoming Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection(vendorsRef)}
              className="gap-2 min-h-[44px] touch-manipulation"
              aria-describedby="vendors-description"
            >
              <Store className="w-5 h-5" aria-hidden="true" />
              Explore Local Vendors
            </Button>
          </div>
          <div className="sr-only">
            <p id="events-description">
              Navigate to the upcoming events section to see community
              activities
            </p>
            <p id="vendors-description">
              Navigate to the vendors section to discover local businesses
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription - Integrated */}
      <section
        className="py-12 sm:py-16 px-4 bg-muted/30"
        aria-labelledby="newsletter-heading"
        id="main-content"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2
              id="newsletter-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4"
            >
              Stay Connected
            </h2>
            <p className="text-muted-foreground px-2">
              Get the latest community news, event updates, and vendor
              spotlights delivered to your inbox.
            </p>
          </div>
          <div className="max-w-md mx-auto px-4">
            <NewsletterSubscriptionForm
              className="bg-card border shadow-lg"
              title=""
              description=""
            />
          </div>
        </div>
      </section>

      {/* Community Highlights - Instagram Carousel */}
      <section
        className="py-12 sm:py-16 px-4"
        aria-labelledby="highlights-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2
              id="highlights-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4"
            >
              Community Highlights
            </h2>
            <p className="text-muted-foreground px-2">
              See what&apos;s happening in our vibrant community
            </p>
          </div>
          <div aria-label="Community photo carousel">
            <ResponsiveCarousel />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section
        ref={eventsRef}
        className="py-12 sm:py-16 px-4 bg-muted/20"
        aria-labelledby="events-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className="p-2 sm:p-3 bg-primary/10 rounded-full"
                aria-hidden="true"
              >
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h2
              id="events-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4"
            >
              Upcoming Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-2">
              Join us for exciting community events that bring neighbors
              together and celebrate what makes our area special.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
            role="list"
            aria-label="Upcoming community events"
          >
            {events.map((event) => (
              <div key={event.id} role="listitem">
                <EventCard event={event} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/events" className="inline-block">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 min-h-[44px] touch-manipulation"
                aria-label="View all community events"
              >
                View All Events
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section
        ref={vendorsRef}
        className="py-12 sm:py-16 px-4"
        aria-labelledby="vendors-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className="p-2 sm:p-3 bg-primary/10 rounded-full"
                aria-hidden="true"
              >
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h2
              id="vendors-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4"
            >
              Featured Local Vendors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-2">
              Support our amazing local businesses that make our community
              unique and vibrant.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
            role="list"
            aria-label="Featured local vendors and businesses"
          >
            {featuredVendors.map((vendor) => (
              <div key={vendor.id} role="listitem">
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/vendors" className="inline-block">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 min-h-[44px] touch-manipulation"
                aria-label="Discover all local vendors and businesses"
              >
                Discover All Vendors
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Stats & CTA */}
      <section
        className="py-12 sm:py-16 px-4 bg-primary/5"
        aria-labelledby="community-stats-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="community-stats-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8"
          >
            Join Our Growing Community
          </h2>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
            role="list"
            aria-label="Community statistics"
          >
            <div className="text-center" role="listitem">
              <div
                className="text-2xl sm:text-3xl font-bold text-primary mb-2"
                aria-label="50 plus local vendors"
              >
                50+
              </div>
              <div className="text-muted-foreground">Local Vendors</div>
            </div>
            <div className="text-center" role="listitem">
              <div
                className="text-2xl sm:text-3xl font-bold text-primary mb-2"
                aria-label="20 plus monthly events"
              >
                20+
              </div>
              <div className="text-muted-foreground">Monthly Events</div>
            </div>
            <div className="text-center" role="listitem">
              <div
                className="text-2xl sm:text-3xl font-bold text-primary mb-2"
                aria-label="1000 plus community members"
              >
                1000+
              </div>
              <div className="text-muted-foreground">Community Members</div>
            </div>
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/events" className="inline-block">
              <Button
                size="lg"
                className="gap-2 min-h-[44px] touch-manipulation w-full sm:w-auto"
                aria-label="Get involved in community events"
              >
                <Users className="w-5 h-5" aria-hidden="true" />
                Get Involved
              </Button>
            </Link>
            <Link href="/vendors" className="inline-block">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 min-h-[44px] touch-manipulation w-full sm:w-auto"
                aria-label="List your business as a vendor"
              >
                List Your Business
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </div> */}
        </div>
      </section>
    </main>
  );
}
