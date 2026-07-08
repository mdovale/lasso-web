import Link from "next/link";
import { Reveal } from "./Reveal";

/** Section heading with eyebrow and optional "view all" link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { label: string; href: string };
}) {
  return (
    <Reveal>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="u-label mb-3 text-sky">{eyebrow}</p>
          <h2 className="u-display text-3xl text-fg sm:text-4xl">{title}</h2>
        </div>
        {link ? (
          <Link
            href={link.href}
            className="u-label text-fg-muted transition-colors hover:text-sky"
          >
            {link.label} →
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
