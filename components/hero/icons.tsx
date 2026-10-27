type IconProps = {
  className?: string;
};

/*
 * App icons for the three areas of work, in the style of macOS icons: a rounded square
 * with a soft vertical gradient and a white drawing. They fill their box (give them a size).
 * The gradient is CSS, not an SVG <defs>: a gradient inside an element that is display:none
 * (the desktop layout on a phone) does not resolve, and these icons are drawn twice.
 */

const APP_TILE = "block rounded-[22%] bg-gradient-to-b shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.35)]";

export function WebAppIcon({ className = "" }: IconProps) {
  return (
    <span className={`${APP_TILE} from-[#5fd0ff] to-[#1473f0] ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" strokeWidth="2.6" />
        <path d="M32 9.5v4M32 50.5v4M9.5 32h4M50.5 32h4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M44 20 36.5 36.5 27.5 27.5Z" fill="#ff5148" />
        <path d="M20 44 27.5 27.5 36.5 36.5Z" fill="#fff" />
      </svg>
    </span>
  );
}

export function AppsAppIcon({ className = "" }: IconProps) {
  return (
    <span className={`${APP_TILE} from-[#52e6b4] to-[#0e9a6c] ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 14 13 23.5 32 33l19-9.5L32 14Z" fill="rgba(255,255,255,0.22)" />
          <path d="M13 32.5 32 42l19-9.5" />
          <path d="M13 41.5 32 51l19-9.5" />
        </g>
      </svg>
    </span>
  );
}

export function VideoAppIcon({ className = "" }: IconProps) {
  return (
    <span className={`${APP_TILE} from-[#4a4a52] to-[#141416] ${className}`}>
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <path d="M26 15.5 45.5 27 26 38.5v-23Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <rect x="12" y="46" width="14" height="5" rx="2.5" fill="#ff5a8a" />
        <rect x="28" y="46" width="19" height="5" rx="2.5" fill="#ffb340" />
        <rect x="49" y="46" width="4" height="5" rx="2" fill="#5ac8fa" />
      </svg>
    </span>
  );
}

/* ---------- small line glyphs for the Finder sidebar and the dock ---------- */

const glyph = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function BrowserGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M6.5 6.75h.01M9 6.75h.01" />
    </svg>
  );
}

export function GridGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </svg>
  );
}

export function FilmGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m10.5 9.5 4 2.5-4 2.5v-5Z" />
    </svg>
  );
}

export function UserGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c.8-3.6 3.6-5.3 7-5.3s6.2 1.7 7 5.3" />
    </svg>
  );
}

export function MailGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

export function HomeGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <path d="M4 11 12 4.5 20 11v7.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V11Z" />
      <path d="M9.5 20v-5.5h5V20" />
    </svg>
  );
}

/** The Finder's icon: a blue face split in two halves (flat, no gradient). */
export function FinderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#2d8cf5" />
      <path d="M14 0h18v64H14A14 14 0 0 1 0 50V14A14 14 0 0 1 14 0Z" fill="#8ccbff" />
      <path d="M20 17v8M44 17v8M33 22v14" stroke="#14325a" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M17 43c7 7 23 7 30 0" stroke="#14325a" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FileGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <path d="M7 3.5h6.5L19 9v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M13.5 3.5V9H19M9 13h6M9 16.5h6" />
    </svg>
  );
}

export function SearchGlyph({ className }: IconProps) {
  return (
    <svg {...glyph} className={className}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}
