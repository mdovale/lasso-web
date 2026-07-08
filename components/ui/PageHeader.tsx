import { Container } from "./Container";
import { Reveal } from "./Reveal";

/**
 * Standard header block at the top of every inner page: monospace eyebrow,
 * display title, and an intro paragraph fed from content/pages.yaml.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-line pt-36 pb-14 sm:pt-44 sm:pb-20">
      <Container>
        <Reveal>
          <p className="u-label mb-5 text-sky">{eyebrow}</p>
          <h1 className="u-display max-w-3xl text-4xl text-fg sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {intro}
            </p>
          ) : null}
        </Reveal>
      </Container>
    </header>
  );
}
