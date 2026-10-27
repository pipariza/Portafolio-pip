/* Small glyphs and app icons for the Mail / Contacts desktop. */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function EnvelopeGlyph({
  className = "h-5 w-5",
  strokeWidth = base.strokeWidth,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={strokeWidth}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

export function PlaneGlyph({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6l.1 6.5L15 12 3.5 13.9z" />
    </svg>
  );
}

export function ChatGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M4 20l1.3-4.2A8 8 0 1 1 8.5 19z" />
    </svg>
  );
}

export function InstagramGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.6" cy="7.4" r=".6" fill="currentColor" />
    </svg>
  );
}

export function LinkedInGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8.5 10.5v5M8.5 8.2v.1M12 15.5v-5M12 12.6c0-1.3.9-2.1 2-2.1s2 .8 2 2.1v2.9" />
    </svg>
  );
}

export function PersonGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20c.6-4 3.7-6 7.5-6s6.9 2 7.5 6z" />
    </svg>
  );
}

/** The Mail app icon (blue rounded square with an envelope). */
export function MailAppIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-[22%] bg-gradient-to-b from-[#4cb0ff] to-[#0a64f0] text-white shadow-[0_6px_14px_-4px_rgba(10,100,240,0.7),inset_0_0_0_0.5px_rgba(255,255,255,0.35)] ${className}`}
    >
      <EnvelopeGlyph className="h-[52%] w-[52%]" strokeWidth={1.8} />
    </span>
  );
}

/** The Contacts app icon (light square with a person). */
export function ContactsAppIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-[22%] bg-gradient-to-b from-[#f4f4f6] to-[#c9c9cf] text-[#5b5b62] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6),inset_0_0_0_0.5px_rgba(255,255,255,0.6)] ${className}`}
    >
      <PersonGlyph className="h-[58%] w-[58%]" />
    </span>
  );
}
