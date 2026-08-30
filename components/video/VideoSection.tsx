"use client";

import { useState } from "react";
import { ThemeSection } from "@/lib/section-theme";
import { videoClips, type VideoClip } from "@/lib/data";
import VideoModal from "./VideoModal";

export default function VideoSection() {
  const [active, setActive] = useState<VideoClip | null>(null);

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

      <div className="relative md:absolute md:inset-0 flex justify-center">
        <div className="relative w-[220px] md:w-[240px] md:-top-[10vh] md:h-[120vh] flex flex-col items-center">
          {videoClips.map((clip, i) => (
            <button
              key={clip.id}
              type="button"
              onClick={() => setActive(clip)}
              className={`relative w-full h-[220px] md:h-[240px] -mt-10 first:mt-0 transition-transform hover:scale-[1.03] ${
                i % 2 === 0 ? "clip-trapezoid-a" : "clip-trapezoid-b"
              }`}
              style={{ background: clip.color, zIndex: videoClips.length - i }}
              aria-label={`Ver ${clip.title}`}
            >
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="text-white/80"
                  aria-hidden="true"
                >
                  <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M11.5 9.5l7 4.5-7 4.5v-9Z" fill="currentColor" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      <VideoModal clip={active} onClose={() => setActive(null)} />
    </ThemeSection>
  );
}
