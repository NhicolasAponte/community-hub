"use client";
import React, { useState } from "react";
import { Heart, Home, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/cards/modal";
import ContactForm from "@/components/forms/contact-form";

const MovingResourcesPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-background -mx-4 sm:-mx-6 lg:-mx-8 -my-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/20 py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
              <Home className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            🏳️‍🌈 Moving to the
            <span className="text-primary block mt-2">Triad? You&apos;re Not Alone</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Whether you&apos;re heading to Winston-Salem, Greensboro, High Point, or anywhere nearby — welcome.
          </p>
        </div>
      </section>

      {/* Understanding Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              We Understand the Extra Questions
            </h2>
          </div>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              If you&apos;re LGBTQIA+, moving to a new place can come with extra questions: Will I be safe here?
              Will I find community? Who can I trust?
            </p>
            <p>
              This page is here to say: <strong className="text-foreground">You&apos;re not alone, and you don&apos;t have to figure it all out by yourself.</strong>
            </p>
            <p>
              As a former queer real estate agent, I know how personal and emotional moving can be — especially
              when your identity is part of the equation. That&apos;s why I created this space: to help folks like you
              feel supported and connected from the very beginning. Whether you&apos;re looking for a new home or just
              trying to get a sense of where to land, I&apos;m here to offer real talk, local insight, and a connection
              to affirming professionals who truly get it.
            </p>
          </div>
        </div>
      </section>

      {/* Support Process Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              💛 I&apos;d Love to Support You in This Move
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Relocating is a big step — and if you&apos;re queer or trans, it can come with added layers. You deserve
              to feel safe, affirmed, and connected from the very beginning. I&apos;d love to support you in this move,
              and help you find more than just a house — a real sense of home.
            </p>
          </div>

          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">
              Here&apos;s how it works:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-card border shadow-sm rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Fill out the form</h4>
                <p className="text-muted-foreground">
                  This helps me understand your situation, needs, and timeframe so I can support you in a
                  thoughtful, personalized way.
                </p>
              </div>

              <div className="bg-card border shadow-sm rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Let&apos;s talk</h4>
                <p className="text-muted-foreground">
                  I&apos;ll reach out by phone, email, or text — whatever works best for you — to learn more about
                  what you&apos;re looking for and how you want to feel in this next chapter.
                </p>
              </div>

              <div className="bg-card border shadow-sm rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Get connected</h4>
                <p className="text-muted-foreground">
                  I&apos;ll match you with an affirming real estate agent who fits your needs, and share local
                  queer resources to help you feel grounded from the moment you arrive.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border shadow-sm rounded-lg p-6 sm:p-8 mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Having someone in your corner who shares your values and knows the landscape — both literally and
              emotionally — can turn a stressful move into something grounded in trust, care, and belonging. I&apos;d
              love to get you connected to make this transition as smooth and successful as possible.
            </p>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="gap-2 min-h-[44px] touch-manipulation"
              onClick={openContactModal}
            >
              Contact Me
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Exists Section */}
      <section className="py-12 sm:py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">
            🌈 Why This Exists
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              I created this project as a way to give back to the queer community that helped me thrive here in
              Winston-Salem. This relocation support is just one part of that — a way to extend that care to
              those arriving next.
            </p>
            <p>
              Offering this kind of support also helps me keep this site running and growing. When you choose to
              connect through me, you&apos;re not just helping yourself — you&apos;re helping sustain a resource that
              exists to uplift and care for our broader community.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <Modal
        open={isContactModalOpen}
        onClose={closeContactModal}
        fullScreenOnDesktop={true}
      >
        <ContactForm closeForm={closeContactModal} />
      </Modal>
    </div>
  );
};

export default MovingResourcesPage;