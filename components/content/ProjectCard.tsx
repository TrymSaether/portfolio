import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { Project } from "@/content/projects";
import { projectStatusLabels } from "@/content/projects";
import { TagList } from "./TagList";
import { ProjectSigil } from "./ProjectSigil";

interface ProjectCardProps {
  project: Project;
  delay?: number;
  variant?: "compact" | "index";
}

export function ProjectCard({
  project,
  delay = 0,
  variant = "compact",
}: ProjectCardProps) {
  const isIndex = variant === "index";

  return (
    <Reveal as="li" key={project.slug} delay={delay}>
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <article
          className={cn(
            "glow-card relative h-full rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1",
            isIndex && "overflow-hidden",
          )}
        >
          {isIndex ? <ProjectCrystal slug={project.slug} /> : null}
          <div className="relative">
            {!isIndex && (
              <ProjectSigil
                slug={project.slug}
                className="h-12 w-auto mb-5 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] uppercase",
                  isIndex
                    ? "tracking-[0.2em] text-[var(--accent)]"
                    : "tracking-[0.3em] text-[var(--muted)]",
                )}
              >
                {isIndex ? project.domain : project.kicker}
              </span>
              {isIndex && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {project.context}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-2xl leading-tight">
              {project.title}
            </h3>
            {isIndex ? (
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
                {project.kicker}
              </p>
            ) : null}
            <p
              className={cn(
                "mt-2 text-sm leading-relaxed",
                isIndex ? "mt-4 text-[var(--fg-soft)]" : "text-[var(--text)]",
              )}
            >
              {project.blurb}
            </p>
            <TagList
              tags={project.stack}
              className="mt-5"
              itemClassName={
                isIndex ? "text-[var(--fg)]" : "text-[var(--fg-soft)]"
              }
            />
            {isIndex ? (
              <div className="mt-6 flex items-center justify-between">
                <ProjectStatus status={project.status} />
                <span className="text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </span>
              </div>
            ) : null}
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

function ProjectStatus({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.18em]",
        status === "public"
          ? "text-[var(--color-aurora)]"
          : status === "writing"
            ? "text-[var(--accent)]"
            : "text-[var(--color-ember)]",
      )}
    >
      ● {projectStatusLabels[status]}
    </span>
  );
}

function ProjectCrystal({ slug }: { slug: string }) {
  return (
    <div className="absolute -right-10 -top-10 w-44 h-44 opacity-30 group-hover:opacity-50 transition-opacity">
      <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
        <defs>
          <linearGradient id={`g-${slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3c66b" />
            <stop offset="100%" stopColor="#74c0c8" />
          </linearGradient>
        </defs>
        <g stroke={`url(#g-${slug})`} strokeWidth="0.8" fill="none">
          {Array.from({ length: 14 }).map((_, i) => (
            <polygon
              key={i}
              points={polygon(100, 100, 18 + i * 8, 6, i * 6)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

function polygon(cx: number, cy: number, r: number, n: number, rot = 0) {
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rot * Math.PI) / 180;
    points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return points.join(" ");
}
