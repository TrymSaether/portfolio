export interface TimelineEntry {
  year: string;
  range?: string;
  kind: "education" | "work" | "milestone";
  title: string;
  org: string;
  location: string;
  body: string;
  glyph: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2025",
    range: "2025 — present",
    kind: "work",
    title: "Scientific Software Engineer",
    org: "Independent",
    location: "Trondheim, NO",
    body: "Building simulation tools and numerical libraries on contract — finite-element solvers, fluid models, and the visualization layers that make them legible.",
    glyph: "★",
  },
  {
    year: "2024",
    kind: "milestone",
    title: "First book draft",
    org: "Self-published",
    location: "—",
    body: "Completed the first complete draft of a book on numerical methods, written for engineers who want to recover the intuition mathematics tries to teach.",
    glyph: "✎",
  },
  {
    year: "2023",
    range: "2023 — 2025",
    kind: "work",
    title: "Numerics Engineer",
    org: "Sintef-affiliated lab",
    location: "Trondheim, NO",
    body: "PDE-constrained optimization for offshore renewables. Wrote the in-house adjoint solver and the gradient checker that kept it honest.",
    glyph: "◇",
  },
  {
    year: "2021",
    range: "2021 — 2023",
    kind: "education",
    title: "M.Sc. Applied Mathematics",
    org: "NTNU",
    location: "Trondheim, NO",
    body: "Thesis on stability of high-order time integrators for stiff hyperbolic systems. Dabbled in differential geometry and discovered I liked teaching it.",
    glyph: "△",
  },
  {
    year: "2018",
    range: "2018 — 2021",
    kind: "education",
    title: "B.Sc. Physics & Mathematics",
    org: "NTNU",
    location: "Trondheim, NO",
    body: "A stubborn double major. Spent every winter holiday on a different proof I couldn't quite finish, then could.",
    glyph: "○",
  },
  {
    year: "2017",
    kind: "milestone",
    title: "First solver",
    org: "Bedroom desk",
    location: "Bergen, NO",
    body: "Wrote a Runge–Kutta integrator in Python to simulate a double pendulum because a physics teacher said the result was 'qualitatively chaotic.' Wanted to see for myself.",
    glyph: "•",
  },
];
