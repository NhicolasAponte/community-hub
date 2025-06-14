"use client";

import DesktopCarousel from "./desktop-carousel";
import MobileCarousel from "./mobile-carousel";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export default function ResponsiveCarousel() {
  // Tailwind’s md breakpoint: mobile if under 768px
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? <MobileCarousel /> : <DesktopCarousel />;
}
