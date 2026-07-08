import type { Metadata } from "next";
import { getNews, getPages } from "@/lib/content";
import { NewsCard } from "@/components/cards/NewsCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const { news } = getPages();
  return { title: news.title, description: news.intro };
}

export default function NewsPage() {
  const { news: copy } = getPages();
  const [latest, ...rest] = getNews();

  return (
    <>
      <PageHeader eyebrow="News" title={copy.title} intro={copy.intro} />
      <Container className="py-16">
        {latest ? (
          <Reveal>
            <div className="mb-10">
              <NewsCard item={latest} large />
            </div>
          </Reveal>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 3) * 0.07}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
