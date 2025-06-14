"use client";

import DesktopNavHeader from "./desktop-nav-header";
import MobileNavHeader from "./mobile-nav-header";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export default function ResponsiveNavHeader() {
  // Matches Tailwind's `md` breakpoint: anything smaller is mobile
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? <MobileNavHeader /> : <DesktopNavHeader />;
}
