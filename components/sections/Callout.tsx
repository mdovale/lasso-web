import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/** Full-width call-to-action band (e.g. "Join the lab"). */
export function Callout({
  title,
  text,
  button,
}: {
  title: string;
  text: string;
  button: { label: string; href: string };
}) {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="u-grid-bg relative overflow-hidden rounded-3xl border border-line bg-ink-raised px-8 py-16 text-center sm:px-16 sm:py-20">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,82,136,0.35),transparent_65%)]"
              aria-hidden
            />
            <div className="relative">
              <h2 className="u-display mx-auto max-w-2xl text-3xl text-fg sm:text-4xl">
                {title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
                {text}
              </p>
              <div className="mt-9">
                <Button href={button.href}>{button.label}</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
