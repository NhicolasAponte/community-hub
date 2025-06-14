"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import { instagramPosts } from "@/lib/instagram-posts-temp";
import InstagramSlide from "./instagram-slide";

export default function MobileCarousel() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1, spacing: 16 },
    drag: true,
  });

  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const width = 300;
  const height = 400;
  const cropTopPx = 50;

  // Start auto-scroll interval
  useEffect(() => {
    if (!instanceRef.current) return;

    const slider = instanceRef.current;

    const tick = () => {
      if (!pausedRef.current) {
        slider.next();
      }
    };

    intervalRef.current = setInterval(tick, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [instanceRef]);

  // Handle touch and scroll to pause/resume auto-scroll
  useEffect(() => {
    // Helper to pause auto-scroll
    const pauseAutoScroll = () => {
      pausedRef.current = true;
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
    };

    // Helper to resume auto-scroll after delay
    const resumeAutoScroll = () => {
      if (interactionTimeoutRef.current)
        clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, 600); // 600ms delay after interaction ends
    };

    // Touch start anywhere pauses
    const onTouchStart = () => {
      pauseAutoScroll();
    };

    // Touch end anywhere resumes after delay
    const onTouchEnd = () => {
      resumeAutoScroll();
    };

    // Scroll anywhere pauses and resumes after delay
    const onScroll = () => {
      pauseAutoScroll();
      resumeAutoScroll();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const handlePrev = () => {
    if (instanceRef.current) instanceRef.current.prev();
  };

  const handleNext = () => {
    if (instanceRef.current) instanceRef.current.next();
  };

  return (
    <div className="w-full bg-muted text-foreground rounded-xl shadow-inner pt-3 pb-4">
      <h2 className="text-xl font-semibold text-center mb-2 px-4">
        Instagram Highlights
      </h2>

      <div className="relative overflow-visible px-2">
        <div ref={sliderRef} className="keen-slider w-full overflow-visible">
          {instagramPosts.map((post, index) => (
            <div
              key={index}
              className="keen-slider__slide flex-shrink-0 flex justify-center items-center overflow-visible"
              style={{
                width: `${width}px`,
                height: `${height - cropTopPx}px`,
              }}
            >
              <InstagramSlide
                url={post.url}
                width={width}
                height={height}
                cropTopPx={cropTopPx}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-full shadow-sm hover:bg-accent/80"
        >
          &#8592;
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-full shadow-sm hover:bg-accent/80"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
