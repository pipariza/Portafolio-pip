"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Barlow } from "next/font/google";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectScreen, ShotImage, ShotVideo } from "@/lib/data";

// Height / width of what each device frame shows (a 16:10 laptop, a 390x844 phone).
export const DESKTOP_RATIO = 10 / 16;
export const PHONE_RATIO = 844 / 390;

// Width, in CSS px, the desktop and mobile captures were taken at; video
// positions in the data are in those pixels.
export const DESKTOP_PAGE_WIDTH = 1440;
export const MOBILE_PAGE_WIDTH = 500;

// `sizes` and quality of the screenshots, shared with the prefetch so it asks
// the image optimizer for exactly the files the visible tab will need.
export const DESKTOP_SIZES = "(min-width: 1024px) 45vw, 90vw";
export const PHONE_SIZES = "(min-width: 1024px) 12vw, 25vw";
const SHOT_QUALITY = 60;

// The font the captured site uses for the labels it draws over its videos.
const barlow = Barlow({ subsets: ["latin"], weight: "400" });

const EASE = [0.16, 0.84, 0.44, 1] as const;

function ArrowButton({
  dir,
  label,
  onClick,
  className = "",
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor-hover
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:h-12 lg:w-12 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={dir === "prev" ? "M13 8H3m0 0l4-4m-4 4l4 4" : "M3 8h10m0 0l-4-4m4 4l-4 4"}
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * The page's own video, playing on top of the spot where the capture shows
 * its first frame. It lives inside the scrolling layer, so it moves with the
 * page. Muted and looping. To keep phones and laptops cool it only loads and
 * plays while it is inside the device screen. If the browser refuses
 * autoplay the capture stays. Whatever the page draws over the video (logo,
 * buttons, titles, shading) comes back on top as a transparent image.
 */
function ShotVideoLayer({
  video,
  pageWidth,
  pageHeight,
}: {
  video: ShotVideo;
  pageWidth: number;
  pageHeight: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute("src")) el.src = video.src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      // The device screen is the root, so "visible" means visible inside it.
      { root: el.closest("[data-shot-viewport]"), rootMargin: "60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video.src]);

  const { notch } = video;
  const notchLeft = notch ? (1 - notch.w / video.w) * 100 : 0;
  const notchBottom = notch ? (notch.h / video.h) * 100 : 0;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: `${(video.x / pageWidth) * 100}%`,
        top: `${(video.y / pageHeight) * 100}%`,
        width: `${(video.w / pageWidth) * 100}%`,
        height: `${(video.h / pageHeight) * 100}%`,
        borderRadius: `${((video.radius ?? 0) / pageWidth) * 100}cqw`,
        clipPath: notch
          ? `polygon(0 0, ${notchLeft}% 0, ${notchLeft}% ${notchBottom}%, 100% ${notchBottom}%, 100% 100%, 0 100%)`
          : undefined,
      }}
    >
      <video
        ref={ref}
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className={`h-full w-full ${video.fit === "cover" ? "object-cover" : "object-contain"}`}
      />
      {video.overlay && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.overlay}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}
      {video.label && (
        <span
          className={`${barlow.className} absolute inset-0 flex items-center justify-center uppercase text-white`}
          style={{ fontSize: `${(video.label.size / pageWidth) * 100}cqw` }}
        >
          {video.label.text}
        </span>
      )}
    </div>
  );
}

/**
 * Loads the pictures of the tabs that are not showing, one at a time, starting
 * with the next one. It holds back on data saver and on slow connections, runs
 * when the browser is idle, and only touches images (never the videos).
 * Returns a function that stops it.
 */
