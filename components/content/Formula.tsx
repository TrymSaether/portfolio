import katex from "katex";

export function Formula({
  tex,
  className,
}: {
  tex: string;
  className?: string;
}) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    output: "html",
    displayMode: false,
  });
  return (
    <span
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
