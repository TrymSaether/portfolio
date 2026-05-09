import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

/**
 * Editorial prose styling for MDX notes & book chapters.
 * Headings, paragraphs, code, math, and a few custom components
 * (Marginalia, Pullquote, Figure) tuned for long-form reading.
 */
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-balance text-4xl sm:text-5xl leading-[1.05] mt-2 mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-balance text-2xl sm:text-3xl leading-tight mt-16 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl sm:text-2xl leading-snug mt-10 mb-3 text-(--fg)">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base sm:text-lg leading-[1.75] text-ink-100 my-5 max-w-prose">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="text-(--fg) font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="font-display-italic">{children}</em>,
    a: ({ href = "", children }) => (
      <a
        href={href}
        className="text-gold-400 underline decoration-gold-400/30 underline-offset-4 hover:decoration-gold-400"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="my-5 ml-6 list-disc space-y-2 text-ink-100 marker:text-gold-400 max-w-prose">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 ml-6 list-decimal space-y-2 text-ink-100 marker:text-gold-400 max-w-prose">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-gold-400/40 pl-5 sm:pl-6 max-w-prose">
        <div className="font-display-italic text-xl leading-snug text-balance text-(--fg)">
          {children}
        </div>
      </blockquote>
    ),
    hr: () => <hr className="my-12 border-0 hairline" />,
    code: ({ children, ...props }) => (
      <code
        {...props}
        className="font-mono text-[0.92em] px-1 py-0.5 rounded bg-ink-700/60 text-gold-400"
      >
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 p-4 rounded-2xl border border-(--line) bg-ink-800/70 overflow-x-auto text-[0.86rem] leading-[1.6] max-w-prose [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
        {children}
      </pre>
    ),
    Marginalia: ({ children }: { children?: ReactNode }) => (
      <aside className="hidden lg:block float-right clear-right w-56 ml-8 -mr-60 my-2 text-sm font-display-italic text-(--muted) leading-snug">
        {children}
      </aside>
    ),
    Pullquote: ({ children }: { children?: ReactNode }) => (
      <div className="my-12 max-w-3xl mx-auto">
        <p className="font-display-italic text-balance text-2xl sm:text-3xl leading-snug text-gold-400 text-center">
          {children}
        </p>
      </div>
    ),
    Figure: ({ children, caption }: { children?: ReactNode; caption?: string }) => (
      <figure className="my-10 max-w-prose">
        <div className="rounded-2xl overflow-hidden border border-(--line) bg-ink-800/40">
          {children}
        </div>
        {caption && (
          <figcaption className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-(--muted)">
            {caption}
          </figcaption>
        )}
      </figure>
    ),
    Equation: ({ children }: { children?: ReactNode }) => (
      <div className="my-8 px-4 py-3 rounded-xl border border-(--line) bg-ink-800/40 text-center text-lg text-(--fg) overflow-x-auto">
        {children}
      </div>
    ),
    ...components,
  };
}
