// Invented product catalog for Halcyra Life Sciences.
// All products, specifications and part numbers are fictional.
// This file is the single source of truth that pages render from and that
// future agents (catalog search, quote assistant, spec comparison) can read.

export type Sector = "academic" | "government" | "healthcare" | "biopharma";

export type CategoryId =
  | "genomics"
  | "cell-analysis"
  | "imaging"
  | "chromatography-ms"
  | "automation"
  | "bioprocessing"
  | "sample-storage"
  | "diagnostics";

export interface Category {
  id: CategoryId;
  name: string;
  summary: string;
}

export interface Product {
  slug: string;
  sku: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  applications: string[];
  sectors: Sector[];
  status?: "new" | "featured";
  /** Indicative list price band, shown as a hint. Real pricing comes from a quote. */
  priceBand: "$" | "$$" | "$$$" | "$$$$";
  regulatory: string;
}

export const categories: Category[] = [
  {
    id: "genomics",
    name: "Genomics & Sequencing",
    summary: "Short and long-read sequencers, PCR and nucleic acid workflows.",
  },
  {
    id: "cell-analysis",
    name: "Cell Analysis",
    summary: "Flow cytometry, cell counting and single-cell profiling.",
  },
  {
    id: "imaging",
    name: "Imaging & Microscopy",
    summary: "Confocal, high-content and super-resolution imaging systems.",
  },
  {
    id: "chromatography-ms",
    name: "Chromatography & Mass Spec",
    summary: "UHPLC, LC-MS and proteomics platforms.",
  },
  {
    id: "automation",
    name: "Lab Automation",
    summary: "Liquid handlers, plate movers and scheduling software.",
  },
  {
    id: "bioprocessing",
    name: "Bioprocessing",
    summary: "Bioreactors, cell therapy manufacturing and purification.",
  },
  {
    id: "sample-storage",
    name: "Sample Prep & Cold Storage",
    summary: "Ultra-low freezers, biobanking and sample preparation.",
  },
  {
    id: "diagnostics",
    name: "Clinical Diagnostics",
    summary: "Molecular and immunoassay analyzers for hospital labs.",
  },
];

export const sectorLabels: Record<Sector, string> = {
  academic: "Academic & Research",
  government: "Government & Public Health",
  healthcare: "Hospitals & Health Systems",
  biopharma: "Biopharma",
};

