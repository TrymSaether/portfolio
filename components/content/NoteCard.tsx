import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { TagList } from "./TagList";
import type { Note } from "@/content/notes";

interface NoteCardProps {
  note: Note;
  delay?: number;
  variant?: "compact" | "index";
}

export function NoteCard({
  note,
  delay = 0,
  variant = "compact",
}: NoteCardProps) {
  const isIndex = variant === "index";

  return (
    <Reveal as="li" key={note.slug} delay={delay}>
      <Link href={`/notes/${note.slug}`} className="block group h-full">
        <article
          id={isIndex ? note.slug : undefined}
          className="glow-card h-full rounded-2xl p-6 group-hover:-translate-y-0.5 transition-transform duration-500"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className={cn(
                "font-mono text-[10px] tracking-[0.3em] uppercase",
                isIndex ? "text-[var(--accent)]" : "text-[var(--muted)]",
              )}
            >
              {note.kicker}
            </p>
            <p
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.18em]",
                isIndex ? "text-[var(--muted)]" : "text-[var(--accent)]",
              )}
            >
              {note.notation}
            </p>
          </div>
          <h3
            className={cn(
              "mt-3 font-display text-2xl leading-tight",
              isIndex && "sm:text-3xl",
            )}
          >
            {note.title}
          </h3>
          <p
            className={cn(
              "leading-relaxed max-w-prose",
              isIndex
                ? "mt-3 text-base text-[var(--fg-soft)]"
                : "mt-2 text-sm text-[var(--muted)]",
            )}
          >
            {note.excerpt}
          </p>
          {isIndex ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <TagList
                tags={note.tags}
                itemClassName="text-[var(--fg-soft)]"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {note.repository ? "public notes" : note.status}
              </p>
            </div>
          ) : (
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {note.tags.join(" · ")}
            </p>
          )}
        </article>
      </Link>
    </Reveal>
  );
}
