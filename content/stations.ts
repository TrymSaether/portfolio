export type StationId =
  | "about"
  | "work"
  | "notes"
  | "projects"
  | "personal"
  | "contact";

export interface Station {
  id: StationId;
  index: number;
  label: string;
  subtitle: string;
  motif: "observatory" | "cabin" | "radio" | "crystal" | "compass" | "notebook";
  /** Position in normalized terrain coordinates (-1..1, -1..1) */
  position: [number, number];
  /** Elevation factor 0..1 for the station marker height */
  elevation: number;
  href: string;
  glyph: string;
  oneLiner: string;
}

export const stations: Station[] = [
  {
    id: "about",
    index: 1,
    label: "About",
    subtitle: "Mindset & Method",
    motif: "compass",
    position: [-0.62, 0.32],
    elevation: 0.55,
    href: "/about",
    glyph: "I",
    oneLiner: "How a mathematician thinks, and how an engineer ships.",
  },
  {
    id: "work",
    index: 2,
    label: "Work & Education",
    subtitle: "Trajectory",
    motif: "observatory",
    position: [-0.18, 0.72],
    elevation: 0.78,
    href: "/work",
    glyph: "II",
    oneLiner: "Mathematics, physics, and the long road through engineering.",
  },
  {
    id: "notes",
    index: 3,
    label: "Notes & Book",
    subtitle: "Field Notebook",
    motif: "notebook",
    position: [0.34, 0.46],
    elevation: 0.42,
    href: "/notes",
    glyph: "III",
    oneLiner: "Working notes on numerical methods, PDEs, and clear writing.",
  },
  {
    id: "projects",
    index: 4,
    label: "Selected Work",
    subtitle: "Built Things",
    motif: "crystal",
    position: [0.7, -0.05],
    elevation: 0.62,
    href: "/projects",
    glyph: "IV",
    oneLiner: "Simulators, solvers, and tools that turn theory into pixels.",
  },
  {
    id: "personal",
    index: 5,
    label: "Personal",
    subtitle: "Off the Map",
    motif: "cabin",
    position: [0.05, -0.55],
    elevation: 0.34,
    href: "/personal",
    glyph: "V",
    oneLiner: "Mountains, photographs, and the value of looking around.",
  },
  {
    id: "contact",
    index: 6,
    label: "Contact",
    subtitle: "Open Channel",
    motif: "radio",
    position: [-0.7, -0.4],
    elevation: 0.7,
    href: "/contact",
    glyph: "VI",
    oneLiner: "A radio tower at the edge of the map. Send a signal.",
  },
];
