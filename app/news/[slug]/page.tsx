import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMediaById,
  getNews,
  getNewsBySlug,
  getPersonById,
  getProjectBySlug,
} from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { MediaFigure } from "@/components/cards/MediaFigure";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: item.date,
      ...(item.image ? { images: [{ url: item.image }] } : {}),
    },
  };
}

export default async function NewsPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const people = item.people
    .map(getPersonById)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const projects = item.projects
    .map(getProjectBySlug)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const media = item.media
    .map(getMediaById)
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <article>
      <header className="border-b border-line pt-36 pb-14 sm:pt-44 sm:pb-16">
        <Container>
          <Reveal>
            <Link
              href="/news"
              className="u-label text-fg-faint transition-colors hover:text-sky"
            >
              ← All news
            </Link>
            <time dateTime={item.date} className="u-label mt-6 block text-sky">
              {formatDate(item.date)}
            </time>
            <h1 className="u-display mt-4 max-w-3xl text-4xl text-fg sm:text-5xl">
              {item.title}
            </h1>
          </Reveal>
        </Container>
      </header>

      {item.image ? (
        <Container className="mt-12">
          <Reveal>
            <SmartImage
              src={item.image}
              alt={item.title}
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="aspect-[21/9] w-full rounded-3xl border border-line"
            />
          </Reveal>
        </Container>
      ) : null}

      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
          <Reveal>
            <Prose text={item.body} />
          </Reveal>

          <aside className="space-y-10">
            {people.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="u-label mb-4 text-fg-faint">People</h2>
                  <ul className="space-y-3">
                    {people.map((person) => (
                      <li key={person.id}>
                        <p className="text-sm font-medium text-fg">{person.name}</p>
                        <p className="text-xs text-fg-muted">{person.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {projects.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="u-label mb-4 text-fg-faint">Related projects</h2>
                  <ul className="space-y-2.5">
                    {projects.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/research/${project.slug}`}
                          className="text-sm text-sky underline decoration-sky/40 underline-offset-4 transition-colors hover:decoration-sky"
                        >
                          {project.title}
                        </Link>
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
            <div className="grid gap-6 sm:grid-cols-2">
              {media.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.07}>
                  <MediaFigure item={m} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
