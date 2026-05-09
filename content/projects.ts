export type ProjectDomain =
  | "Compiler / Programming Languages"
  | "Numerical Mathematics"
  | "Scientific Computing"
  | "Graphics / Visualization"
  | "Tools / Infrastructure";

export type ProjectStatus = "public" | "private" | "prototype" | "writing";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  context: string;
  blurb: string;
  longBlurb: string;
  impact: string;
  stack: string[];
  domain: ProjectDomain;
  status: ProjectStatus;
  glyph: string;
  links?: ProjectLink[];
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  public: "public repo",
  private: "private repo",
  prototype: "prototype",
  writing: "writing",
};

export const projects: Project[] = [
  {
    slug: "afem",
    title: "AFEM",
    kicker: "Adaptive Finite Element Methods",
    context: "Academic numerical methods",
    blurb:
      "A numerical-methods project about adaptive refinement, error intuition, and finite element solver behavior.",
    longBlurb:
      "AFEM treats adaptive finite element methods as software, not only as theory. The project centers on refinement loops, local error indicators, mesh-dependent behavior, and the practical question of how much mathematical structure a solver should expose.",
    impact:
      "Adaptive refinement is where numerical analysis becomes an engineering loop: estimate, refine, solve, inspect. The project makes that loop concrete instead of presenting FEM as a black-box discretization.",
    stack: ["Finite elements", "Adaptive refinement", "Error estimation"],
    domain: "Numerical Mathematics",
    status: "private",
    glyph: "∫",
  },
  {
    slug: "quadratic-fem-solvers",
    title: "Quadratic FEM Solvers",
    kicker: "P2 Elements · Poisson · Optimal Control",
    context: "Public academic code",
    blurb:
      "Python implementations of quadratic finite element solvers for a 1D Poisson problem and a related optimal-control problem.",
    longBlurb:
      "This repository implements quadratic P2 finite element methods with vectorized assembly, sparse linear algebra, convergence studies, and plotting utilities. The code includes a primary FEM toolkit, compact reference solvers, and notebooks used to inspect the numerical behavior.",
    impact:
      "The useful part is the traceability: weak forms become sparse matrices, convergence tables check the implementation, and the plotting utilities make mistakes in assembly or boundary handling visible.",
    stack: ["Python", "NumPy / SciPy", "Sparse assembly"],
    domain: "Numerical Mathematics",
    status: "public",
    glyph: "P₂",
    links: [
      {
        label: "Repository",
        href: "https://github.com/TrymSaether/finite-element-solver",
      },
    ],
  },
  {
    slug: "vamsc",
    title: "VAMSC",
    kicker: "Mixed-Signal Simulation · Systems Modeling",
    context: "Simulation prototype",
    blurb:
      "A C++ mixed-signal simulation prototype, framed around careful model representation and inspectable solver behavior.",
    longBlurb:
      "VAMSC is selected here as simulation software with a systems mindset. The work sits close to EDA-related modeling: how equations, components, state, and solver decisions are represented so the resulting tool remains testable and understandable.",
    impact:
      "Mixed-signal simulation lives between mathematical models and engineering constraints. The representation of the model determines how easily the software can be debugged, extended, and trusted.",
    stack: ["C++", "Simulation", "EDA-related modeling"],
    domain: "Scientific Computing",
    status: "private",
    glyph: "Σ",
  },
  {
    slug: "fordae",
    title: "ForDAE",
    kicker: "Differential-Algebraic Equations · Tooling",
    context: "Compiler-adjacent tooling",
    blurb:
      "Tools for DAE workflows, structured problem descriptions, and the bridge from equations to executable software.",
    longBlurb:
      "ForDAE is a tooling-oriented project around differential-algebraic equations. The core idea is to keep the mathematical structure of a problem visible while moving toward executable code and solver workflows.",
    impact:
      "DAE systems are easy to write and hard to run robustly. A structured workflow makes solver choices explicit and keeps the equation-level model close to the implementation.",
    stack: ["Fortran", "DAEs", "Structured descriptions"],
    domain: "Compiler / Programming Languages",
    status: "private",
    glyph: "λ",
  },
  {
    slug: "ocean-particle-transport",
    title: "Particle Transport with Ocean Currents",
    kicker: "Velocity Fields · Trajectories",
    context: "Public numerical experiment",
    blurb:
      "A simulation project for particle motion through ocean-current velocity fields, with trajectories used as a way to inspect the flow.",
    longBlurb:
      "This project explores particle transport in ocean-current data. The emphasis is on the practical details that appear when mathematical models meet physical fields: interpolation, time stepping, trajectory inspection, and visualization.",
    impact:
      "Particle advection is a compact way to see what a velocity field is doing. It turns raw current data into paths that can be checked visually and numerically.",
    stack: ["Jupyter Notebook", "Velocity fields", "Particle advection"],
    domain: "Graphics / Visualization",
    status: "public",
    glyph: "∿",
    links: [
      {
        label: "Repository",
        href: "https://github.com/TrymSaether/ocean-particle-transport",
      },
    ],
  },
  {
    slug: "notes-and-book",
    title: "Notes & Book",
    kicker: "Mathematical Communication · TeX",
    context: "Course notes and drafts",
    blurb:
      "A set of notes and book-style writing on numerical methods, finite elements, optimization, and mathematical communication.",
    longBlurb:
      "The notes collect derivations, examples, diagrams, and explanations for mathematical topics that benefit from careful structure. They treat communication as technical work in its own right, not as polish added after the fact.",
    impact:
      "The value is durability. Good notes turn local understanding into a reference that can be checked, shared, and extended without flattening the mathematics.",
    stack: ["TeX", "Numerical methods", "Technical writing"],
    domain: "Tools / Infrastructure",
    status: "writing",
    glyph: "§",
    links: [
      {
        label: "Numerical mathematics notes",
        href: "https://github.com/TrymSaether/numerical-mathematics-notes",
      },
      {
        label: "Finite element method notes",
        href: "https://github.com/TrymSaether/finite-element-method-notes",
      },
      {
        label: "Optimization notes",
        href: "https://github.com/TrymSaether/optimization-notes",
      },
    ],
  },
];
