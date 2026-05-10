import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteBySlug, notes } from "@/content/notes";

export async function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
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
  const note = getNoteBySlug(slug);
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
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
          {note.notation} · {note.status}
        </p>
      </header>

      {MDXBody ? (
        <div className="notes-mdx font-sans text-[#2a241d] [&_*]:!opacity-100 [&_h1]:!text-[#17130f] [&_h1]:font-display [&_h1]:text-5xl [&_h1]:leading-tight [&_h2]:!text-[#17130f] [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:mt-14 [&_h2]:mb-6 [&_p]:!text-[#3f372e] [&_p]:leading-8 [&_p]:text-lg [&_p]:mb-6 [&_li]:!text-[#3f372e] [&_li]:leading-8 [&_li]:text-lg [&_ul]:space-y-4 [&_ul]:my-6 [&_strong]:!text-[#17130f] [&_strong]:font-semibold [&_li::marker]:!text-[#b8862a] [&_code]:rounded-md [&_code]:!bg-[#565861] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:!text-[#f1d089] [&_pre]:rounded-2xl [&_pre]:!bg-[#565861] [&_pre]:p-6 [&_pre]:!text-[#ece4d8] [&_pre_code]:!bg-transparent [&_pre_code]:p-0 [&_pre_code]:!text-[#ece4d8] [&_a]:!text-[#8a5d16] [&_a]:underline-offset-4 hover:[&_a]:!text-[#5d3b08]">
          <MDXBody />
        </div>
      ) : (
        <div className="border border-[var(--line)] rounded-2xl p-8">
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
          <p className="mt-8 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)]">
            Topic outline
          </p>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-[var(--line)] flex items-center justify-between">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
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
