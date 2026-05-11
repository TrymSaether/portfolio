import Link from "next/link";

const stations = [
  { href: "/", glyph: "○", label: "Home" },
  { href: "/about", glyph: "I", label: "About" },
  { href: "/work", glyph: "II", label: "Work" },
  { href: "/notes", glyph: "III", label: "Notes" },
  { href: "/projects", glyph: "IV", label: "Selected" },
  { href: "/personal", glyph: "V", label: "Personal" },
  { href: "/contact", glyph: "VI", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {stations.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group inline-flex items-baseline gap-2 text-[var(--fg-soft)] hover:text-[var(--accent)] transition-colors"
              >
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity">
                  {s.glyph}
                </span>
                <span className="text-sm">{s.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[var(--line)]">
        <div>
          <p className="font-display text-2xl leading-tight">
            Trym Sæther
          </p>
          <p className="mt-2 text-sm text-[var(--text)] max-w-md">
            Mathematics into software: numerical methods, simulation tools,
            compiler-adjacent workflows, and clear technical communication.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            63°25′N · 10°23′E · Trondheim
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Open channels
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:text-[var(--accent)]" href="mailto:saether.trym@gmail.com">
                saether.trym@gmail.com
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--accent)]" href="https://github.com/trymsaether" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--accent)]" href="https://www.linkedin.com/in/trymsaether" target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a
                className="hover:text-[var(--accent)]"
                href="/assets/documents/trym-saether-cv.pdf"
              >
                Curriculum vitae ↘
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            © {new Date().getFullYear()} Trym Sæther — handcrafted, slowly
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Built with Next.js · Three.js · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
