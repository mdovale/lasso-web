import type { Publication } from "@/lib/schemas";
import { assetUrl, formatAuthors } from "@/lib/utils";
import { Tag } from "@/components/ui/Tag";

function PubLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="u-label rounded-full border border-line px-2.5 py-1 text-fg-muted transition-colors hover:border-sky hover:text-sky"
    >
      {children}
    </a>
  );
}

export function PublicationCard({ publication }: { publication: Publication }) {
  const pub = publication;
  return (
    <article className="group rounded-2xl border border-line bg-ink-raised p-6 transition-colors duration-300 hover:border-line-bright">
      <div className="flex items-baseline justify-between gap-4">
        <p className="u-label text-sky">
          {pub.venue}
          {pub.volumePages ? ` · ${pub.volumePages}` : ""}
        </p>
        <span className="u-label shrink-0 text-fg-faint">{pub.year}</span>
      </div>
      <h3 className="u-display mt-3 text-lg leading-snug text-fg">{pub.title}</h3>
      <p className="mt-2 text-sm text-fg-muted">{formatAuthors(pub.authors)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {pub.doi ? <PubLink href={`https://doi.org/${pub.doi}`}>DOI</PubLink> : null}
        {pub.arxiv ? <PubLink href={pub.arxiv}>arXiv</PubLink> : null}
        {pub.pdf ? <PubLink href={assetUrl(pub.pdf)}>PDF</PubLink> : null}
        {pub.url ? <PubLink href={pub.url}>Publisher</PubLink> : null}
        {pub.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </article>
  );
}
