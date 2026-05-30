import type { Metadata } from "next";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected technical projects by Trym Sæther across mathematical reference tools, simulation software, numerical methods, machine learning, optical flow, and visualization.",
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
        lede="A grounded selection of Math Atlas, mixed-signal simulation, SVM classification, optical flow, adaptive FEM, ocean-current particle transport, and numerical image processing."
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
