export interface Note {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  notation: string;
  tags: string[];
  status: "topic" | "draft" | "chapter";
  repository?: string;
}

export const notes: Note[] = [
  {
    slug: "numerical-methods",
    title: "Numerical methods",
    kicker: "Algorithms · Stability · Approximation",
    excerpt:
      "Notes on algorithms, stability, approximation, and the behavior of computation when the mathematical model becomes executable.",
    notation: "x_{n+1}=x_n+h f(x_n)",
    tags: ["numerics", "stability"],
    status: "topic",
    repository: "https://github.com/TrymSaether/numerical-mathematics-notes",
  },
  {
    slug: "finite-elements",
    title: "Finite elements",
    kicker: "Weak Forms · Meshes · Refinement",
    excerpt:
      "Material on weak forms, meshes, basis functions, refinement, and the route from geometry to sparse linear systems.",
    notation: "a(u,v)=L(v)",
    tags: ["FEM", "solvers"],
    status: "topic",
    repository: "https://github.com/TrymSaether/finite-element-method-notes",
  },
  {
    slug: "optimization",
    title: "Optimization",
    kicker: "Constraints · Search Directions",
    excerpt:
      "First-order thinking, constraints, search directions, and the structure that makes optimization methods useful in practice.",
    notation: "\\nabla f(x)=0",
    tags: ["optimization"],
    status: "topic",
    repository: "https://github.com/TrymSaether/optimization-notes",
  },
  {
    slug: "scientific-computing",
    title: "Scientific computing",
    kicker: "Models · Experiments · Inspection",
    excerpt:
      "Readable computational experiments and software patterns that make models easier to test, inspect, and explain.",
    notation: "A x=b",
    tags: ["experiments", "software"],
    status: "topic",
  },
  {
    slug: "stochastic-modeling",
    title: "Stochastic modeling",
    kicker: "Uncertainty · Random Processes",
    excerpt:
      "Notes on uncertainty, random processes, and the way probabilistic structure changes modeling decisions.",
    notation: "dX_t=\\mu dt+\\sigma dW_t",
    tags: ["stochastic", "modeling"],
    status: "topic",
    repository: "https://github.com/TrymSaether/stochastic-modeling-notes",
  },
  {
    slug: "linear-algebra",
    title: "Linear algebra",
    kicker: "Solvers · Projections · Decompositions",
    excerpt:
      "The language behind numerical solvers: projections, decompositions, conditioning, and linear structure.",
    notation: "V=Q R",
    tags: ["linear algebra", "solvers"],
    status: "topic",
    repository: "https://github.com/TrymSaether/numerical-linear-algebra-notes",
  },
  {
    slug: "mathematical-communication",
    title: "Mathematical communication",
    kicker: "Rigor · Notation · Explanation",
    excerpt:
      "Writing that preserves rigor while making the central idea easier to carry into code, diagrams, and team discussions.",
    notation: "\\therefore",
    tags: ["writing", "communication"],
    status: "draft",
  },
];
