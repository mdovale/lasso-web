import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMediaById,
  getPersonById,
  getProjectBySlug,
  getProjects,
  getPublicationById,
} from "@/lib/content";
import { MediaFigure } from "@/components/cards/MediaFigure";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tag } from "@/components/ui/Tag";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  };
}

const statusLabel = { active: "Active", completed: "Completed", planned: "Planned" };

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const team = project.people
    .map(getPersonById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const publications = project.publications
    .map(getPublicationById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .sort((a, b) => b.year - a.year);
  const media = project.media
    .map(getMediaById)
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <>
      <header className="border-b border-line pt-36 pb-14 sm:pt-44 sm:pb-16">
        <Container>
          <Reveal>
            <Link
              href="/research"
              className="u-label text-fg-faint transition-colors hover:text-sky"
            >
              ← All research
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <Tag tone={project.status === "active" ? "sky" : "default"}>
                {statusLabel[project.status]}
              </Tag>
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <h1 className="u-display mt-6 max-w-3xl text-4xl text-fg sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {project.summary}
            </p>
          </Reveal>
        </Container>
      </header>

      {project.image ? (
        <Container wide className="mt-12">
          <Reveal>
            <SmartImage
              src={project.image}
              alt={project.title}
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="aspect-[21/9] w-full rounded-3xl border border-line"
            />
          </Reveal>
        </Container>
      ) : null}

      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
          <Reveal>
            <Prose text={project.description} />
          </Reveal>

          <aside className="space-y-10">
            {team.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="u-label mb-4 text-fg-faint">Team</h2>
                  <ul className="space-y-3">
                    {team.map((person) => (
                      <li key={person.id}>
                        <p className="text-sm font-medium text-fg">{person.name}</p>
                        <p className="text-xs text-fg-muted">{person.role}</p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/people"
                    className="u-label mt-4 inline-block text-fg-faint transition-colors hover:text-sky"
                  >
                    All people →
                  </Link>
                </div>
              </Reveal>
            )}

            {project.links.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="u-label mb-4 text-fg-faint">Links</h2>
                  <ul className="space-y-2.5">
                    {project.links.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          {...(link.url.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-sm text-sky underline decoration-sky/40 underline-offset-4 transition-colors hover:decoration-sky"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </aside>
        </div>

        {media.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="u-display mb-8 text-2xl text-fg">Media</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {media.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.07}>
                  <MediaFigure item={item} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {publications.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="u-display mb-8 text-2xl text-fg">Related publications</h2>
            </Reveal>
            <div className="grid gap-5">
              {publications.map((pub, i) => (
                <Reveal key={pub.id} delay={i * 0.05}>
                  <PublicationCard publication={pub} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
