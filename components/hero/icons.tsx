type IconProps = {
  className?: string;
};

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
