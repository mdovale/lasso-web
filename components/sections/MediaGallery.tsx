"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { MediaItem } from "@/lib/schemas";
import { MediaFigure } from "@/components/cards/MediaFigure";
import { cn } from "@/lib/utils";

const FILTERS: { id: string; label: string; types: MediaItem["type"][] }[] = [
  { id: "all", label: "All", types: [] },
  { id: "lab", label: "Lab photos", types: ["lab-photo", "image"] },
  { id: "video", label: "Video", types: ["video", "animation"] },
  { id: "generated", label: "Generated & renders", types: ["generated", "render"] },
];

/** Filterable media grid with animated layout transitions. */
export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [filter, setFilter] = useState("all");
  const reduceMotion = useReducedMotion();

  const visible = useMemo(() => {
    const config = FILTERS.find((f) => f.id === filter);
    if (!config || config.types.length === 0) return items;
    return items.filter((item) => config.types.includes(item.type));
  }, [filter, items]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter media by type"
        className="mb-10 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "u-label rounded-full border px-4 py-2 transition-colors",
              filter === f.id
                ? "border-sky bg-sky/10 text-sky"
                : "border-line text-fg-muted hover:border-line-bright hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-fg-muted">No media in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.div
                key={item.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <MediaFigure item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
