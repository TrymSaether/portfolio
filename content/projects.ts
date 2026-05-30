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

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const projects: Project[] = [
  {
    slug: "math-atlas",
    title: "Math Atlas",
    kicker: "Topology Map · Mathematical Reference",
    context: "Public project site",
    blurb:
      "A browsable topology atlas that organizes definitions, theorems, examples, and dependency structure as a static project site.",
    longBlurb:
      "Math Atlas is a project site for mathematical navigation: topology content represented as connected nodes, with statements, explanations, examples, and dependencies arranged so the structure can be inspected directly.",
    impact:
      "The site turns mathematical notes into an explorable reference. It is prepared as a GitHub Pages project under the portfolio domain, so it can live at /math-atlas/ beside the main site.",
    stack: ["Next.js", "Topology", "Static export", "GitHub Pages"],
    domain: "Numerical Mathematics",
    status: "public",
    glyph: "△",
    links: [
      {
        label: "Project site",
        href: "/math-atlas/",
      },
      {
        label: "Repository",
        href: "https://github.com/TrymSaether/math-atlas",
      },
    ],
  },
  {
    slug: "vamsc",
    title: "VAMSC",
    kicker: "Mixed-Signal Simulation · Systems Modeling",
    context: "Simulation prototype",
    blurb:
      "A C++ mixed-signal simulation project focused on model representation, solver structure, and inspectable system behavior.",
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
    slug: "svm-classifier",
    title: "SVM Classifier",
    kicker: "Support Vector Machines · Classification",
    context: "Public machine-learning project",
    blurb:
      "A compact classifier project for support-vector-machine experiments, decision boundaries, and model behavior checks.",
    longBlurb:
      "The SVM classifier project treats classification as a numerical and geometric problem. It focuses on how margin-based models separate data, how parameters change the resulting decision boundary, and how the implementation can make those choices inspectable.",
    impact:
      "The useful part is the feedback loop: train a model, inspect the boundary, adjust the formulation, and keep the connection between optimization problem and classifier behavior visible.",
    stack: ["Python", "Support vector machines", "Classification"],
    domain: "Scientific Computing",
    status: "public",
    glyph: "∥",
    links: [
      {
        label: "Repository",
        href: "https://github.com/TrymSaether/svm-classifier",
      },
    ],
  },
  {
    slug: "optflow",
    title: "Optflow",
    kicker: "Optical Flow · Numerical Linear Algebra",
    context: "Private NLA project",
    blurb:
      "An optical-flow project with numerical solvers and benchmarks for motion estimation in image sequences.",
    longBlurb:
      "Optflow connects image motion estimation with numerical linear algebra. The project centers on solver choices, benchmark structure, and the practical behavior of optical-flow formulations when they are implemented and compared.",
    impact:
      "Optical flow is a useful pressure test for numerical methods because the output is both visual and quantitative. Solver mistakes show up as artifacts, unstable motion fields, or poor benchmark behavior.",
    stack: ["Optical flow", "Numerical linear algebra", "Benchmarks"],
    domain: "Graphics / Visualization",
    status: "private",
    glyph: "∇",
  },
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
    slug: "numerical-image-processing",
    title: "Numerical Image Processing",
    kicker: "Image Processing · Numerical Methods",
    context: "Public image-processing project",
    blurb:
      "A numerical image-processing project for filtering, transformations, and algorithmic inspection of image data.",
    longBlurb:
      "Numerical Image Processing collects image operations as numerical algorithms rather than opaque effects. The project emphasizes the link between arrays, operators, transformations, and the visual changes they produce.",
    impact:
      "Image-processing code is easiest to trust when the numerical operation and the visible result can be inspected together. This project keeps that relationship explicit.",
    stack: ["Python", "Image processing", "Numerical algorithms"],
    domain: "Graphics / Visualization",
    status: "public",
    glyph: "□",
    links: [
      {
        label: "Repository",
        href: "https://github.com/TrymSaether/numerical-image-processing",
      },
    ],
  },
];
