"use client";

/**
 * Decorative SVG topographic background used for the mobile map and as a
 * loading fallback for the WebGL canvas. Pure SVG — fast and scalable.
 */
export function TopoSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full ${className}`}
      aria-hidden
    >
      <defs>
        <radialGradient id="topo-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="topo-fade" cx="50%" cy="50%" r="60%">
          <stop offset="60%" stopColor="var(--bg)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="var(--bg)" />
      <rect width="800" height="800" fill="url(#topo-glow)" />
      <g stroke="var(--fg-soft)" strokeOpacity="0.18" strokeWidth="0.7" fill="none">
        {Array.from({ length: 22 }).map((_, i) => {
          const r = 30 + i * 28;
          return (
            <ellipse
              key={i}
              cx="400"
              cy="430"
              rx={r * 1.15}
              ry={r * 0.78}
              transform="rotate(-12 400 430)"
            />
          );
        })}
      </g>
      <g stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="0.8" fill="none">
        <path d="M120 600 C 240 500, 360 580, 480 380 S 660 220, 720 180" />
        <path d="M120 700 C 220 620, 340 660, 480 500 S 640 360, 720 320" strokeDasharray="2 4" />
      </g>
      <rect width="800" height="800" fill="url(#topo-fade)" />
    </svg>
  );
}
