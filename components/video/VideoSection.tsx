"use client";

import { useEffect, useRef, useState } from "react";
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
    // People who ask for less motion get a manual carousel (wheel / swipe) only.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setStartIndex((i) => (i + 1) % videoClips.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, activeClip]);

  const wrap = (i: number) => (i + videoClips.length) % videoClips.length;

  const stackRef = useRef<HTMLDivElement>(null);

  // Scrolling (wheel or touch swipe) over the stack steps the carousel
  // forward/back instead of scrolling the page — this route is a single
  // full-viewport section, so there's nothing else to scroll to.
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    let cooling = false;
    const step = (dir: 1 | -1) => {
      if (cooling) return;
      cooling = true;
      setStartIndex((i) => wrap(i + dir));
      window.setTimeout(() => {
        cooling = false;
      }, 700);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 30) return;
      step(dy > 0 ? 1 : -1);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const centerOffset = Math.floor(VISIBLE_COUNT / 2);
  const TILT_STEP = 20;

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, offset) => {
    const clipIndex = wrap(startIndex + offset);
    const distance = Math.abs(offset - centerOffset);
    return {
      clip: videoClips[clipIndex],
      clipIndex,
      tilt: (offset - centerOffset) * TILT_STEP,
      zIndex: VISIBLE_COUNT - distance,
      distance,
    };
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
        ref={stackRef}
        className="relative md:absolute md:inset-0 flex justify-center items-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative flex flex-col items-center" style={{ perspective: 650 }}>
          <AnimatePresence initial={false}>
            {visible.map(({ clip, clipIndex, tilt, zIndex, distance }) => (
              <VideoClipCard
                key={clip.id}
                clip={clip}
                tilt={tilt}
                zIndex={zIndex}
                delay={distance * 0.07}
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
