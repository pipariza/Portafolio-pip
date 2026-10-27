type IconProps = {
  className?: string;
};

export function CodeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M70 55L30 100l40 45M130 55l40 45-40 45M110 45L90 155"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M100 30L30 65l70 35 70-35-70-35Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M30 100l70 35 70-35"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 135l70 35 70-35"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayRectIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="30"
        y="45"
        width="140"
        height="110"
        rx="16"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path
        d="M88 80l40 20-40 20V80Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
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
