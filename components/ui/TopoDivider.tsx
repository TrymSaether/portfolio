export function TopoDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className="w-full h-12 sm:h-16 opacity-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        style={{
          color: "color-mix(in oklab, var(--accent) 50%, transparent)",
          transform: flip ? "scaleY(-1)" : undefined,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const y = 16 + i * 12;
          const amp = 4 + i * 1.5;
          const phase = i * 0.7;
          const points: string[] = [];
          for (let x = 0; x <= 1200; x += 20) {
            const yy =
              y +
              Math.sin((x / 1200) * Math.PI * 4 + phase) * amp +
              Math.sin((x / 1200) * Math.PI * 8 + phase * 1.5) * (amp * 0.4);
            points.push(`${x},${yy.toFixed(1)}`);
          }
          return (
            <polyline
              key={i}
              points={points.join(" ")}
              opacity={1 - i * 0.12}
            />
          );
        })}
        <circle
          cx="600"
          cy="40"
          r="2.5"
          fill="currentColor"
          stroke="none"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
