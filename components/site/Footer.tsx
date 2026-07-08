import Link from "next/link";
import type { Navigation, Site } from "@/lib/schemas";
import { Container } from "@/components/ui/Container";

/** Site footer fed entirely by content/site.yaml and content/navigation.yaml. */
export function Footer({ site, navigation }: { site: Site; navigation: Navigation }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 border-t border-line bg-ink-raised/50">
      <Container wide className="py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="u-display text-2xl text-fg">{site.shortName}</p>
            <p className="mt-2 text-sm text-fg-muted">{site.name}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
              {site.footer.blurb}
            </p>
            {site.social.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {site.social.map((link) => (
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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {navigation.footer.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="u-label mb-4 text-fg-faint">{column.title}</p>
                <ul className="space-y-2.5">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      {item.href.startsWith("http") ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-fg-muted transition-colors hover:text-fg"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm text-fg-muted transition-colors hover:text-fg"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          {site.footer.acknowledgement ? (
            <p className="max-w-2xl text-xs leading-relaxed text-fg-faint">
              {site.footer.acknowledgement}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-fg-faint">
            © {year} {site.name}, {site.university}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