export function prefetchScreens(screens: ProjectScreen[], current: number) {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return;
  if (connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(connection.effectiveType)) return;

  let cancelled = false;
  const queue: ShotImage[] = [];
  for (let step = 1; step < screens.length; step++) {
    const screen = screens[(current + step) % screens.length];
    queue.push(screen.desktop, screen.mobile);
  }

  // Each picture moves the queue on once, when it loads, fails, or takes too
  // long, so one slow download can never stall the rest.
  const next = () => {
    const shot = queue.shift();
    if (cancelled || !shot) return;
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      next();
    };
    const isPhone = shot.width <= 700;
    const { props } = getImageProps({
      src: shot.src,
      alt: "",
      width: shot.width,
      height: shot.height,
      sizes: isPhone ? PHONE_SIZES : DESKTOP_SIZES,
      quality: SHOT_QUALITY,
    });
    const img = new window.Image();
    img.onload = img.onerror = advance;
    window.setTimeout(advance, 6000);
    img.sizes = props.sizes ?? "";
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src ?? shot.src;
  };

  // Safari has no requestIdleCallback.
  const hasIdle = typeof window.requestIdleCallback === "function";
  const schedule = hasIdle
    ? window.requestIdleCallback(next, { timeout: 4000 })
    : window.setTimeout(next, 1500);

  return () => {
    cancelled = true;
    if (hasIdle) window.cancelIdleCallback(schedule);
    else window.clearTimeout(schedule);
  };
}

/**
 * One full-page capture inside a device screen. The image keeps its own
 * proportions; when the page is taller than the screen it scrolls slowly top
 * to bottom and back, so the whole page is seen and nothing is cropped. With
 * "reduce motion" it does not move and the screen scrolls by hand instead.
 */
export function ScrollShot({
  shot,
  alt,
  viewportRatio,
  pageWidth,
  pace,
  sizes,
  priority,
  inView,
  onLoaded,
}: {
  shot: ShotImage;
  alt: string;
  viewportRatio: number;
  pageWidth: number;
  pace: number;
  sizes: string;
  priority: boolean;
  /** Whether the whole stage is on the visitor's screen; the tour and videos run only then. */
  inView: boolean;
  onLoaded?: () => void;
}) {
  const reduce = useReducedMotion();
  // The tour (and the videos) start only once the picture has loaded and the
  // stage is really on screen. Leaving the screen drops them again, so coming
  // back (next slide, scrolling up) always starts from the top of the page and
  // the first frame of each video, never half way through.
  const [loaded, setLoaded] = useState(false);
  const markLoaded = useCallback(() => {
    setLoaded(true);
    onLoaded?.();
  }, [onLoaded]);
  // An image that came from the cache can finish before React attaches onLoad.
  const imageRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) markLoaded();
    },
    [markLoaded],
  );
  const tour = !reduce && loaded && inView;

  // Longer pages take longer, so the speed feels the same on every page.
  const seconds = Math.min(24, Math.max(6, (shot.height / shot.width - viewportRatio) * 7)) * pace;

  // Each capture may have been taken at its own width (the data says so when it differs).
  const captureWidth = shot.pageWidth ?? pageWidth;
  const pageHeight = (shot.height / shot.width) * captureWidth;

  return (
    <div
      data-shot-viewport
      className={`absolute inset-0 [container-type:size] ${
        reduce ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      <div
        className={`relative ${
          tour ? "shot-scroll group-hover/device:[animation-play-state:paused]" : ""
        }`}
        style={{
          // Blurred stand-in for the real picture while it downloads.
          backgroundImage: shot.blur ? `url(${shot.blur})` : undefined,
          backgroundSize: "100% 100%",
          ...(tour ? ({ "--shot-seconds": `${seconds}s` } as CSSProperties) : null),
        }}
      >
        <Image
          ref={imageRef}
          src={shot.src}
          alt={alt}
          width={shot.width}
          height={shot.height}
          sizes={sizes}
          quality={SHOT_QUALITY}
          priority={priority}
          onLoad={markLoaded}
          className={`block h-auto w-full transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {tour &&
          shot.videos?.map((video) => (
            <ShotVideoLayer
              key={`${video.src}-${video.x}-${video.y}`}
              video={video}
              pageWidth={captureWidth}
              pageHeight={pageHeight}
            />
          ))}
      </div>
    </div>
  );
}

