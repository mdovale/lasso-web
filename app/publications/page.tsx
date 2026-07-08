import type { Metadata } from "next";
import { getPages, getPublications } from "@/lib/content";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const { publications } = getPages();
  return { title: publications.title, description: publications.intro };
}

export default function PublicationsPage() {
  const { publications: copy } = getPages();
  const publications = getPublications();

  // Group by year, newest first (publications are already sorted).
  const byYear = new Map<number, typeof publications>();
  for (const pub of publications) {
    const list = byYear.get(pub.year) ?? [];
    list.push(pub);
    byYear.set(pub.year, list);
  }

  return (
    <>
      <PageHeader eyebrow="Publications" title={copy.title} intro={copy.intro} />
      <Container className="py-16">
        <div className="space-y-16">
          {[...byYear.entries()].map(([year, pubs]) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <Reveal>
                <h2
                  id={`year-${year}`}
                  className="u-display mb-6 border-b border-line pb-3 text-3xl text-fg-muted"
                >
                  {year}
                </h2>
              </Reveal>
              <div className="grid gap-5">
                {pubs.map((pub, i) => (
                  <Reveal key={pub.id} delay={i * 0.04}>
                    <PublicationCard publication={pub} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
