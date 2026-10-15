import Image from "next/image";

/** Captioned-tile thumbnail: the real image when there is one, a colored tile otherwise. */
export default function Thumb({
  image,
  color,
  alt,
  label,
  large = false,
}: {
  image?: string;
  color: string;
  alt: string;
  /** Text shown in the placeholder tile (e.g. a file extension). */
  label?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-md shadow-md ring-1 ring-black/10 ${
        large ? "max-w-md" : ""
      }`}
      style={{ background: color }}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes={large ? "(min-width: 768px) 448px, 90vw" : "(min-width: 768px) 220px, 45vw"}
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs font-semibold tracking-wide text-black/35">
          {label}
        </span>
      )}
    </div>
  );
}
