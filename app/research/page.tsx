import type { Metadata } from "next";
import { getPages, getProjects } from "@/lib/content";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export function generateMetadata(): Metadata {
  const { research } = getPages();
  return { title: research.title, description: research.intro };
}

export default function ResearchPage() {
  const { research } = getPages();
  const projects = getProjects();

  return (
    <>
      <PageHeader eyebrow="Research" title={research.title} intro={research.intro} />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
