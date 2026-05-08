export type StationId =
  | "about"
  | "work"
  | "notes"
  | "projects"
  | "personal"
  | "contact";

export interface StationPalette {
  /** Primary accent — used on rings, beams, halos, motif highlights. */
  accent: string;
  /** Secondary tint — used on subtler elements (motif fill, ground halo). */
  tint: string;
  /** Cool/neutral counterpart used to balance the accent in shadow areas. */
  cool: string;
}

export interface Station {
  id: StationId;
  index: number;
  label: string;
  subtitle: string;
  motif: "observatory" | "cabin" | "radio" | "crystal" | "compass" | "notebook";
  /** Position in normalized terrain coordinates (-1..1, -1..1). */
  position: [number, number];
  /** Where the rover parks (small offset from the station center, in world units). */
  parkOffset: [number, number];
  href: string;
  glyph: string;
  oneLiner: string;
  palette: StationPalette;
}

export const stations: Station[] = [
  {
    id: "about",
    index: 1,
    label: "About",
    subtitle: "Mindset & Method",
    motif: "compass",
    position: [-0.62, 0.32],
    parkOffset: [0.55, 0.0],
    href: "/about",
    glyph: "I",
    oneLiner: "How a mathematician thinks, and how an engineer ships.",
    palette: {
      accent: "#9ad7df",
      tint: "#f6f1e6",
      cool: "#3c5d6a",
    },
  },
  {
    id: "work",
    index: 2,
    label: "Work & Education",
    subtitle: "Trajectory",
    motif: "observatory",
    position: [-0.18, 0.72],
    parkOffset: [0.55, -0.2],
    href: "/work",
    glyph: "II",
    oneLiner: "Mathematics, physics, and the long road through engineering.",
    palette: {
      accent: "#f3c66b",
      tint: "#fff5d4",
      cool: "#5a4a2e",
    },
  },
  {
    id: "notes",
    index: 3,
    label: "Notes & Book",
    subtitle: "Field Notebook",
    motif: "notebook",
    position: [0.34, 0.66],
    parkOffset: [-0.5, 0.25],
    href: "/notes",
    glyph: "III",
    oneLiner: "Working notes on numerical methods, PDEs, and clear writing.",
    palette: {
      accent: "#e8a35c",
      tint: "#fbe0bc",
      cool: "#5a3b1d",
    },
  },
  {
    id: "projects",
    index: 4,
    label: "Selected Work",
    subtitle: "Built Things",
    motif: "crystal",
    position: [0.7, -0.05],
    parkOffset: [-0.45, 0.45],
    href: "/projects",
    glyph: "IV",
    oneLiner: "Simulators, solvers, and tools that turn theory into pixels.",
    palette: {
      accent: "#b9a3e6",
      tint: "#dcd0f7",
      cool: "#3e2f5a",
    },
  },
  {
    id: "personal",
    index: 5,
    label: "Personal",
    subtitle: "Off the Map",
    motif: "cabin",
    position: [0.05, -0.55],
    parkOffset: [0.55, 0.1],
    href: "/personal",
    glyph: "V",
    oneLiner: "Mountains, photographs, and the value of looking around.",
    palette: {
      accent: "#a7c79a",
      tint: "#e3eed8",
      cool: "#2e4530",
    },
  },
  {
    id: "contact",
    index: 6,
    label: "Contact",
    subtitle: "Open Channel",
    motif: "radio",
    position: [-0.7, -0.4],
    parkOffset: [0.5, 0.25],
    href: "/contact",
    glyph: "VI",
    oneLiner: "A radio tower at the edge of the map. Send a signal.",
    palette: {
      accent: "#7aa6e8",
      tint: "#cfdcf2",
      cool: "#1f2f4f",
    },
  },
];
