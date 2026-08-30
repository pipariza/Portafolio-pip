"use client";

import { useState } from "react";

export default function VimeoEmbed({
  vimeoId,
  title,
}: {
  vimeoId: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-[9/16] max-h-[80vh] mx-auto bg-black overflow-hidden rounded-xl">
      {playing && vimeoId ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&badge=0`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          title={title}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/40" />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            disabled={!vimeoId}
            aria-label={`Reproducir ${title}`}
            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-bone/90 text-void disabled:opacity-40 transition-transform hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4l10 6-10 6V4Z" fill="currentColor" />
            </svg>
          </button>
          {!vimeoId && (
            <p className="absolute bottom-6 inset-x-0 text-center text-xs uppercase tracking-[0.08em] text-bone/60">
              Video próximamente
            </p>
          )}
        </>
      )}
    </div>
  );
}