/**
 * The finished site inside a browser frame, with the phone version in front
 * and a tab for each page. Sizes use container units, so the chrome around the
 * screenshots scales with the stage.
 */
function DeviceStage({
  screens,
  name,
  host,
  pace,
  priority,
}: {
  screens: ProjectScreen[];
  name: string;
  /** Domain shown in the browser bar. */
  host: string;
  pace: number;
  priority: boolean;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const screen = screens[active];

  // Once the first screen is on screen, quietly fetch the other tabs' pictures
  // so switching tabs is instant. See prefetchScreens for when it holds back.
  const rootRef = useRef<HTMLDivElement>(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const markFirstLoaded = useCallback(() => setFirstLoaded(true), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Most of the stage must be on screen, so a slide that is still sliding in has not started yet.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.6,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!firstLoaded || !visible) return;
    return prefetchScreens(screens, 0);
  }, [firstLoaded, visible, screens]);

  const enter = (delay: number, y: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <div
      ref={rootRef}
      className="w-full max-w-[780px] lg:w-[min(100cqw,calc((100cqh_-_4.5rem)*1.6))] lg:max-w-none"
    >
      <div className="@container relative w-full" style={{ aspectRatio: "100 / 62" }}>
        <motion.div
          {...enter(0.05, 18)}
          className="group/device absolute left-0 top-0 w-[80%] overflow-hidden rounded-[1.4cqw] bg-white shadow-[0_3cqw_6cqw_-2cqw_rgba(20,19,16,0.35)] ring-1 ring-black/10"
        >
          <div className="flex h-[3.6cqw] items-center gap-[0.9cqw] bg-[#ecebe7] px-[1.6cqw]">
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="ml-[2cqw] hidden h-[2.2cqw] max-w-[70%] items-center truncate whitespace-nowrap rounded-full bg-white px-[1.6cqw] text-[1.4cqw] leading-none text-black/50 @md:flex">
              {host}{screen.path}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-white">
            <AnimatePresence initial={false}>
              <motion.div key={screen.id} {...fade} className="absolute inset-0">
                <ScrollShot
                  shot={screen.desktop}
                  alt={`${name}: ${screen.label}, en escritorio`}
                  viewportRatio={DESKTOP_RATIO}
                  pageWidth={DESKTOP_PAGE_WIDTH}
                  pace={pace}
                  sizes={DESKTOP_SIZES}
                  priority={priority && active === 0}
                  inView={visible}
                  onLoaded={active === 0 ? markFirstLoaded : undefined}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          {...enter(0.2, 28)}
          className="group/device absolute bottom-0 right-0 w-[24%] overflow-hidden rounded-[3.2cqw] border-[0.7cqw] border-[#c9c6be] bg-[#c9c6be] ring-1 ring-black/10 shadow-[0_3cqw_6cqw_-1cqw_rgba(20,19,16,0.45)]"
        >
          <div className="relative aspect-[390/844] overflow-hidden rounded-[2.5cqw] bg-white">
            <AnimatePresence initial={false}>
              <motion.div key={screen.id} {...fade} className="absolute inset-0">
                <ScrollShot
                  shot={screen.mobile}
                  alt={`${name}: ${screen.label}, en celular`}
                  viewportRatio={PHONE_RATIO}
                  pageWidth={MOBILE_PAGE_WIDTH}
                  pace={pace}
                  sizes={PHONE_SIZES}
                  priority={priority && active === 0}
                  inView={visible}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div
        role="tablist"
        aria-label="Pantallas del proyecto"
        className="mt-4 flex flex-wrap justify-center gap-x-3 sm:gap-x-5"
      >
        {screens.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            data-cursor-hover
            className={`flex min-h-11 items-center border-b text-[10px] font-medium uppercase tracking-[0.08em] sm:text-[11px] transition-colors ${
              i === active
                ? "border-ink text-ink"
                : "border-transparent text-ink/45 hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectShowcase({
  project,
  screens,
  index,
  total,
  onPrev,
  onNext,
  backHref,
  priority,
}: {
  project: Project;
  screens: ProjectScreen[];
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  backHref: string;
  /** Load the first screen right away (the project the visitor opened); defaults to the first slide. */
  priority?: boolean;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} // ${String(total).padStart(2, "0")}`;
  const category = project.category === "diseno-web" ? "Diseño web" : "Aplicativo";

  return (
    <div className="relative grid min-h-screen w-full grid-cols-1 overflow-hidden lg:h-screen lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* Stage: container-type lets the stage fit both the width and the height of the panel. */}
      <div
        className="relative flex items-center justify-center px-6 pb-8 pt-24 lg:px-24 lg:pb-24 lg:pt-28 lg:[container-type:size]"
        style={{ background: project.color }}
      >
        <DeviceStage
          screens={screens}
          name={project.name}
          host={project.url ? new URL(project.url).hostname.replace(/^www\./, "") : ""}
          pace={project.tourPace ?? 1}
          priority={priority ?? index === 0}
        />
      </div>

      <div className="@container relative flex flex-col justify-center gap-6 bg-paper px-6 pb-24 pt-8 text-ink lg:gap-8 lg:overflow-y-auto lg:pl-16 lg:pr-24 lg:pb-24 lg:pt-28">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.08em] text-ink/50">{category}</p>
          <h2 className="text-[clamp(1.75rem,12.5cqw,4.5rem)] font-medium uppercase leading-[0.95] tracking-tight">
            {project.name}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">{project.summary}</p>
        </div>

        <div className="grid max-w-md grid-cols-3 gap-4">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Rol</p>
            <p className="text-sm font-medium">{project.role}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Año</p>
            <p className="text-sm font-medium">{project.year}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Stack</p>
            <p className="text-sm font-medium">{project.stack}</p>
          </div>
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            Ver sitio
            <span aria-hidden="true">↗</span>
          </a>
        )}

        {project.note && (
          <p className="max-w-md text-[11px] leading-relaxed text-ink/50">{project.note}</p>
        )}
      </div>

      {/* Desktop controls: back and the left arrow sit on the stage, the counter and right arrow on the paper. */}
      <Link
        href={backHref}
        data-cursor-hover
        className="absolute bottom-8 left-16 z-10 hidden text-sm font-medium uppercase tracking-[0.05em] text-ink lg:block"
      >
        ← Volver
      </Link>
      <span className="absolute bottom-8 right-16 z-10 hidden text-sm font-medium tracking-[0.05em] text-ink lg:block">
        {counter}
      </span>
      <ArrowButton
        dir="prev"
        label="Proyecto anterior"
        onClick={onPrev}
        className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 border-ink/30 text-ink hover:border-ink/70 lg:flex"
      />
      <ArrowButton
        dir="next"
        label="Siguiente proyecto"
        onClick={onNext}
        className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 border-ink/30 text-ink hover:border-ink/70 lg:flex"
      />

      {/* Mobile controls: one bottom row on the paper. */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-between lg:hidden">
        <Link
          href={backHref}
          data-cursor-hover
          className="text-xs font-medium uppercase tracking-[0.05em] text-ink"
        >
          ← Volver
        </Link>
        <div className="flex items-center gap-3">
          <span className="mr-1 text-xs font-medium tracking-[0.05em] text-ink">{counter}</span>
          <ArrowButton
            dir="prev"
            label="Proyecto anterior"
            onClick={onPrev}
            className="border-ink/30 text-ink"
          />
          <ArrowButton
            dir="next"
            label="Siguiente proyecto"
            onClick={onNext}
            className="border-ink/30 text-ink"
          />
        </div>
      </div>
    </div>
  );
}
