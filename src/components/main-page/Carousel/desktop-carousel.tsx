"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import { instagramPosts } from "@/lib/instagram-posts-temp";
import InstagramSlide from "./instagram-slide";

export default function DesktopCarousel() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: "auto",
      spacing: 25,
      origin: "center",
    },
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);

  const width = 350;
  const height = 425;
  const cropTopPx = 0;

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

  const handlePrev = () => {
    if (instanceRef.current) instanceRef.current.prev();
  };

  const handleNext = () => {
    if (instanceRef.current) instanceRef.current.next();
  };

  return (
    <div className="w-full bg-muted text-foreground py-6 rounded-xl shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Check out our Instagram Highlights!
      </h2>

      <div className="relative overflow-hidden max-w-7xl mx-auto px-4">
        <div
          ref={sliderRef}
          className="keen-slider w-full overflow-hidden"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {instagramPosts.map((post, index) => (
            <div
              key={index}
              className="keen-slider__slide flex-shrink-0 flex justify-center items-center"
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

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-full shadow-sm hover:bg-accent/80"
        >
          &#8592;
        </button>

        {/* Right Arrow */}
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
