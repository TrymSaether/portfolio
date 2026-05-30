export type StationId =
  | "about"
  | "work"
  | "notes"
  | "projects"
  | "personal"
  | "contact";

export interface StationPalette {
  accent: string;
  tint: string;
  cool: string;
}

// Centralized color palette for easy switching/testing
export const stationColors: Record<string, StationPalette> = {
  blue: { accent: "#9ad7df", tint: "#f6f1e6", cool: "#3c5d6a" },
  gold: { accent: "#f3c66b", tint: "#fff5d4", cool: "#5a4a2e" },
  orange: { accent: "#e8a35c", tint: "#fbe0bc", cool: "#5a3b1d" },
  purple: { accent: "#b9a3e6", tint: "#dcd0f7", cool: "#3e2f5a" },
  green: { accent: "#a7c79a", tint: "#e3eed8", cool: "#2e4530" },
  blue2: { accent: "#7aa6e8", tint: "#cfdcf2", cool: "#1f2f4f" },
  // Add more as needed
};

export interface Station {
  id: StationId;
  index: number;
  label: string;
  subtitle: string;
  motif: "observatory" | "cabin" | "radio" | "crystal" | "compass" | "notebook";
  /** Position in normalized terrain coordinates (-1..1, -1..1). */
  position: [number, number];
  /** Visual lift above the terrain-derived y position, in world units. */
  elevationOffset?: number;
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
    oneLiner:
      "First-principles thinking across mathematics, engineering, and software.",
    palette: stationColors.gold,
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
    oneLiner:
      "NTNU mathematics and electrical engineering, plus simulation software at Infineon.",
    palette: stationColors.gold,
  },
  {
    id: "notes",
    index: 3,
    label: "Notes & Book",
    subtitle: "Field Notebook",
    motif: "notebook",
    position: [0.28, 0.42],
    parkOffset: [-0.22, 0.14],
    elevationOffset: 0.52,
    href: "/notes",
    glyph: "III",
    oneLiner:
      "Notes on numerical methods, finite elements, optimization, and clear mathematical writing.",
    palette: stationColors.gold,
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
    oneLiner:
      "Math Atlas, AFEM, VAMSC, particle transport, and other technical artifacts.",
    palette: stationColors.gold,
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
    oneLiner:
      "Nature, photographs, and the parts of life that keep technical work grounded.",
    palette: stationColors.gold,
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
    oneLiner:
      "Contact links for software, scientific computing, and technical conversations.",
    palette: stationColors.gold,
  },
];
