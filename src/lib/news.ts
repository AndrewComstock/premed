// Fictional press releases and stories.
export interface NewsItem {
  slug: string;
  date: string;
  type: "Press release" | "Story" | "Event";
  title: string;
  summary: string;
}

export const news: NewsItem[] = [
  {
    slug: "cellforge-hospital-network",
    date: "2026-09-18",
    type: "Press release",
    title: "Halcyra and Northbridge Health Network bring CAR-T manufacturing on site at 12 hospitals",
    summary:
      "The CellForge Cell Therapy System will let participating hospitals manufacture autologous cell therapies locally, cutting vein-to-vein time.",
  },
  {
    slug: "public-health-genomics-grant",
    date: "2026-08-27",
    type: "Press release",
    title: "Halcyra selected to equip a national pathogen genomics network",
    summary:
      "A multi-year agreement will place Helix NX sequencers and PureX extractors in 40 public health laboratories for outbreak surveillance.",
  },
  {
    slug: "university-core-partnership",
    date: "2026-07-14",
    type: "Story",
    title: "How a university core facility doubled throughput without adding staff",
    summary:
      "Pairing Atlas liquid handlers with Orchestrate scheduling let the Westbrook University Genomics Core run around the clock.",
  },
  {
    slug: "cryovault-sustainability",
    date: "2026-06-05",
    type: "Story",
    title: "Cold storage, lower carbon: inside the CryoVault redesign",
    summary:
      "Natural refrigerants and variable-speed compressors cut ULT freezer energy use by up to 45 percent.",
  },
  {
    slug: "halcyra-summit-2026",
    date: "2026-11-09",
    type: "Event",
    title: "Halcyra Discovery Summit 2026: registration open",
    summary: "Three days of workshops on spatial biology, lab automation and AI in the laboratory. Boston and online.",
  },
  {
    slug: "singulo-launch",
    date: "2026-05-20",
    type: "Press release",
    title: "Halcyra launches Singulo for paired single-cell multiomics",
    summary: "Singulo profiles RNA, chromatin accessibility and surface proteins from up to 80,000 cells per run.",
  },
];

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
