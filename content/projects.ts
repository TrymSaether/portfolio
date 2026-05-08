export interface Project {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  blurb: string;
  longBlurb: string;
  stack: string[];
  domain: "Numerical" | "Simulation" | "Tooling" | "Research" | "Visualization";
  status: "shipped" | "research" | "ongoing";
  glyph: string;
}

export const projects: Project[] = [
  {
    slug: "spectral-pde-solver",
    title: "Spectral PDE Solver",
    kicker: "Differential Operators · Chebyshev Bases",
    year: "2025",
    blurb: "A pseudo-spectral solver for nonlinear PDEs on bounded domains with adaptive time stepping.",
    longBlurb:
      "Built to study reaction–diffusion fronts and Burgers turbulence. Chebyshev collocation in space, IMEX-BDF in time, with a small DSL for declaring operators that the runtime compiles into vectorized kernels.",
    stack: ["Julia", "CUDA.jl", "MakieGL"],
    domain: "Numerical",
    status: "ongoing",
    glyph: "∂",
  },
  {
    slug: "fem-elastica",
    title: "FEM Elastica",
    kicker: "Finite Elements · Nonlinear Beams",
    year: "2024",
    blurb: "A research-grade nonlinear beam solver with arc-length continuation and a browser viewer.",
    longBlurb:
      "Geometrically exact Cosserat rod model, condensed into a sparse Newton solve. Ships with a WebGL viewer that streams frames over WebSockets so you can watch a buckling cascade in real time.",
    stack: ["Rust", "WASM", "WebGL2"],
    domain: "Simulation",
    status: "shipped",
    glyph: "∫",
  },
  {
    slug: "topo-atlas",
    title: "Topographic Atlas",
    kicker: "Cartography · Heightfields",
    year: "2024",
    blurb: "A small library for turning DEM tiles into stylized contour atlases with editorial typography.",
    longBlurb:
      "Pulls SRTM tiles, smooths with a bilateral filter, extracts iso-contours via marching squares, then renders to SVG with a typography pipeline tuned for printed atlases. Used to make the gift maps on this site.",
    stack: ["TypeScript", "GDAL", "Satori"],
    domain: "Tooling",
    status: "shipped",
    glyph: "≋",
  },
  {
    slug: "wavefront-sandbox",
    title: "Wavefront Sandbox",
    kicker: "Acoustics · Visualization",
    year: "2023",
    blurb: "Interactive 2D acoustic wave simulator that runs entirely in the browser at 60 fps.",
    longBlurb:
      "FDTD on a staggered grid with PML boundaries, compiled to a WebGPU compute shader. Doubles as a teaching tool — drag obstacles, paint sources, watch dispersion misbehave.",
    stack: ["WebGPU", "WGSL", "React"],
    domain: "Visualization",
    status: "shipped",
    glyph: "∿",
  },
  {
    slug: "lattice-mosaic",
    title: "Lattice Mosaic",
    kicker: "Discrete Geometry · Generative Art",
    year: "2023",
    blurb: "A generator for aperiodic tilings and quasicrystal projections, exported as plotter-ready paths.",
    longBlurb:
      "Cut-and-project method on lattices up to dimension 6, with a small UI for choosing window shapes. Outputs SVG or HPGL for an Axidraw — the prints in the personal section come from this.",
    stack: ["Python", "NumPy", "JAX"],
    domain: "Research",
    status: "ongoing",
    glyph: "✶",
  },
  {
    slug: "field-notes",
    title: "Field Notes Engine",
    kicker: "Writing · MDX",
    year: "2025",
    blurb: "The custom MDX pipeline that powers the notes section of this site, with KaTeX, citations, and figure captions.",
    longBlurb:
      "Built because no off-the-shelf static-site generator handled inline TikZ-style diagrams, two-column figures, and proper math hyphenation. Shiki for code, KaTeX for math, a small remark plugin for marginalia.",
    stack: ["Next.js", "MDX", "KaTeX"],
    domain: "Tooling",
    status: "shipped",
    glyph: "§",
  },
];
