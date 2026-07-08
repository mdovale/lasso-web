import Link from "next/link";
import type { NewsItem } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { SmartImage } from "@/components/ui/SmartImage";

export function NewsCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised transition-colors duration-300 hover:border-line-bright hover:bg-ink-overlay"
    >
      {(item.image || large) && (
        <SmartImage
          src={item.image}
          alt={item.title}
          sizes="(min-width: 768px) 50vw, 100vw"
          fallbackLabel="News"
          className={large ? "aspect-[16/9] w-full" : "aspect-[16/8] w-full"}
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={item.date} className="u-label text-fg-faint">
          {formatDate(item.date)}
        </time>
        <h3
          className={`u-display mt-3 text-fg transition-colors group-hover:text-sky ${
            large ? "text-2xl" : "text-lg leading-snug"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
          {item.summary}
        </p>
      </div>
    </Link>
  );
}
