import ComingSoonCard from "@/components/cards/coming-soon";
import React from "react";

const AboutPage = () => (
  <section className="bg-background text-foreground min-h-[60vh] flex items-center justify-center px-4 py-12">
    <ComingSoonCard title="About Us" message="Please check back later to learn about our mission!"/>
  </section>
);

export default AboutPage;
