import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Image with graceful fallback: when `src` is missing, renders a subtle
 * generative placeholder (breadboard-grid pattern) instead of a broken
 * image, so content editors can add entries before photos exist.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "100vw",
  fallbackLabel,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Short text shown in the placeholder, e.g. a person's initials */
  fallbackLabel?: string;
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "u-grid-bg relative flex items-center justify-center bg-ink-raised",
          className,
        )}
      >
        <span className="u-display select-none text-4xl text-line-bright">
          {fallbackLabel ?? "—"}
        </span>
      </div>
    );
  }

  // SVG artwork (e.g. public/generated/*) is served as-is; the Next.js
  // image optimizer only handles raster formats.
  if (src.endsWith(".svg")) {
    return (
      <div className={cn("relative overflow-hidden bg-ink-raised", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-ink-raised", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