export const products: Product[] = [
  // Genomics & Sequencing
  {
    slug: "helix-nx-sequencer",
    sku: "HLX-NX-2000",
    name: "Helix NX Sequencer",
    category: "genomics",
    tagline: "Benchtop high-throughput sequencing, up to 6 Tb per run.",
    description:
      "Helix NX brings population-scale sequencing to a single bench. Dual flow cells, onboard secondary analysis and patterned-array chemistry deliver whole genomes in under 24 hours, so core facilities can serve more investigators with fewer instruments.",
    features: [
      "Dual independent flow cells with mixed run modes",
      "Onboard FPGA secondary analysis (alignment, variant calling)",
      "Q40 accuracy on >85% of bases",
      "Room-temperature reagent cartridges",
    ],
    specs: {
      "Max output": "6 Tb per run",
      "Read length": "Up to 2 × 300 bp",
      "Run time": "13–44 hours",
      "Footprint": "92 × 76 × 68 cm",
      "Power": "200–240 V, 1.8 kW",
    },
    applications: ["Whole-genome sequencing", "Population genomics", "Transcriptomics", "Pathogen surveillance"],
    sectors: ["academic", "government", "biopharma"],
    status: "featured",
    priceBand: "$$$$",
    regulatory: "For Research Use Only. Not for use in diagnostic procedures.",
  },
  {
    slug: "helix-mini",
    sku: "HLX-MN-100",
    name: "Helix Mini",
    category: "genomics",
    tagline: "Compact sequencing for targeted panels and teaching labs.",
    description:
      "Helix Mini puts targeted and small-genome sequencing within reach of individual labs and teaching programs. Simple cartridge loading and guided workflows mean students and new staff can generate publication-quality data on day one.",
    features: [
      "Load-and-go integrated cartridges",
      "Guided touchscreen workflows",
      "Cloud or local analysis",
      "Course-ready curriculum kits",
    ],
    specs: {
      "Max output": "30 Gb per run",
      "Read length": "Up to 2 × 150 bp",
      "Run time": "8–24 hours",
      "Footprint": "45 × 48 × 52 cm",
      "Weight": "38 kg",
    },
    applications: ["Targeted panels", "Microbial genomics", "Teaching laboratories"],
    sectors: ["academic", "healthcare"],
    priceBand: "$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "thermaq-96-qpcr",
    sku: "TQ-96-RT",
    name: "ThermaQ 96 Real-Time PCR",
    category: "genomics",
    tagline: "Six-channel qPCR with gradient thermal control.",
    description:
      "ThermaQ 96 combines six optical channels with a 12-zone thermal gradient for rapid assay optimization. Built for public health labs that need validated, reproducible results at scale.",
    features: [
      "6 excitation / 6 emission channels",
      "12-zone gradient block",
      "21 CFR Part 11 audit-ready software",
      "LIMS integration via HL7 and REST",
    ],
    specs: {
      "Format": "96-well, 0.2 mL",
      "Ramp rate": "Up to 6 °C/s",
      "Temperature accuracy": "±0.1 °C",
      "Dynamic range": "10 logs",
    },
    applications: ["Gene expression", "Genotyping", "Pathogen detection", "Wastewater surveillance"],
    sectors: ["academic", "government", "healthcare"],
    priceBand: "$$",
    regulatory: "Research Use Only; IVD configuration available in select markets.",
  },
  {
    slug: "purex-32-extractor",
    sku: "PX-32-NA",
    name: "PureX 32 Nucleic Acid Extractor",
    category: "genomics",
    tagline: "Walk-away magnetic bead extraction for 32 samples.",
    description:
      "PureX 32 automates DNA and RNA purification from blood, tissue, swabs and environmental samples using magnetic bead chemistry. UV decontamination and HEPA airflow protect sensitive downstream assays.",
    features: [
      "1–32 samples per run in 20–45 minutes",
      "Built-in UV and HEPA contamination control",
      "Barcode sample tracking",
      "Open protocol editor",
    ],
    specs: {
      "Throughput": "1–32 samples",
      "Input volume": "50–1000 µL",
      "Elution volume": "30–200 µL",
      "Run time": "20–45 min",
    },
    applications: ["Clinical research", "Biobanking", "Outbreak response"],
    sectors: ["government", "healthcare", "academic"],
    priceBand: "$",
    regulatory: "For Research Use Only.",
  },

  // Cell Analysis
  {
    slug: "spectra-flow-x5",
    sku: "SFX-5L-40",
    name: "SpectraFlow X5 Cytometer",
    category: "cell-analysis",
    tagline: "Five-laser spectral flow cytometry with 40+ color panels.",
    description:
      "SpectraFlow X5 captures the full emission spectrum of every cell across five lasers, enabling 40-plus-color immunophenotyping with simple spectral unmixing. Designed for immunology cores and translational research groups.",
    features: [
      "Five lasers, 64 full-spectrum detectors",
      "Autofluorescence extraction",
      "Automated daily QC in under 10 minutes",
      "High-throughput plate loader option",
    ],
    specs: {
      "Lasers": "355, 405, 488, 561, 640 nm",
      "Detectors": "64 APD channels",
      "Event rate": "Up to 35,000 events/s",
      "Sample formats": "Tubes, 96- and 384-well plates",
    },
    applications: ["Immunophenotyping", "Cell therapy QC", "Vaccine research"],
    sectors: ["academic", "biopharma", "government"],
    status: "featured",
    priceBand: "$$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "cellcount-pro",
    sku: "CCP-200",
    name: "CellCount Pro",
    category: "cell-analysis",
    tagline: "Image-based cell counting and viability in 15 seconds.",
    description:
      "CellCount Pro uses dual-fluorescence imaging to deliver accurate counts and viability for primary cells, PBMCs and cell lines. Results sync automatically to your ELN.",
    features: [
      "Brightfield + dual fluorescence",
      "AO/PI and trypan blue protocols",
      "Disposable or reusable slides",
      "ELN export",
    ],
    specs: {
      "Count range": "5 × 10⁴ – 5 × 10⁷ cells/mL",
      "Cell size": "4–80 µm",
      "Time to result": "≤15 s",
    },
    applications: ["Cell culture", "Cell therapy", "Bioprocess monitoring"],
    sectors: ["academic", "biopharma", "healthcare"],
    priceBand: "$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "singulo-sc",
    sku: "SGL-SC-10",
    name: "Singulo Single-Cell Platform",
    category: "cell-analysis",
    tagline: "Partition up to 80,000 cells per run for multiomic profiling.",
    description:
      "Singulo encapsulates single cells in nanoliter droplets for paired RNA, ATAC and surface protein profiling. Its open chemistry works with leading library preparation kits.",
    features: [
      "Up to 8 samples, 80,000 cells per run",
      "Paired RNA + ATAC + protein",
      "Open, kit-agnostic chemistry",
      "Integrated analysis pipeline",
    ],
    specs: {
      "Cells per channel": "500–10,000",
      "Doublet rate": "<0.8% per 1,000 cells",
      "Run time": "12 minutes",
    },
    applications: ["Tumor microenvironment", "Developmental biology", "Immunology"],
    sectors: ["academic", "biopharma"],
    status: "new",
    priceBand: "$$$",
    regulatory: "For Research Use Only.",
  },

  // Imaging & Microscopy
  {
    slug: "lumen-cx-confocal",
    sku: "LMN-CX-9",
    name: "Lumen CX Confocal Microscope",
    category: "imaging",
    tagline: "Resonant-scanning confocal with AI-assisted denoising.",
    description:
      "Lumen CX combines resonant scanning at 30 frames per second with hybrid detectors and on-device denoising to capture fast live-cell dynamics at low light dose.",
    features: [
      "Resonant scanner up to 30 fps at 512 × 512",
      "Five hybrid GaAsP detectors",
      "Onboard deep-learning denoising",
      "Environmental chamber for live cells",
    ],
    specs: {
      "Lasers": "405, 445, 488, 514, 561, 594, 640 nm",
      "Max resolution": "8192 × 8192",
      "Z-drive precision": "10 nm",
    },
    applications: ["Live-cell imaging", "Neuroscience", "Developmental biology"],
    sectors: ["academic", "biopharma"],
    status: "featured",
    priceBand: "$$$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "lumen-hcs",
    sku: "LMN-HCS-4",
    name: "Lumen HCS High-Content Screener",
    category: "imaging",
    tagline: "Automated confocal screening for 1536-well plates.",
    description:
      "Lumen HCS images a full 384-well plate in under 6 minutes with spinning-disk confocal optics and water-immersion objectives, feeding quantitative phenotypes straight into your screening database.",
    features: [
      "Spinning-disk confocal and widefield modes",
      "Automated water-immersion objectives",
      "Robot-ready plate handling",
      "Phenotype analysis library",
    ],
    specs: {
      "Plate formats": "6 to 1536 wells",
      "Throughput": "384-well plate in <6 min",
      "Channels": "Up to 8",
    },
    applications: ["Phenotypic screening", "Toxicology", "Organoid imaging"],
    sectors: ["biopharma", "academic", "government"],
    priceBand: "$$$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "nanovista-sr",
    sku: "NVS-SR-1",
    name: "NanoVista Super-Resolution",
    category: "imaging",
    tagline: "20 nm localization microscopy on an open platform.",
    description:
      "NanoVista brings single-molecule localization and structured illumination to one instrument, revealing nanoscale architecture in fixed and live samples.",
    features: [
      "SMLM and SIM in one system",
      "Active drift correction",
      "TIRF and HiLo illumination",
    ],
    specs: {
      "Lateral resolution": "~20 nm (SMLM), ~110 nm (SIM)",
      "Field of view": "100 × 100 µm",
      "Camera": "Back-illuminated sCMOS, 95% QE",
    },
    applications: ["Synaptic biology", "Virology", "Structural cell biology"],
    sectors: ["academic", "government"],
    status: "new",
    priceBand: "$$$$",
    regulatory: "For Research Use Only.",
  },

  // Chromatography & Mass Spec
  {
    slug: "vantor-uhplc",
    sku: "VTR-UH-1300",
    name: "Vantor UHPLC System",
    category: "chromatography-ms",
    tagline: "1300 bar UHPLC with biocompatible flow path.",
    description:
      "Vantor delivers robust high-pressure separations with an iron-free flow path, making it equally suited for small molecules and biotherapeutics. Modular design scales from method development to QC.",
    features: [
      "1300 bar pressure rating",
      "Biocompatible titanium flow path",
      "Dual-temperature column compartment",
      "Diode array and fluorescence detectors",
    ],
    specs: {
      "Pressure": "Up to 1300 bar",
      "Flow range": "0.001–5 mL/min",
      "Injection precision": "<0.15% RSD",
    },
    applications: ["Pharmaceutical QC", "Biologics characterization", "Environmental analysis"],
    sectors: ["biopharma", "government", "academic"],
    priceBand: "$$",
    regulatory: "Compliance-ready software, 21 CFR Part 11.",
  },
  {
    slug: "orion-qtof-ms",
    sku: "ORN-QT-8",
    name: "Orion Q-TOF Mass Spectrometer",
    category: "chromatography-ms",
    tagline: "High-resolution accurate-mass proteomics and metabolomics.",
    description:
      "Orion pairs ion mobility separation with a high-resolution time-of-flight analyzer to quantify thousands of proteins per hour, with sensitivity tuned for low-input and single-cell proteomics.",
    features: [
      "Trapped ion mobility (TIMS) front end",
      "Resolution >60,000 FWHM",
      "Data-independent acquisition workflows",
      "Nanoflow and microflow sources",
    ],
    specs: {
      "Mass range": "20–40,000 m/z",
      "Mass accuracy": "<1 ppm",
      "Acquisition rate": "Up to 120 Hz",
    },
    applications: ["Proteomics", "Metabolomics", "Biomarker discovery"],
    sectors: ["academic", "biopharma", "healthcare"],
    status: "featured",
    priceBand: "$$$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "orion-tq",
    sku: "ORN-TQ-6",
    name: "Orion TQ Triple Quadrupole",
    category: "chromatography-ms",
    tagline: "Targeted quantitation for clinical research and toxicology.",
    description:
      "Orion TQ provides femtogram sensitivity with rugged source design for high-throughput targeted assays such as therapeutic drug monitoring, newborn screening research and forensic toxicology.",
    features: [
      "Up to 600 MRM transitions per second",
      "Self-cleaning ion source",
      "Clinical research software suite",
    ],
    specs: {
      "Mass range": "5–2,000 m/z",
      "Polarity switching": "5 ms",
      "Linear dynamic range": "6 orders",
    },
    applications: ["Toxicology", "Therapeutic drug monitoring", "Food safety"],
    sectors: ["government", "healthcare"],
    priceBand: "$$$",
    regulatory: "Research Use Only; IVD version pending.",
  },

  // Lab Automation
  {
    slug: "atlas-liquid-handler",
    sku: "ATL-LH-8",
    name: "Atlas Liquid Handler",
    category: "automation",
    tagline: "8- and 96-channel pipetting on one deck.",
    description:
      "Atlas combines independent 8-channel and 96-channel heads with a gripper on a 40-position deck, automating NGS library prep, ELISA and compound management with sub-microliter precision.",
    features: [
      "Independent 8- and 96-channel heads",
      "0.5 µL to 1 mL pipetting",
      "Integrated gripper and barcode reading",
      "Visual protocol designer",
    ],
    specs: {
      "Deck positions": "40 SBS",
      "Precision": "<2% CV at 1 µL",
      "Footprint": "130 × 78 cm",
    },
    applications: ["NGS library prep", "Assay setup", "Compound management"],
    sectors: ["academic", "biopharma", "government"],
    status: "featured",
    priceBand: "$$$",
    regulatory: "For Research Use Only.",
  },
  {
    slug: "atlas-orchestrate",
    sku: "ATL-ORC-SW",
    name: "Atlas Orchestrate Scheduler",
    category: "automation",
    tagline: "Scheduling software that runs your whole lab as one system.",
    description:
      "Orchestrate connects instruments from Halcyra and third-party vendors into scheduled, error-recovering workflows, with an open API for LIMS, ELN and AI agent integration.",
    features: [
      "Drag-and-drop workflow builder",
      "Dynamic scheduling with error recovery",
      "Open REST and SiLA 2 interfaces",
      "Remote monitoring dashboard",
    ],
    specs: {
      "Deployment": "On-premise or cloud",
      "Integrations": "SiLA 2, REST, OPC UA",
      "Licensing": "Per workcell",
    },
    applications: ["Workcell scheduling", "Lab digitalization", "Remote operation"],
    sectors: ["academic", "biopharma", "government", "healthcare"],
    status: "new",
    priceBand: "$$",
    regulatory: "Software, not a medical device.",
  },
  {
    slug: "shuttle-plate-mover",
    sku: "SHT-PM-2",
    name: "Shuttle Collaborative Plate Mover",
    category: "automation",
    tagline: "A cobot arm that moves plates safely alongside people.",
    description:
      "Shuttle is a collaborative robot that transfers microplates between instruments with force sensing and vision-guided teaching, no safety enclosure required.",
    features: ["Force-limited collaborative arm", "Vision-guided teaching", "Mobile cart option"],
    specs: { "Reach": "850 mm", "Payload": "3 kg", "Repeatability": "±0.03 mm" },
    applications: ["Workcell integration", "Overnight runs"],
    sectors: ["academic", "biopharma"],
    priceBand: "$$",
    regulatory: "ISO 10218 and ISO/TS 15066 compliant.",
  },

  // Bioprocessing
  {
    slug: "cultivar-sub-200",
    sku: "CLT-SUB-200",
    name: "Cultivar SUB Bioreactor",
    category: "bioprocessing",
    tagline: "Single-use bioreactors from 50 L to 2,000 L.",
    description:
      "Cultivar single-use bioreactors scale seamlessly from process development to GMP manufacturing with matched geometry, integrated sensors and digital twin modeling.",
    features: [
      "Matched geometry from 50 L to 2,000 L",
      "Integrated pH, DO and Raman probes",
      "Digital twin scale-up modeling",
      "Closed, gamma-irradiated bags",
    ],
    specs: {
      "Working volume": "50–2,000 L",
      "Turndown": "5:1",
      "Agitation": "Up to 300 rpm",
    },
    applications: ["Monoclonal antibodies", "Vaccines", "Viral vectors"],
    sectors: ["biopharma", "government"],
    status: "featured",
    priceBand: "$$$$",
    regulatory: "Designed for cGMP environments.",
  },
  {
    slug: "cellforge-ct",
    sku: "CFG-CT-1",
    name: "CellForge Cell Therapy System",
    category: "bioprocessing",
    tagline: "Closed, automated CAR-T manufacturing at the point of care.",
    description:
      "CellForge automates cell isolation, activation, transduction, expansion and formulation in a single closed cartridge, enabling hospital-based cell therapy programs to manufacture in under 7 days.",
    features: [
      "End-to-end closed processing",
      "Single-use cartridges",
      "Electronic batch records",
      "Designed for hospital cleanrooms",
    ],
    specs: { "Batch size": "Up to 1 × 10¹⁰ cells", "Process time": "5–7 days", "Cleanroom grade": "Grade C" },
    applications: ["CAR-T", "TIL therapy", "Clinical trials"],
    sectors: ["healthcare", "biopharma", "academic"],
    status: "new",
    priceBand: "$$$$",
    regulatory: "Designed for cGMP; regulatory filings sponsor-specific.",
  },
  {
    slug: "purifi-akt",
    sku: "PRF-AKT-150",
    name: "Purifi Chromatography System",
    category: "bioprocessing",
    tagline: "Protein purification from milligram to gram scale.",
    description:
      "Purifi automates affinity, ion-exchange and size-exclusion purification with intelligent method templates and in-line UV, conductivity and pH monitoring.",
    features: ["Method templates library", "Up to 7 columns in series", "In-line monitoring"],
    specs: { "Flow rate": "0.01–150 mL/min", "Pressure": "Up to 20 MPa" },
    applications: ["Protein purification", "Process development"],
    sectors: ["academic", "biopharma"],
    priceBand: "$$",
    regulatory: "For Research Use Only.",
  },

  // Sample Prep & Cold Storage
  {
    slug: "cryovault-ult",
    sku: "CRV-ULT-86",
    name: "CryoVault −86 °C Freezer",
    category: "sample-storage",
    tagline: "Energy-efficient ultra-low freezer with remote monitoring.",
    description:
      "CryoVault uses natural hydrocarbon refrigerants and variable-speed compressors to cut energy use by up to 45% while holding −80 °C with tight uniformity. Cloud alarms keep teams informed 24/7.",
    features: [
      "Up to 45% lower energy use",
      "Natural refrigerants (R170/R290)",
      "Cloud temperature monitoring and alerts",
      "Badge-access door",
    ],
    specs: {
      "Capacity": "600 or 800 L (up to 600 two-inch boxes)",
      "Temperature range": "−50 to −86 °C",
      "Energy": "7.9 kWh/day at −80 °C",
    },
    applications: ["Biobanking", "Vaccine storage", "Reagent storage"],
    sectors: ["academic", "government", "healthcare", "biopharma"],
    priceBand: "$",
    regulatory: "ENERGY STAR certified (fictional certification for demo).",
  },
  {
    slug: "biobank-ax",
    sku: "BBK-AX-1M",
    name: "BioBank AX Automated Store",
    category: "sample-storage",
    tagline: "Automated −80 °C storage for up to one million tubes.",
    description:
      "BioBank AX automates sample storage and retrieval at −80 °C with full chain-of-custody tracking, ideal for population cohorts, public health repositories and hospital biobanks.",
    features: ["Cherry-picking at −20 °C", "Full audit trail", "Modular capacity expansion"],
    specs: { "Capacity": "Up to 1,000,000 tubes", "Retrieval": "Up to 400 tubes/hour" },
    applications: ["Population cohorts", "Clinical trial samples", "Public health repositories"],
    sectors: ["government", "healthcare", "academic"],
    priceBand: "$$$$",
    regulatory: "21 CFR Part 11-ready software.",
  },

  // Clinical Diagnostics
  {
    slug: "veritas-mdx",
    sku: "VRT-MDX-48",
    name: "Veritas MDx Molecular Analyzer",
    category: "diagnostics",
    tagline: "Sample-to-answer molecular testing in 45 minutes.",
    description:
      "Veritas MDx runs syndromic respiratory, GI and sepsis panels with random access and minimal hands-on time, helping hospital labs deliver faster results to clinicians.",
    features: [
      "Random-access, 48 modules",
      "Sample-to-answer in 45 minutes",
      "Bidirectional LIS connectivity",
      "Syndromic panel menu",
    ],
    specs: { "Throughput": "Up to 96 tests per 8-hour shift", "Hands-on time": "<2 minutes" },
    applications: ["Respiratory panels", "Sepsis", "Antimicrobial resistance"],
    sectors: ["healthcare", "government"],
    status: "featured",
    priceBand: "$$$",
    regulatory: "Fictional demo product. Not cleared for clinical use.",
  },
  {
    slug: "immunix-ia",
    sku: "IMX-IA-300",
    name: "Immunix 300 Immunoassay Analyzer",
    category: "diagnostics",
    tagline: "High-throughput chemiluminescent immunoassays.",
    description:
      "Immunix 300 delivers 300 tests per hour across cardiac, infectious disease and endocrine menus with continuous loading and onboard reagent cooling.",
    features: ["300 tests/hour", "Continuous loading", "Broad assay menu"],
    specs: { "Throughput": "300 tests/hour", "Onboard reagents": "40 positions, cooled" },
    applications: ["Cardiac markers", "Infectious disease serology", "Endocrinology"],
    sectors: ["healthcare"],
    priceBand: "$$$",
    regulatory: "Fictional demo product. Not cleared for clinical use.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

export function productsBySector(sector: Sector): Product[] {
  return products.filter((p) => p.sectors.includes(sector));
}
