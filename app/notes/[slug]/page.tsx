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
    // Note exists in the index but the chapter hasn't been written yet.
    MDXBody = null;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <header className="mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--color-gold-400)]">
          {note.kicker}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
          {note.date} · {note.reading} ·{" "}
          {note.status === "chapter" ? "Book chapter" : note.status}
        </p>
      </header>

      {MDXBody ? (
        <div className="font-sans">
          <MDXBody />
        </div>
      ) : (
        <div className="border border-[var(--line)] rounded-2xl p-8">
          <h1 className="font-display text-4xl leading-tight">{note.title}</h1>
          <p className="mt-4 text-[var(--color-ink-100)]">{note.excerpt}</p>
          <p className="mt-8 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
            Draft in progress · check back soon.
          </p>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-[var(--line)] flex items-center justify-between">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-gold-400)] hover:text-[var(--color-gold-500)]"
        >
          <span aria-hidden>←</span>
          All notes
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
          {note.tags.join(" · ")}
        </p>
      </footer>
    </article>
  );
}
