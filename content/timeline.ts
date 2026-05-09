export interface TimelineEntry {
  marker: string;
  kind: "education" | "work" | "milestone";
  title: string;
  org: string;
  location: string;
  body: string;
  glyph: string;
  tags: string[];
}

export const timeline: TimelineEntry[] = [
  {
    marker: "Academic foundation",
    kind: "education",
    title: "Industrial Mathematics / Physics and Mathematics",
    org: "NTNU",
    location: "Trondheim, NO",
    body: "A mathematics-heavy foundation in modeling, analysis, numerical methods, and scientific reasoning.",
    glyph: "∂",
    tags: ["Mathematics", "Numerical methods", "Modeling"],
  },
  {
    marker: "Engineering foundation",
    kind: "education",
    title: "Electrical Engineering",
    org: "NTNU",
    location: "Trondheim, NO",
    body: "Engineering studies that connect systems thinking, signals, hardware-aware constraints, and practical implementation.",
    glyph: "Σ",
    tags: ["Engineering", "Systems", "Signals"],
  },
  {
    marker: "Industry experience",
    kind: "work",
    title: "Software Developer, Simulation Software",
    org: "Infineon",
    location: "Technical software",
    body: "Worked on simulation software with attention to correctness, engineering constraints, and tools that support technical workflows.",
    glyph: "λ",
    tags: ["Simulation", "Software", "EDA-related"],
  },
  {
    marker: "Current direction",
    kind: "milestone",
    title: "Research-oriented software engineering",
    org: "Independent technical direction",
    location: "Mathematics into software",
    body: "Focused on simulation software, numerical methods, scientific computing, compiler and tooling work, EDA-related systems, and mathematical communication.",
    glyph: "↦",
    tags: ["Scientific computing", "Tooling", "Communication"],
  },
];
