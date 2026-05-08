import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl leading-tight">
            Trym Sæther
          </p>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-xs">
            Mathematics into software. Field notes from the road between the
            two.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            63°25′N · 10°23′E · Trondheim
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            The Map
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-[var(--accent)]" href="/about">About</Link></li>
            <li><Link className="hover:text-[var(--accent)]" href="/work">Work & Education</Link></li>
            <li><Link className="hover:text-[var(--accent)]" href="/notes">Notes & Book</Link></li>
            <li><Link className="hover:text-[var(--accent)]" href="/projects">Selected Work</Link></li>
            <li><Link className="hover:text-[var(--accent)]" href="/personal">Personal</Link></li>
            <li><Link className="hover:text-[var(--accent)]" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Open channels
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:text-[var(--accent)]" href="mailto:hei@trymsaether.no">
                hei@trymsaether.no
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
              <a className="hover:text-[var(--accent)]" href="/cv.pdf">
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
            Built with Next.js · Three.js · Coffee
          </p>
        </div>
      </div>
    </footer>
  );
}
