import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notes } from "@/content/notes";

export async function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();

  let MDXBody: React.ComponentType | null = null;
  try {
    const mod = await import(`@/content/notes/${slug}.mdx`);
    MDXBody = mod.default;
  } catch {
    // Topic exists in the index even when a long-form MDX note is not present.
    MDXBody = null;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <header className="mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--accent)]">
          {note.kicker}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-(--muted)">
          {note.notation} · {note.status}
        </p>
      </header>

      {MDXBody ? (
        <div className="font-sans">
          <MDXBody />
        </div>
      ) : (
        <div className="border border-(--line) rounded-2xl p-8">
          <h1 className="font-display text-4xl leading-tight">{note.title}</h1>
          <p className="mt-4 text-[var(--fg)]">{note.excerpt}</p>
          {note.repository ? (
            <a
              href={note.repository}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              Public notes repository
              <span aria-hidden>↗</span>
            </a>
          ) : null}
          <p className="mt-8 font-mono text-[10px] tracking-[0.18em] uppercase text-(--muted)">
            Topic outline
          </p>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-(--line) flex items-center justify-between">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          <span aria-hidden>←</span>
          All notes
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--muted)">
          {note.tags.join(" · ")}
        </p>
      </footer>
    </article>
  );
}
