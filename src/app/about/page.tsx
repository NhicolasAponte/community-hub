import React from "react";
import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";

const AboutPage = () => (
  <div className="min-h-screen bg-background -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
    {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-primary/10 to-secondary/20 py-12 sm:py-16 lg:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="order-1 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
                <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              About
              <span className="text-primary block mt-2">Our Community</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-none mb-6 sm:mb-8 px-2 lg:px-0">
              Building connections, celebrating queer joy, and creating spaces where everyone can thrive.
            </p>
          </div>

          {/* Right Image */}
          <div className="order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="/assets/group-pride.png"
                alt="A joyful group of community members celebrating together at a Pride event"
                width={450}
                height={350}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content Section */}
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none space-y-8 sm:space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground m-0">
                Hi, I&apos;m Tillie!
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="relative">
                  <Image
                    src="/assets/just-tillie-pride.png"
                    alt="Tillie at a Pride event, smiling and celebrating in the community"
                    width={350}
                    height={280}
                    className="rounded-lg shadow-md"
                    priority
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I&apos;m Tillie (she/her), and I&apos;ve called Winston-Salem home for the past three years.
                  This city has been a place where I&apos;ve felt safe, affirmed, and able to grow into my
                  fullest self — and I believe every queer person deserves that kind of grounding.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground m-0">
                More Than a Guide
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This site is more than a guide — it&apos;s a community effort, a gathering space, and an
              open invitation to connect, support, and celebrate one another. Whether you&apos;re new to
              town or have been here for years, my hope is that this space helps you plug into queer
              joy, find affirming events and vendors, and feel the kind of belonging that only grows
              stronger when we show up for each other.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-full">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground m-0">
                Building Connections
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I used to work as a queer real estate agent, helping LGBTQIA+ folks not just find
                housing, but feel truly at home. Though I&apos;ve since shifted careers, I still see this
                kind of connection-building as essential. If you&apos;re moving to the area, I&apos;d love to
                connect you to a trusted, affirming agent — and more importantly, to a community that
                will welcome you with open arms.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Winston-Salem has given me so much, and this is my way of giving back. This project
                is built on the belief that queer care is a collective act — and together, we can
                create spaces where every one of us can thrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Call to Action Section */}
    <section className="py-12 sm:py-16 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
          Let&apos;s Build Community Together
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every connection matters. Every story shared makes us stronger. Every act of care
          builds the world we want to live in. Welcome to our community — you belong here.
        </p>
      </div>
    </section>
  </div>
);

export default AboutPage;
