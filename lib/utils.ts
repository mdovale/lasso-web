/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "2026-03-14" → "March 14, 2026" (rendered in UTC to avoid TZ drift). */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Compact author list: first N authors, then "et al." */
export function formatAuthors(authors: string[], max = 6): string {
  if (authors.length <= max) return authors.join(", ");
  return `${authors.slice(0, max).join(", ")}, et al.`;
}

/** Detect YouTube / Vimeo URLs and produce an embeddable iframe URL. */
export function getVideoEmbedUrl(src: string): string | null {
  const youtube = src.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = src.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
