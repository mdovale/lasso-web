import type { Person } from "@/lib/schemas";
import { RichInline } from "@/lib/richtext";
import { SmartImage } from "@/components/ui/SmartImage";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised transition-colors duration-300 hover:border-line-bright">
      <SmartImage
        src={person.headshot}
        alt={`Portrait of ${person.name}`}
        sizes="(min-width: 768px) 25vw, 50vw"
        fallbackLabel={initials(person.name)}
        className="aspect-square w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-medium text-fg">{person.name}</h3>
        <p className="u-label mt-1.5 text-sky">{person.role}</p>
        {person.affiliation ? (
          <p className="mt-2 text-xs text-fg-faint">{person.affiliation}</p>
        ) : null}
        {person.years ? (
          <p className="mt-2 text-xs text-fg-faint">
            {person.years}
            {person.currentPosition ? ` · ${person.currentPosition}` : ""}
          </p>
        ) : null}
        {person.bio ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
            <RichInline text={person.bio} />
          </p>
        ) : null}
        {(person.links.length > 0 || person.email) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {person.email ? (
              <a
                href={`mailto:${person.email}`}
                className="u-label text-fg-faint transition-colors hover:text-sky"
              >
                Email
              </a>
            ) : null}
            {person.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="u-label text-fg-faint transition-colors hover:text-sky"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
