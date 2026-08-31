"use client";

import { useState } from "react";
import { ThemeSection } from "@/lib/section-theme";
import { videoClips } from "@/lib/data";
import VideoClipCard from "./VideoClipCard";
import VideoModal from "./VideoModal";

export default function VideoSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeClip = activeIndex !== null ? videoClips[activeIndex] : null;

  const wrap = (i: number) => (i + videoClips.length) % videoClips.length;

  return (
    <ThemeSection
      theme="light"
      id="video"
      className="relative w-full min-h-screen bg-paper text-ink overflow-hidden py-28 md:py-0"
    >
      <div className="md:absolute md:left-10 lg:left-16 md:top-1/2 md:-translate-y-1/2 px-6 md:px-0 text-center md:text-left mb-10 md:mb-0">
        <h2 className="text-[13vw] leading-[0.95] md:text-[52px] md:leading-[1.05] font-extrabold uppercase">
          Edición de
          <br />
          Video Vertical
        </h2>
      </div>

      <div className="md:absolute md:right-10 lg:right-16 md:top-1/2 md:-translate-y-1/2 px-6 md:px-0 text-center md:text-right mb-14 md:mb-0">
        <p className="italic font-medium text-2xl md:text-[26px]">Motion</p>
      </div>

      <div className="relative md:absolute md:inset-0 flex justify-center overflow-hidden">
        <div
          className="relative md:-top-[10vh] flex flex-col items-center py-10"
          style={{ perspective: 1400 }}
        >
          {videoClips.map((clip, i) => (
            <VideoClipCard
              key={clip.id}
              clip={clip}
              index={i}
              onOpen={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </div>

      <VideoModal
        clip={activeClip}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex((i) => (i === null ? null : wrap(i - 1)))}
        onNext={() => setActiveIndex((i) => (i === null ? null : wrap(i + 1)))}
      />
    </ThemeSection>
  );
}
