type SigilProps = { slug: string; className?: string };

const stroke = "var(--accent)";
const muted = "color-mix(in oklab, var(--accent) 35%, transparent)";

export function ProjectSigil({ slug, className }: SigilProps) {
  const sigil = sigils[slug] ?? defaultSigil;
  return (
    <svg
      viewBox="0 0 96 64"
      className={className}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
    >
      {sigil}
    </svg>
  );
}

const defaultSigil = (
  <g>
    <circle cx="48" cy="32" r="20" stroke={muted} />
    <circle cx="48" cy="32" r="6" />
  </g>
);

const sigils: Record<string, React.ReactNode> = {
  // VAMSC — analog sine over digital square: mixed-signal
  vamsc: (
    <g>
      <path
        d="M4 32 Q 16 12, 28 32 T 52 32 T 76 32 T 92 32"
        stroke={muted}
      />
      <path d="M4 44 H16 V20 H32 V44 H48 V20 H64 V44 H80 V20 H92" />
    </g>
  ),
  // SVM — two clusters and a separating hyperplane
  "svm-classifier": (
    <g>
      <line x1="8" y1="56" x2="88" y2="8" />
      <g stroke={muted}>
        <circle cx="20" cy="48" r="2" />
        <circle cx="28" cy="52" r="2" />
        <circle cx="14" cy="40" r="2" />
        <circle cx="32" cy="44" r="2" />
        <circle cx="68" cy="20" r="2" />
        <circle cx="76" cy="12" r="2" />
        <circle cx="82" cy="20" r="2" />
        <circle cx="70" cy="28" r="2" />
      </g>
    </g>
  ),
  // Optflow — vector field
  optflow: (() => {
    const arrows: React.ReactNode[] = [];
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 6; x++) {
        const cx = 10 + x * 14;
        const cy = 10 + y * 14;
        const angle = Math.sin(x * 0.6 + y * 0.5) * 0.9;
        const dx = Math.cos(angle) * 5;
        const dy = Math.sin(angle) * 5;
        arrows.push(
          <line
            key={`${x}-${y}`}
            x1={cx - dx}
            y1={cy - dy}
            x2={cx + dx}
            y2={cy + dy}
            stroke={y === 1 || y === 2 ? stroke : muted}
          />,
        );
      }
    }
    return <g>{arrows}</g>;
  })(),
  // AFEM — triangular mesh with adaptive refinement on the right
  afem: (
    <g>
      <path
        d="M4 56 L24 16 L44 56 Z M24 16 L44 56 L60 16 Z"
        stroke={muted}
      />
      <path d="M60 16 L76 56 L92 16 Z" />
      <path d="M60 16 L84 36 L76 56 M68 36 L92 16" />
      <path d="M76 36 L84 56" stroke={muted} />
    </g>
  ),
  // Ocean particle transport — flowing trajectories
  "ocean-particle-transport": (
    <g>
      <path d="M2 18 C 24 8, 40 28, 60 18 S 88 28, 96 14" />
      <path d="M2 32 C 24 22, 40 42, 60 32 S 88 42, 96 28" stroke={muted} />
      <path d="M2 46 C 24 36, 40 56, 60 46 S 88 56, 96 42" />
      <circle cx="60" cy="32" r="1.5" fill={stroke} stroke="none" />
      <circle cx="36" cy="22" r="1.5" fill={stroke} stroke="none" />
      <circle cx="80" cy="44" r="1.5" fill={stroke} stroke="none" />
    </g>
  ),
  // Numerical image processing — convolution kernel over pixel grid
  "numerical-image-processing": (() => {
    const cells: React.ReactNode[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 8; x++) {
        const cx = 8 + x * 10;
        const cy = 10 + y * 10;
        const inKernel = x >= 4 && x <= 6 && y >= 1 && y <= 3;
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={cx}
            y={cy}
            width="6"
            height="6"
            stroke={inKernel ? stroke : muted}
          />,
        );
      }
    }
    return (
      <g>
        {cells}
        <rect x="46" y="18" width="22" height="22" stroke={stroke} />
      </g>
    );
  })(),
};
