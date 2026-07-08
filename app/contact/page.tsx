import type { Metadata } from "next";
import { getPages, getSite } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const { contact } = getPages();
  return { title: contact.title, description: contact.intro };
}

export default function ContactPage() {
  const { contact: copy } = getPages();
  const site = getSite();

  return (
    <>
      <PageHeader eyebrow="Contact" title={copy.title} intro={copy.intro} />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-ink-raised p-8">
              <h2 className="u-label mb-5 text-fg-faint">Email & phone</h2>
              <p className="text-lg text-fg">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-sky underline decoration-sky/40 underline-offset-4 transition-colors hover:decoration-sky"
                >
                  {site.contact.email}
                </a>
              </p>
              {site.contact.phone ? (
                <p className="mt-2 text-fg-muted">{site.contact.phone}</p>
              ) : null}
              <div className="mt-auto pt-8">
                <Button href={`mailto:${site.contact.email}`}>Write to us</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-ink-raised p-8">
              <h2 className="u-label mb-5 text-fg-faint">Address</h2>
              <address className="not-italic leading-relaxed text-fg-muted">
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {site.contact.mapUrl ? (
                <div className="mt-auto pt-8">
                  <Button href={site.contact.mapUrl} variant="outline">
                    Open in Maps
                  </Button>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>

        {copy.visitNotes ? (
          <Reveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-line bg-ink-raised/50 p-8">
              <h2 className="u-label mb-4 text-fg-faint">Visiting the lab</h2>
              <Prose text={copy.visitNotes} />
            </div>
          </Reveal>
        ) : null}
      </Container>
    </>
  );
}
