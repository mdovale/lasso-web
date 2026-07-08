import type { Metadata } from "next";
import { getPages, getPeopleByGroup } from "@/lib/content";
import { PersonCard } from "@/components/cards/PersonCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const { people } = getPages();
  return { title: people.title, description: people.intro };
}

export default function PeoplePage() {
  const { people: copy } = getPages();
  const groups = getPeopleByGroup().filter((g) => g.people.length > 0);

  return (
    <>
      <PageHeader eyebrow="People" title={copy.title} intro={copy.intro} />
      <Container className="py-16">
        <div className="space-y-20">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <Reveal>
                <h2
                  id={`group-${group.id}`}
                  className="u-display mb-8 border-b border-line pb-3 text-2xl text-fg"
                >
                  {group.title}
                </h2>
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.people.map((person, i) => (
                  <Reveal key={person.id} delay={(i % 4) * 0.06}>
                    <PersonCard person={person} />
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
