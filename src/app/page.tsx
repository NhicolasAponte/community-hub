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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/20 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Heart className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to Our
            <span className="text-primary block">Community Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connecting neighbors, celebrating local businesses, and building
            stronger communities together. Discover events, support local
            vendors, and stay connected with what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection(eventsRef)}
              className="gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Upcoming Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection(vendorsRef)}
              className="gap-2"
            >
              <Store className="w-5 h-5" />
              Explore Local Vendors
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription - Integrated */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Connected
            </h2>
            <p className="text-muted-foreground">
              Get the latest community news, event updates, and vendor
              spotlights delivered to your inbox.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <NewsletterSubscriptionForm
              className="bg-card border shadow-lg"
              title=""
              description=""
            />
          </div>
        </div>
      </section>

      {/* Community Highlights - Instagram Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Community Highlights
            </h2>
            <p className="text-muted-foreground">
              See what&apos;s happening in our vibrant community
            </p>
          </div>
          <ResponsiveCarousel />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section ref={eventsRef} className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us for exciting community events that bring neighbors
              together and celebrate what makes our area special.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/events">
              <Button size="lg" variant="outline" className="gap-2">
                View All Events
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section ref={vendorsRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Store className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Featured Local Vendors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Support our amazing local businesses that make our community
              unique and vibrant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {featuredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/vendors">
              <Button size="lg" variant="outline" className="gap-2">
                Discover All Vendors
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Stats & CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Join Our Growing Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Local Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">Monthly Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Community Members</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                Get Involved
              </Button>
            </Link>
            <Link href="/vendors">
              <Button size="lg" variant="outline" className="gap-2">
                List Your Business
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
