import type { Metadata } from "next";
import { getPages, getSite } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

export function generateMetadata(): Metadata {
  const { join } = getPages();
  return { title: join.title, description: join.intro };
}

export default function JoinPage() {
  const { join } = getPages();
  const site = getSite();

  return (
    <>
      <PageHeader eyebrow="Join us" title={join.title} intro={join.intro} />
      <Container className="py-16">
        <Reveal>
          <Prose text={join.body} />
        </Reveal>

        {join.openings.length > 0 && (
          <section className="mt-20" aria-labelledby="openings">
            <Reveal>
              <h2 id="openings" className="u-display mb-8 text-2xl text-fg">
                Current openings
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2">
              {join.openings.map((opening, i) => (
                <Reveal key={opening.title} delay={i * 0.07}>
                  <article className="flex h-full flex-col rounded-2xl border border-line bg-ink-raised p-6">
                    <Tag tone="sky" className="self-start">
                      {opening.type}
                    </Tag>
                    <h3 className="u-display mt-4 text-xl text-fg">{opening.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                      {opening.description}
                    </p>
                    {opening.applyUrl ? (
                      <div className="mt-5">
                        <Button href={opening.applyUrl} variant="outline">
                          Apply
                        </Button>
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20" aria-labelledby="how-to-apply">
          <Reveal>
            <div className="rounded-3xl border border-line bg-ink-raised p-8 sm:p-12">
              <h2 id="how-to-apply" className="u-display mb-6 text-2xl text-fg">
                How to apply
              </h2>
              <Prose text={join.howToApply} />
              <div className="mt-8">
                <Button href={`mailto:${site.contact.email}`}>
                  Email {site.contact.email}
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </Container>
    </>
  );
}
