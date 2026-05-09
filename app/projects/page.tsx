import type { Metadata } from "next";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected technical projects by Trym Sæther across numerical mathematics, scientific computing, compiler-adjacent tooling, and visualization.",
};

export default function ProjectsPage() {
  return (
    <>
      <Section
        kicker="Sheet 05 · Built things"
        index="IV"
        title={
          <>
            Numerical software,
            <span className="font-display-italic text-[var(--accent)]">
              {" "}
              tools, and technical artifacts.
            </span>
          </>
        }
        lede="A grounded selection of finite element work, simulation software, DAE tooling, ocean-current particle transport, and mathematical notes."
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              delay={i * 0.04}
              variant="index"
            />
          ))}
        </ul>
      </Section>
    </>
  );
}
