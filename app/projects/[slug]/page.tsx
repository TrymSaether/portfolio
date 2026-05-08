import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.blurb,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <Section
      kicker={`Project · ${project.domain}`}
      index={project.glyph}
      title={
        <>
          {project.title}
        </>
      }
      lede={project.kicker}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl">
        <div className="lg:col-span-8 space-y-6">
          <p className="text-lg text-[var(--color-ink-100)] leading-[1.75]">
            {project.longBlurb}
          </p>
          <p className="text-base text-[var(--muted)] leading-[1.75] max-w-prose">
            More documentation, figures, and a live demo will land here as I
            extract them from the original notebooks. In the meantime, the
            short version above is honest about the scope.
          </p>
          <div className="pt-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-gold-400)] hover:text-[var(--color-gold-500)]"
            >
              <span aria-hidden>←</span>
              Back to selected work
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="glow-card rounded-2xl p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
              Year
            </p>
            <p className="mt-1 font-display text-2xl">{project.year}</p>
          </div>
          <div className="glow-card rounded-2xl p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
              Stack
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <li
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] border border-[var(--line)] rounded-full px-2 py-0.5"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glow-card rounded-2xl p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted)]">
              Status
            </p>
            <p className="mt-1 font-display text-xl text-[var(--color-gold-400)]">
              {project.status}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
