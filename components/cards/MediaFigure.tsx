/* eslint-disable @next/next/no-img-element */
import type { MediaItem } from "@/lib/schemas";
import { assetUrl, getVideoEmbedUrl } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";

const typeLabel: Record<MediaItem["type"], string> = {
  image: "Image",
  video: "Video",
  animation: "Animation",
  generated: "Generated",
  "lab-photo": "Lab photo",
  render: "Render",
};

/**
 * Renders one media item: image, local video, or embedded YouTube/Vimeo.
 * Plain <img>/<video> is used (not next/image) because gallery items keep
 * their intrinsic aspect ratios and may be external URLs.
 */
export function MediaFigure({ item }: { item: MediaItem }) {
  const embedUrl = item.type === "video" ? getVideoEmbedUrl(item.src) : null;
  const isLocalVideo =
    (item.type === "video" || item.type === "animation") &&
    !embedUrl &&
    /\.(mp4|webm|mov)$/i.test(item.src);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-ink-raised">
      {embedUrl ? (
        <div className="relative aspect-video w-full">
          <iframe
            src={embedUrl}
            title={item.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : isLocalVideo ? (
        <video
          src={assetUrl(item.src)}
          poster={item.thumbnail ? assetUrl(item.thumbnail) : undefined}
          controls
          playsInline
          preload="metadata"
          className="w-full"
          aria-label={item.alt}
        />
      ) : (
        <img src={assetUrl(item.src)} alt={item.alt} loading="lazy" className="w-full" />
      )}
      <figcaption className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Tag tone="sky">{typeLabel[item.type]}</Tag>
        </div>
        <p className="font-display text-base font-medium text-fg">{item.title}</p>
        {item.caption ? (
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.caption}</p>
        ) : null}
        {item.credit ? (
          <p className="u-label mt-3 text-fg-faint">Credit: {item.credit}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}
