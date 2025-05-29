"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";

// this will be a table in the schema at some point. for now we're arrayin it
// array of instagram posts
export const instagramPosts = [
  {
    url: "https://www.instagram.com/p/DJjpb-XPpRg/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Check out some regrets!",
  },
  {
    url: "https://www.instagram.com/p/DJhIKq5v1GJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D",
    caption: "Mother's day is also a thing!",
  },
  {
    url: "https://www.instagram.com/p/DJb7M9huhb0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D",
    caption: "Get some knowledge yo",
  },
  {
    url: "https://www.instagram.com/p/DJW0N_sMqis/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA%3D%3D",
    caption: "Now for a Q&A!",
  },
  {
    url: "https://www.instagram.com/p/DJRlJROMCGN/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Dreaming dreaming",
  },
];

export default function InstagramCarousel() {
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
    <div className="w-full bg-blue-600 text-white py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Check out our Instagram Highlights!
      </h2>
      <div className="relative overflow-hidden">
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
          {instagramPosts.map((post, index) => {
            const postId = post.url.split("/")[4];
            return (
              <div
                key={index}
                className="keen-slider__slide flex justify-center items-center"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={`https://www.instagram.com/p/${postId}/embed`}
                    width="320"
                    height="400"
                    frameBorder="0"
                    scrolling="yes"
                    allowTransparency={true}
                    className="rounded-lg"
                  ></iframe>
                  {post.caption && (
                    <div className="text-sm text-center text-black py-2 bg-white">
                      {post.caption}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full"
        >
          &#8592;
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full z-10"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
