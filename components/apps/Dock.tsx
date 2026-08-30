const ICONS: { label: string; path: string }[] = [
  { label: "Capas", path: "M12 3l8 4-8 4-8-4 8-4Zm-8 8l8 4 8-4M4 15l8 4 8-4" },
  { label: "Imagen", path: "M4 5h16v14H4V5Zm2 11l4-5 3 3 3-4 4 6H6Z" },
  { label: "Forma libre", path: "M6 6c4-2 10 0 12 4-1 5-7 8-12 6-3-3-3-7 0-10Z" },
  { label: "Video", path: "M4 7h11v10H4V7Zm11 3l5-3v10l-5-3v-4Z" },
  { label: "Mail", path: "M4 6h16v12H4V6Zm0 0l8 6 8-6" },
  { label: "Carpeta", path: "M4 7h6l2 2h8v9H4V7Z" },
];

export default function Dock() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full bg-void/90 px-4 py-3 backdrop-blur-md shadow-xl">
      {ICONS.map((icon, i) => (
        <div key={icon.label} className="flex items-center">
          {i === ICONS.length - 2 && (
            <span className="mx-2 h-8 w-px bg-bone/15" aria-hidden="true" />
          )}
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-bone/80"
            aria-label={icon.label}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={icon.path}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
