"use client";

import { motion, useReducedMotion } from "framer-motion";
import { InterferenceField } from "@/components/graphics/InterferenceField";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Homepage hero: generative interference-field backdrop with editorial
 * headline. All copy comes from content/pages.yaml (home section).
 */
export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}) {
  const reduceMotion = useReducedMotion();
  const entrance = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      {/* Generative backdrop + gradient wash for text legibility */}
      <div className="absolute inset-0" aria-hidden>
        <InterferenceField className="h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,7,15,0.72)_0%,rgba(5,7,15,0.35)_45%,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <Container className="relative py-36">
        <motion.p className="u-label mb-6 text-sky" {...entrance(0.05)}>
          {eyebrow}
        </motion.p>
        <motion.h1
          className="u-display max-w-4xl whitespace-pre-line text-[2.75rem] leading-[1.05] text-fg sm:text-6xl md:text-7xl"
          {...entrance(0.15)}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted"
          {...entrance(0.3)}
        >
          {intro}
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap gap-3" {...entrance(0.42)}>
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          <Button href={secondaryCta.href} variant="outline">
            {secondaryCta.label}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
