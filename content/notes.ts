export interface Note {
  slug: string;
  title: string;
  date: string;
  reading: string;
  kicker: string;
  excerpt: string;
  tags: string[];
  status: "draft" | "published" | "chapter";
}

export const notes: Note[] = [
  {
    slug: "why-implicit-methods-feel-magic",
    title: "Why implicit methods feel like magic",
    date: "2026-03-04",
    reading: "9 min",
    kicker: "Numerical · Time integration",
    excerpt:
      "An explicit scheme tells you where to step next. An implicit scheme asks you to commit to a place that's consistent with itself. The first feels like dead reckoning; the second like landing softly.",
    tags: ["PDEs", "stability"],
    status: "published",
  },
  {
    slug: "the-grammar-of-finite-elements",
    title: "The grammar of finite elements",
    date: "2026-01-21",
    reading: "14 min",
    kicker: "FEM · Pedagogy",
    excerpt:
      "Most FEM books teach you a vocabulary — basis, mass matrix, weak form. Few teach the grammar: which sentences these words can form together, and why some are nonsense.",
    tags: ["FEM", "writing"],
    status: "chapter",
  },
  {
    slug: "what-i-learned-from-rewriting-a-solver",
    title: "What I learned from rewriting a solver in Rust",
    date: "2025-11-09",
    reading: "11 min",
    kicker: "Engineering · Rust",
    excerpt:
      "Three months and a great deal of pride later, the solver was 4× faster, the code was half the size, and I had a much sharper sense of what numerical software actually wants.",
    tags: ["rust", "engineering"],
    status: "published",
  },
  {
    slug: "the-shape-of-a-good-error-bound",
    title: "The shape of a good error bound",
    date: "2025-08-30",
    reading: "7 min",
    kicker: "Analysis · Notation",
    excerpt:
      "An error bound that depends on twelve constants is rarely useful. The good ones look like this: a small expression that says where the error lives, and a one-line story for why.",
    tags: ["analysis"],
    status: "published",
  },
  {
    slug: "field-notes-from-a-cabin",
    title: "Field notes from a cabin without internet",
    date: "2025-06-12",
    reading: "5 min",
    kicker: "Personal · Practice",
    excerpt:
      "Eight days, one notebook, no derivatives that converged the first time. A small case for working slowly.",
    tags: ["writing", "practice"],
    status: "published",
  },
];
