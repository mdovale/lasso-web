import {
  getFeaturedProjects,
  getFeaturedPublications,
  getNews,
  getPages,
} from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Callout } from "@/components/sections/Callout";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { PublicationCard } from "@/components/cards/PublicationCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  const pages = getPages();
  const home = pages.home;
  const projects = getFeaturedProjects().slice(0, 3);
  const publications = getFeaturedPublications().slice(0, 3);
  const news = getNews().slice(0, 3);

  return (
    <>
      <Hero
        eyebrow={home.eyebrow}
        headline={home.headline}
        intro={home.intro}
        primaryCta={{ label: "Explore our research", href: "/research" }}
        secondaryCta={{ label: "Meet the team", href: "/people" }}
      />

      <StatsBar stats={home.stats} />

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Research"
            title={home.researchIntro.title}
            link={{ label: "All projects", href: "/research" }}
          />
          <Reveal>
            <p className="mb-12 max-w-2xl text-base leading-relaxed text-fg-muted">
              {home.researchIntro.text}
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-24">
        <Container>
          <SectionHeading
            eyebrow="Publications"
            title="Selected work"
            link={{ label: "All publications", href: "/publications" }}
          />
          <div className="grid gap-5">
            {publications.map((pub, i) => (
              <Reveal key={pub.id} delay={i * 0.06}>
                <PublicationCard publication={pub} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-24">
        <Container>
          <SectionHeading
            eyebrow="News"
            title="Latest from the lab"
            link={{ label: "All news", href: "/news" }}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08}>
                <NewsCard item={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Callout
        title={home.callout.title}
        text={home.callout.text}
        button={{ label: home.callout.button.label, href: home.callout.button.url }}
      />
    </>
  );
}
