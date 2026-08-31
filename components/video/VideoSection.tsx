"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeSection } from "@/lib/section-theme";
import { videoClips } from "@/lib/data";
import VideoClipCard from "./VideoClipCard";
import VideoModal from "./VideoModal";

const VISIBLE_COUNT = 5;
const CYCLE_MS = 3500;

export default function VideoSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeClip = activeIndex !== null ? videoClips[activeIndex] : null;

  useEffect(() => {
    if (paused || activeClip) return;
    const timer = setInterval(() => {
      setStartIndex((i) => (i + 1) % videoClips.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, activeClip]);

  const wrap = (i: number) => (i + videoClips.length) % videoClips.length;

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, offset) => {
    const clipIndex = wrap(startIndex + offset);
    return { clip: videoClips[clipIndex], clipIndex, offset };
  });

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

      <div
        className="relative md:absolute md:inset-0 flex justify-center items-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative flex flex-col items-center" style={{ perspective: 1400 }}>
          <AnimatePresence initial={false}>
            {visible.map(({ clip, clipIndex, offset }) => (
              <VideoClipCard
                key={clip.id}
                clip={clip}
                slotOffset={offset}
                onOpen={() => setActiveIndex(clipIndex)}
              />
            ))}
          </AnimatePresence>
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
