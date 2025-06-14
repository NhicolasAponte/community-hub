"use client";

import React from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type InstagramSlideProps = {
  url: string;
  caption?: string;
  width: number;
  height: number;
  cropTopPx: number;
};

export default function InstagramSlide({
  url,
  caption,
  width,
  height,
  cropTopPx,
}: InstagramSlideProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const postId = url.split("/")[4];

  return (
    <div className="bg-card rounded-lg shadow-md border border-border">
      <div
        className="overflow-hidden rounded-t-lg"
        style={{ height: height - cropTopPx }}
      >
        <iframe
          src={`https://www.instagram.com/p/${postId}/embed`}
          width={width}
          //   width="320"
          height={height}
          frameBorder="0"
          scrolling={isMobile ? "no" : "yes"}
          className="rounded-lg"
          style={{
            marginTop: `-${cropTopPx}px`,
            display: "block",
          }}
        />
      </div>

      {caption && (
        <div className="text-sm text-center text-muted-foreground py-2 bg-background rounded-b-lg">
          {caption}
        </div>
      )}
    </div>
  );
}
