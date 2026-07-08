import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/** Row of headline metrics under the hero, fed from pages.yaml → home.stats. */
export function StatsBar({ stats }: { stats: { value: string; label: string }[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="border-y border-line bg-ink-raised/40">
      <Container>
        <dl className="grid grid-cols-2 divide-line max-md:gap-y-px md:grid-cols-4 md:divide-x">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <div className="px-2 py-9 text-center md:px-6">
                <dd className="u-display text-3xl text-sky sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="u-label mt-3 text-fg-faint">{stat.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
