import Link from "next/link";
import type { Project } from "@/lib/schemas";
import { SmartImage } from "@/components/ui/SmartImage";
import { Tag } from "@/components/ui/Tag";

const statusLabel: Record<Project["status"], string> = {
  active: "Active",
  completed: "Completed",
  planned: "Planned",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/research/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised transition-colors duration-300 hover:border-line-bright hover:bg-ink-overlay"
    >
      <SmartImage
        src={project.image}
        alt={project.title}
        sizes="(min-width: 768px) 33vw, 100vw"
        fallbackLabel={project.title
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Tag tone={project.status === "active" ? "sky" : "default"}>
            {statusLabel[project.status]}
          </Tag>
          {project.tags.slice(0, 2).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="u-display text-xl text-fg transition-colors group-hover:text-sky">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
          {project.summary}
        </p>
        <span className="u-label mt-5 text-fg-faint transition-colors group-hover:text-sky">
          Read more →
        </span>
      </div>
    </Link>
  );
}
