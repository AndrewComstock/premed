// Invented customer portal data for Halcyra Life Sciences.
// Every institution, person, order, price and tracking number here is fictional.
// The portal is a static demo: sign-in is a client-side mock and this file is the
// "backend". Instruments reference real catalog entries in src/lib/products.ts by slug,
// so future agents can join portal data with product specifications.

import type { Sector } from "./products";

/** Demo password shared by every demo user. Shown on the sign-in page. */
export const DEMO_PASSWORD = "halcyra-demo";

/** "Today" for the demo, so dates in the sample data stay consistent. */
export const PORTAL_TODAY = "2026-10-04";

export type PortalRole = "admin" | "purchasing" | "lab-manager" | "clinician" | "researcher";

export interface PortalUser {
  id: string;
  name: string;
  title: string;
  email: string;
  role: PortalRole;
  department: string;
}

export type OrderStatus = "Processing" | "Partially shipped" | "Shipped" | "Delivered" | "Backordered";

export interface OrderLine {
  sku: string;
  description: string;
  /** Set when the line is a catalog instrument, so it links to /products/[slug]. */
  productSlug?: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  po: string;
  placed: string;
  placedBy: string;
  status: OrderStatus;
  lines: OrderLine[];
  shipments: string[];
}

export type InstrumentStatus = "Operational" | "Service due" | "Down for service";

export interface InstalledInstrument {
  productSlug: string;
  serial: string;
  location: string;
  installed: string;
  servicePlan: string;
  warrantyEnds: string;
  nextService: string;
  status: InstrumentStatus;
}

export interface ConsumableStock {
  sku: string;
  name: string;
  /** Instrument the consumable runs on. */
  productSlug: string;
  unit: string;
  onHand: number;
  reorderPoint: number;
  lot: string;
  expires: string;
  standingOrder: boolean;
}

export type ShipmentStatus = "Label created" | "In transit" | "Out for delivery" | "Delivered" | "Delayed";

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  tracking: string;
  status: ShipmentStatus;
  shipped?: string;
  eta: string;
  contents: string;
  coldChain: boolean;
  events: { date: string; location: string; detail: string }[];
}

export interface Promotion {
  id: string;
  title: string;
  summary: string;
  offer: string;
  code: string;
  ends: string;
  /** Sectors the promotion is offered to. */
  sectors: Sector[];
  productSlugs: string[];
  /** Negotiated pricing that applies to one account only. */
  accountId?: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  shortName: string;
  sector: Sector;
  accountNumber: string;
  city: string;
  contract: string;
  accountManager: { name: string; email: string; phone: string };
  users: PortalUser[];
  orders: Order[];
  instruments: InstalledInstrument[];
  consumables: ConsumableStock[];
  shipments: Shipment[];
}

export const accounts: CustomerAccount[] = [
  {
    id: "st-aldric",
    name: "St. Aldric University Medical Center",
    shortName: "St. Aldric Medical",
    sector: "healthcare",
    accountNumber: "HC-204871",
    city: "Columbus, OH",
    contract: "Group purchasing agreement GPO-7731 (through Jun 2028)",
    accountManager: { name: "Marisol Ortega", email: "m.ortega@halcyra.example", phone: "+1 (800) 555-0167" },
    users: [
      {
        id: "u-raman",
        name: "Dr. Priya Raman",
        title: "Director, Clinical Laboratories",
        email: "priya.raman@staldric.example",
        role: "admin",
        department: "Pathology & Laboratory Medicine",
      },
      {
        id: "u-okafor",
        name: "Nurse Daniel Okafor, RN",
        title: "Charge Nurse, Emergency Department",
        email: "daniel.okafor@staldric.example",
        role: "clinician",
        department: "Emergency Medicine",
      },
      {
        id: "u-feld",
        name: "Dr. Hannah Feld",
        title: "Infectious Disease Physician",
        email: "hannah.feld@staldric.example",
        role: "clinician",
        department: "Infectious Disease",
      },
      {
        id: "u-brooks",
        name: "Terrence Brooks",
        title: "Supply Chain Buyer",
        email: "terrence.brooks@staldric.example",
        role: "purchasing",
        department: "Supply Chain",
      },
    ],
    orders: [
      {
        id: "SO-1048832",
        po: "PO-SA-55190",
        placed: "2026-09-29",
        placedBy: "Terrence Brooks",
        status: "Shipped",
        shipments: ["SHP-77310"],
        lines: [
          { sku: "VRT-RP-24", description: "Veritas Respiratory Panel cartridges (24/box)", qty: 12, unitPrice: 2160 },
          { sku: "VRT-BC-24", description: "Veritas Blood Culture ID cartridges (24/box)", qty: 6, unitPrice: 2880 },
        ],
      },
      {
        id: "SO-1048617",
        po: "PO-SA-55102",
        placed: "2026-09-22",
        placedBy: "Dr. Priya Raman",
        status: "Partially shipped",
        shipments: ["SHP-77204", "SHP-77266"],
        lines: [
          { sku: "IMX-TN-200", description: "Immunix hs-Troponin I reagent pack (200 tests)", qty: 10, unitPrice: 1450 },
          { sku: "IMX-CAL-TN", description: "Immunix Troponin calibrator set", qty: 2, unitPrice: 310 },
          { sku: "IMX-CUV-1K", description: "Immunix reaction cuvettes (1,000/case)", qty: 8, unitPrice: 195 },
        ],
      },
      {
        id: "SO-1047990",
        po: "PO-SA-54877",
        placed: "2026-09-08",
        placedBy: "Dr. Priya Raman",
        status: "Delivered",
        shipments: ["SHP-76921"],
        lines: [
          { sku: "CRV-ULT-86", description: "CryoVault −86 °C Freezer, 700 L", productSlug: "cryovault-ult", qty: 1, unitPrice: 18900 },
          { sku: "SVC-INST-STD", description: "Standard installation & qualification", qty: 1, unitPrice: 1200 },
        ],
      },
      {
        id: "SO-1047412",
        po: "PO-SA-54630",
        placed: "2026-08-18",
        placedBy: "Terrence Brooks",
        status: "Delivered",
        shipments: ["SHP-76488"],
        lines: [
          { sku: "PX-KIT-VR", description: "PureX viral RNA extraction kit (96 preps)", qty: 20, unitPrice: 540 },
          { sku: "TQ-MM-500", description: "ThermaQ one-step RT-qPCR master mix (500 rxn)", qty: 10, unitPrice: 690 },
        ],
      },
    ],
    instruments: [
      {
        productSlug: "veritas-mdx",
        serial: "VMX-24-01733",
        location: "Core Lab, Room B214",
        installed: "2024-03-11",
        servicePlan: "Clinical Assure (4-hour response)",
        warrantyEnds: "2027-03-11",
        nextService: "2026-11-02",
        status: "Operational",
      },
      {
        productSlug: "immunix-ia",
        serial: "IMX-23-00419",
        location: "Core Lab, Room B210",
        installed: "2023-07-24",
        servicePlan: "Clinical Assure (4-hour response)",
        warrantyEnds: "2026-07-24",
        nextService: "2026-10-09",
        status: "Service due",
      },
      {
        productSlug: "purex-32-extractor",
        serial: "PX32-22-05561",
        location: "Molecular Lab, Room B118",
        installed: "2022-11-02",
        servicePlan: "Essential (next-business-day)",
        warrantyEnds: "2025-11-02",
        nextService: "2027-01-15",
        status: "Operational",
      },
      {
        productSlug: "thermaq-96-qpcr",
        serial: "TQ96-22-08812",
        location: "Molecular Lab, Room B118",
        installed: "2022-11-02",
        servicePlan: "Essential (next-business-day)",
        warrantyEnds: "2025-11-02",
        nextService: "2026-12-04",
        status: "Operational",
      },
      {
        productSlug: "cryovault-ult",
        serial: "CRV-26-11207",
        location: "Biorepository, Room LL04",
        installed: "2026-09-16",
        servicePlan: "Included warranty",
        warrantyEnds: "2028-09-16",
        nextService: "2027-03-16",
        status: "Operational",
      },
    ],
    consumables: [
      { sku: "VRT-RP-24", name: "Veritas Respiratory Panel cartridges", productSlug: "veritas-mdx", unit: "box of 24", onHand: 9, reorderPoint: 10, lot: "RP2608A", expires: "2027-02-28", standingOrder: true },
      { sku: "VRT-BC-24", name: "Veritas Blood Culture ID cartridges", productSlug: "veritas-mdx", unit: "box of 24", onHand: 7, reorderPoint: 4, lot: "BC2607C", expires: "2027-01-31", standingOrder: true },
      { sku: "IMX-TN-200", name: "Immunix hs-Troponin I reagent pack", productSlug: "immunix-ia", unit: "200 tests", onHand: 3, reorderPoint: 6, lot: "TN2609F", expires: "2026-12-15", standingOrder: true },
      { sku: "IMX-CUV-1K", name: "Immunix reaction cuvettes", productSlug: "immunix-ia", unit: "case of 1,000", onHand: 11, reorderPoint: 5, lot: "CV2605B", expires: "2029-05-01", standingOrder: false },
      { sku: "PX-KIT-VR", name: "PureX viral RNA extraction kit", productSlug: "purex-32-extractor", unit: "96 preps", onHand: 14, reorderPoint: 8, lot: "VR2607D", expires: "2027-04-30", standingOrder: false },
      { sku: "TQ-MM-500", name: "ThermaQ one-step RT-qPCR master mix", productSlug: "thermaq-96-qpcr", unit: "500 reactions", onHand: 2, reorderPoint: 4, lot: "MM2606A", expires: "2026-11-20", standingOrder: false },
    ],
    shipments: [
      {
        id: "SHP-77310",
        orderId: "SO-1048832",
        carrier: "FedEx Priority Overnight",
        tracking: "7845 2210 9931",
        status: "Out for delivery",
        shipped: "2026-10-03",
        eta: "2026-10-04",
        contents: "18 boxes Veritas cartridges",
        coldChain: true,
        events: [
          { date: "2026-10-04 07:42", location: "Columbus, OH", detail: "On vehicle for delivery" },
          { date: "2026-10-04 03:15", location: "Columbus, OH", detail: "Arrived at local facility" },
          { date: "2026-10-03 18:20", location: "Indianapolis, IN", detail: "Picked up, 2–8 °C shipper verified" },
        ],
      },
      {
        id: "SHP-77266",
        orderId: "SO-1048617",
        carrier: "UPS Next Day Air",
        tracking: "1Z 9X4 220 01 6612 8830",
        status: "Delayed",
        shipped: "2026-10-01",
        eta: "2026-10-06",
        contents: "4 Immunix hs-Troponin I reagent packs",
        coldChain: true,
        events: [
          { date: "2026-10-02 22:05", location: "Louisville, KY", detail: "Weather delay at hub; cold pack replaced" },
          { date: "2026-10-01 17:40", location: "Indianapolis, IN", detail: "Picked up" },
        ],
      },
      {
        id: "SHP-77204",
        orderId: "SO-1048617",
        carrier: "UPS Ground",
        tracking: "1Z 9X4 220 03 5521 1094",
        status: "Delivered",
        shipped: "2026-09-24",
        eta: "2026-09-26",
        contents: "6 reagent packs, calibrators, 8 cases cuvettes",
        coldChain: true,
        events: [
          { date: "2026-09-26 10:12", location: "Columbus, OH", detail: "Delivered, signed by L. NGUYEN (Receiving Dock 3)" },
          { date: "2026-09-24 16:30", location: "Indianapolis, IN", detail: "Picked up" },
        ],
      },
      {
        id: "SHP-76921",
        orderId: "SO-1047990",
        carrier: "Halcyra White Glove Freight",
        tracking: "HWG-0091842",
        status: "Delivered",
        shipped: "2026-09-12",
        eta: "2026-09-15",
        contents: "CryoVault −86 °C Freezer (1 crate)",
        coldChain: false,
        events: [
          { date: "2026-09-15 13:00", location: "Columbus, OH", detail: "Delivered and uncrated in Room LL04" },
          { date: "2026-09-12 09:00", location: "Reno, NV", detail: "Departed distribution center" },
        ],
      },
      {
        id: "SHP-76488",
        orderId: "SO-1047412",
        carrier: "FedEx Ground",
        tracking: "6129 4471 0302",
        status: "Delivered",
        shipped: "2026-08-19",
        eta: "2026-08-21",
        contents: "20 PureX kits, 10 ThermaQ master mix",
        coldChain: true,
        events: [{ date: "2026-08-21 11:47", location: "Columbus, OH", detail: "Delivered" }],
      },
    ],
  },
  {
    id: "northbridge",
    name: "Northbridge University, Department of Molecular & Cell Biology",
    shortName: "Northbridge University",
    sector: "academic",
    accountNumber: "AC-118342",
    city: "Madison, WI",
    contract: "University master agreement UMA-2291 (academic pricing tier 2)",
    accountManager: { name: "Owen Achterberg", email: "o.achterberg@halcyra.example", phone: "+1 (800) 555-0184" },
    users: [
      {
        id: "u-lindqvist",
        name: "Dr. Elin Lindqvist",
        title: "Director, Genomics Core Facility",
        email: "elin.lindqvist@northbridge.example",
        role: "admin",
        department: "Genomics Core",
      },
      {
        id: "u-mensah",
        name: "Kwame Mensah",
        title: "Flow Cytometry Core Manager",
        email: "kwame.mensah@northbridge.example",
        role: "lab-manager",
        department: "Flow Cytometry Core",
      },
      {
        id: "u-cho",
        name: "Dr. Jae-won Cho",
        title: "Assistant Professor",
        email: "jaewon.cho@northbridge.example",
        role: "researcher",
        department: "Immunology",
      },
      {
        id: "u-patel",
        name: "Anika Patel",
        title: "Research Purchasing Specialist",
        email: "anika.patel@northbridge.example",
        role: "purchasing",
        department: "Research Administration",
      },
    ],
    orders: [
      {
        id: "SO-1048901",
        po: "NBU-4471882",
        placed: "2026-10-01",
        placedBy: "Anika Patel",
        status: "Processing",
        shipments: ["SHP-77355"],
        lines: [
          { sku: "HLX-FC-P3", description: "Helix NX P3 flow cell (2 × 300 cycles)", qty: 4, unitPrice: 4850 },
          { sku: "HLX-LIB-96", description: "Helix library prep kit (96 samples)", qty: 3, unitPrice: 3200 },
        ],
      },
      {
        id: "SO-1048455",
        po: "NBU-4471610",
        placed: "2026-09-17",
        placedBy: "Kwame Mensah",
        status: "Backordered",
        shipments: [],
        lines: [
          { sku: "SFX-BEADS-QC", description: "SpectraFlow daily QC beads", qty: 6, unitPrice: 265 },
          { sku: "SFX-SHEATH-20", description: "SpectraFlow sheath fluid (20 L)", qty: 10, unitPrice: 88 },
        ],
      },
      {
        id: "SO-1047705",
        po: "NBU-4470955",
        placed: "2026-08-27",
        placedBy: "Dr. Elin Lindqvist",
        status: "Delivered",
        shipments: ["SHP-76702"],
        lines: [
          { sku: "ATL-LH-8", description: "Atlas Liquid Handler, 8-channel", productSlug: "atlas-liquid-handler", qty: 1, unitPrice: 112000 },
          { sku: "ATL-TIP-200", description: "Atlas filtered tips 200 µL (5,760/case)", qty: 6, unitPrice: 410 },
          { sku: "SVC-TRN-ONS", description: "On-site applications training (2 days)", qty: 1, unitPrice: 3600 },
        ],
      },
      {
        id: "SO-1047201",
        po: "NBU-4470507",
        placed: "2026-08-04",
        placedBy: "Dr. Jae-won Cho",
        status: "Delivered",
        shipments: ["SHP-76310"],
        lines: [
          { sku: "CCP-SLD-500", description: "CellCount Pro counting slides (500)", qty: 4, unitPrice: 185 },
          { sku: "SGL-CHIP-8", description: "Singulo single-cell chips (8/box)", qty: 2, unitPrice: 2400 },
        ],
      },
    ],
    instruments: [
      {
        productSlug: "helix-nx-sequencer",
        serial: "HNX-25-00128",
        location: "Genomics Core, Biotech Center 3.120",
        installed: "2025-02-17",
        servicePlan: "Research Plus (next-business-day)",
        warrantyEnds: "2027-02-17",
        nextService: "2026-10-21",
        status: "Operational",
      },
      {
        productSlug: "spectra-flow-x5",
        serial: "SFX5-23-02284",
        location: "Flow Core, Biotech Center 2.044",
        installed: "2023-05-30",
        servicePlan: "Research Plus (next-business-day)",
        warrantyEnds: "2025-05-30",
        nextService: "2026-10-07",
        status: "Down for service",
      },
      {
        productSlug: "lumen-cx-confocal",
        serial: "LCX9-24-00511",
        location: "Imaging Suite, Biotech Center B.010",
        installed: "2024-09-09",
        servicePlan: "Research Plus (next-business-day)",
        warrantyEnds: "2026-09-09",
        nextService: "2027-03-09",
        status: "Operational",
      },
      {
        productSlug: "atlas-liquid-handler",
        serial: "ATL8-26-03390",
        location: "Genomics Core, Biotech Center 3.122",
        installed: "2026-09-03",
        servicePlan: "Included warranty",
        warrantyEnds: "2027-09-03",
        nextService: "2027-03-03",
        status: "Operational",
      },
      {
        productSlug: "singulo-sc",
        serial: "SGL-24-00762",
        location: "Cho Lab, Life Sciences 512",
        installed: "2024-01-22",
        servicePlan: "Essential (next-business-day)",
        warrantyEnds: "2026-01-22",
        nextService: "2026-11-12",
        status: "Service due",
      },
      {
        productSlug: "cellcount-pro",
        serial: "CCP-22-07719",
        location: "Cho Lab, Life Sciences 512",
        installed: "2022-08-15",
        servicePlan: "None",
        warrantyEnds: "2023-08-15",
        nextService: "—",
        status: "Operational",
      },
    ],
    consumables: [
      { sku: "HLX-FC-P3", name: "Helix NX P3 flow cell", productSlug: "helix-nx-sequencer", unit: "each", onHand: 1, reorderPoint: 3, lot: "FC2608K", expires: "2027-03-31", standingOrder: false },
      { sku: "HLX-LIB-96", name: "Helix library prep kit", productSlug: "helix-nx-sequencer", unit: "96 samples", onHand: 2, reorderPoint: 2, lot: "LB2607H", expires: "2027-01-31", standingOrder: false },
      { sku: "SFX-BEADS-QC", name: "SpectraFlow daily QC beads", productSlug: "spectra-flow-x5", unit: "vial", onHand: 0, reorderPoint: 2, lot: "—", expires: "—", standingOrder: true },
      { sku: "ATL-TIP-200", name: "Atlas filtered tips 200 µL", productSlug: "atlas-liquid-handler", unit: "case of 5,760", onHand: 5, reorderPoint: 2, lot: "TP2608C", expires: "2031-08-01", standingOrder: false },
      { sku: "SGL-CHIP-8", name: "Singulo single-cell chips", productSlug: "singulo-sc", unit: "box of 8", onHand: 1, reorderPoint: 1, lot: "SC2606E", expires: "2026-12-31", standingOrder: false },
      { sku: "CCP-SLD-500", name: "CellCount Pro counting slides", productSlug: "cellcount-pro", unit: "pack of 500", onHand: 3, reorderPoint: 1, lot: "SL2605A", expires: "2029-05-31", standingOrder: false },
    ],
    shipments: [
      {
        id: "SHP-77355",
        orderId: "SO-1048901",
        carrier: "FedEx Priority Overnight",
        tracking: "Pending",
        status: "Label created",
        eta: "2026-10-07",
        contents: "4 flow cells, 3 library prep kits",
        coldChain: true,
        events: [{ date: "2026-10-03 15:10", location: "Indianapolis, IN", detail: "Picking in progress; ships with −20 °C dry ice" }],
      },
      {
        id: "SHP-76702",
        orderId: "SO-1047705",
        carrier: "Halcyra White Glove Freight",
        tracking: "HWG-0091377",
        status: "Delivered",
        shipped: "2026-08-31",
        eta: "2026-09-02",
        contents: "Atlas Liquid Handler (2 crates), 6 cases tips",
        coldChain: false,
        events: [
          { date: "2026-09-02 10:30", location: "Madison, WI", detail: "Delivered to Biotech Center loading dock" },
          { date: "2026-08-31 08:00", location: "Reno, NV", detail: "Departed distribution center" },
        ],
      },
      {
        id: "SHP-76310",
        orderId: "SO-1047201",
        carrier: "UPS 2nd Day Air",
        tracking: "1Z 7A1 004 02 8830 2216",
        status: "Delivered",
        shipped: "2026-08-05",
        eta: "2026-08-07",
        contents: "Counting slides, single-cell chips",
        coldChain: false,
        events: [{ date: "2026-08-07 14:02", location: "Madison, WI", detail: "Delivered, Life Sciences mailroom" }],
      },
    ],
  },
  {
    id: "phrl",
    name: "Federal Public Health Reference Laboratory, Region 4",
    shortName: "Public Health Reference Lab",
    sector: "government",
    accountNumber: "GV-330519",
    city: "Atlanta, GA",
    contract: "GSA schedule contract GS-07F-0412X",
    accountManager: { name: "Celeste Marchetti", email: "c.marchetti@halcyra.example", phone: "+1 (800) 555-0129" },
    users: [
      {
        id: "u-hollis",
        name: "Dr. Marcus Hollis",
        title: "Laboratory Branch Chief",
        email: "marcus.hollis@phrl.example.gov",
        role: "admin",
        department: "Laboratory Branch",
      },
      {
        id: "u-tran",
        name: "Dr. Linh Tran",
        title: "Supervisory Microbiologist",
        email: "linh.tran@phrl.example.gov",
        role: "lab-manager",
        department: "Pathogen Genomics",
      },
      {
        id: "u-silva",
        name: "Rosa Silva, RN",
        title: "Outbreak Response Nurse Epidemiologist",
        email: "rosa.silva@phrl.example.gov",
        role: "clinician",
        department: "Outbreak Response",
      },
      {
        id: "u-greer",
        name: "Paul Greer",
        title: "Contracting Officer",
        email: "paul.greer@phrl.example.gov",
        role: "purchasing",
        department: "Acquisitions",
      },
    ],
    orders: [
      {
        id: "SO-1048760",
        po: "GV-26-PHRL-0912",
        placed: "2026-09-26",
        placedBy: "Paul Greer",
        status: "Shipped",
        shipments: ["SHP-77288"],
        lines: [
          { sku: "HLX-MN-100", description: "Helix Mini benchtop sequencer", productSlug: "helix-mini", qty: 2, unitPrice: 58500 },
          { sku: "HLX-MFC-1", description: "Helix Mini flow cell", qty: 24, unitPrice: 890 },
        ],
      },
      {
        id: "SO-1048301",
        po: "GV-26-PHRL-0870",
        placed: "2026-09-11",
        placedBy: "Dr. Linh Tran",
        status: "Delivered",
        shipments: ["SHP-76990"],
        lines: [
          { sku: "VRT-GI-24", description: "Veritas GI Panel cartridges (24/box)", qty: 15, unitPrice: 2240 },
          { sku: "ORN-COL-C18", description: "Orion C18 analytical column", qty: 4, unitPrice: 720 },
        ],
      },
      {
        id: "SO-1047122",
        po: "GV-26-PHRL-0791",
        placed: "2026-07-30",
        placedBy: "Paul Greer",
        status: "Delivered",
        shipments: ["SHP-76255"],
        lines: [
          { sku: "BBK-RACK-96", description: "BioBank AX 2D-barcoded tube racks (96)", qty: 40, unitPrice: 62 },
          { sku: "SVC-PM-BBK", description: "BioBank AX preventive maintenance visit", qty: 1, unitPrice: 4800 },
        ],
      },
    ],
    instruments: [
      {
        productSlug: "veritas-mdx",
        serial: "VMX-25-02891",
        location: "BSL-2 Suite, Building 18 Room 210",
        installed: "2025-04-08",
        servicePlan: "Government Assure (4-hour response)",
        warrantyEnds: "2027-04-08",
        nextService: "2026-10-14",
        status: "Operational",
      },
      {
        productSlug: "orion-tq",
        serial: "OTQ6-24-00347",
        location: "Chemistry Branch, Building 17 Room 104",
        installed: "2024-06-19",
        servicePlan: "Government Assure (4-hour response)",
        warrantyEnds: "2026-06-19",
        nextService: "2026-12-01",
        status: "Operational",
      },
      {
        productSlug: "vantor-uhplc",
        serial: "VTR-23-04120",
        location: "Chemistry Branch, Building 17 Room 104",
        installed: "2023-03-02",
        servicePlan: "Essential (next-business-day)",
        warrantyEnds: "2025-03-02",
        nextService: "2026-10-30",
        status: "Service due",
      },
      {
        productSlug: "biobank-ax",
        serial: "BAX-22-00041",
        location: "Specimen Repository, Building 20",
        installed: "2022-10-12",
        servicePlan: "Government Assure (4-hour response)",
        warrantyEnds: "2024-10-12",
        nextService: "2027-01-28",
        status: "Operational",
      },
    ],
    consumables: [
      { sku: "VRT-GI-24", name: "Veritas GI Panel cartridges", productSlug: "veritas-mdx", unit: "box of 24", onHand: 11, reorderPoint: 6, lot: "GI2608B", expires: "2027-03-31", standingOrder: true },
      { sku: "VRT-RP-24", name: "Veritas Respiratory Panel cartridges", productSlug: "veritas-mdx", unit: "box of 24", onHand: 4, reorderPoint: 8, lot: "RP2607E", expires: "2027-01-31", standingOrder: true },
      { sku: "ORN-COL-C18", name: "Orion C18 analytical column", productSlug: "orion-tq", unit: "each", onHand: 3, reorderPoint: 2, lot: "C182606", expires: "—", standingOrder: false },
      { sku: "HLX-MFC-1", name: "Helix Mini flow cell", productSlug: "helix-mini", unit: "each", onHand: 0, reorderPoint: 6, lot: "—", expires: "—", standingOrder: false },
      { sku: "BBK-RACK-96", name: "BioBank AX tube racks", productSlug: "biobank-ax", unit: "rack of 96", onHand: 28, reorderPoint: 10, lot: "RK2607A", expires: "—", standingOrder: false },
    ],
    shipments: [
      {
        id: "SHP-77288",
        orderId: "SO-1048760",
        carrier: "Halcyra White Glove Freight",
        tracking: "HWG-0092210",
        status: "In transit",
        shipped: "2026-10-02",
        eta: "2026-10-06",
        contents: "2 Helix Mini sequencers, 24 flow cells",
        coldChain: true,
        events: [
          { date: "2026-10-03 20:45", location: "Nashville, TN", detail: "In transit, temperature log nominal" },
          { date: "2026-10-02 08:00", location: "Reno, NV", detail: "Departed distribution center" },
        ],
      },
      {
        id: "SHP-76990",
        orderId: "SO-1048301",
        carrier: "FedEx Priority Overnight",
        tracking: "7845 1903 5528",
        status: "Delivered",
        shipped: "2026-09-14",
        eta: "2026-09-15",
        contents: "15 boxes GI cartridges, 4 columns",
        coldChain: true,
        events: [{ date: "2026-09-15 09:21", location: "Atlanta, GA", detail: "Delivered, Building 18 receiving" }],
      },
      {
        id: "SHP-76255",
        orderId: "SO-1047122",
        carrier: "UPS Ground",
        tracking: "1Z 5F2 881 03 1120 4471",
        status: "Delivered",
        shipped: "2026-07-31",
        eta: "2026-08-04",
        contents: "40 tube racks",
        coldChain: false,
        events: [{ date: "2026-08-04 13:55", location: "Atlanta, GA", detail: "Delivered" }],
      },
    ],
  },
];

export const promotions: Promotion[] = [
  {
    id: "promo-veritas-sepsis",
    title: "Sepsis panel launch pricing",
    summary: "Add the new Veritas Blood Culture ID panel to your menu at launch pricing, with free verification support.",
    offer: "20% off Veritas BC-ID cartridges for 6 months",
    code: "SEPSIS20",
    ends: "2026-12-31",
    sectors: ["healthcare", "government"],
    productSlugs: ["veritas-mdx"],
  },
  {
    id: "promo-helix-upgrade",
    title: "Helix sequencing trade-up",
    summary: "Trade in any short-read sequencer more than five years old toward a Helix NX or Helix Mini.",
    offer: "Up to $45,000 trade-in credit",
    code: "HELIXUP",
    ends: "2026-11-30",
    sectors: ["academic", "government", "healthcare"],
    productSlugs: ["helix-nx-sequencer", "helix-mini"],
  },
  {
    id: "promo-core-facility",
    title: "Core facility consumables bundle",
    summary: "Commit to 12 months of flow cells, QC beads or tips and lock in pricing with quarterly delivery.",
    offer: "15% off plus free cold-chain shipping",
    code: "CORE15",
    ends: "2027-01-31",
    sectors: ["academic"],
    productSlugs: ["helix-nx-sequencer", "spectra-flow-x5", "atlas-liquid-handler"],
  },
  {
    id: "promo-grant-season",
    title: "Grant season quote support",
    summary: "Get budget quotes, justification letters and spec sheets for NIH S10 and NSF MRI submissions within 48 hours.",
    offer: "Free grant-ready quote package",
    code: "GRANT26",
    ends: "2026-12-15",
    sectors: ["academic"],
    productSlugs: ["lumen-cx-confocal", "nanovista-sr", "orion-qtof-ms"],
  },
  {
    id: "promo-ult-energy",
    title: "Energy-smart cold storage",
    summary: "Replace freezers older than 10 years with CryoVault and qualify for utility rebates we file for you.",
    offer: "$2,500 off each CryoVault plus rebate filing",
    code: "COLD2500",
    ends: "2026-12-31",
    sectors: ["academic", "government", "healthcare"],
    productSlugs: ["cryovault-ult"],
  },
  {
    id: "promo-immunix-cardiac",
    title: "Cardiac menu expansion",
    summary: "Add NT-proBNP and CK-MB assays to your Immunix 300 with complimentary calibrators for the first year.",
    offer: "Free calibrators for 12 months",
    code: "CARDIAC12",
    ends: "2026-11-15",
    sectors: ["healthcare"],
    productSlugs: ["immunix-ia"],
  },
  {
    id: "promo-public-health",
    title: "Public health preparedness program",
    summary: "Surge-capacity reagent reserves held at Halcyra and released within 24 hours during an outbreak.",
    offer: "No-cost reagent reserve for 12 months",
    code: "READY24",
    ends: "2027-03-31",
    sectors: ["government"],
    productSlugs: ["veritas-mdx", "helix-mini"],
  },
  {
    id: "contract-st-aldric",
    title: "Your GPO contract pricing",
    summary: "Tier 3 pricing on all Veritas and Immunix consumables under GPO-7731, applied automatically to every order.",
    offer: "Tier 3 contract pricing",
    code: "Applied automatically",
    ends: "2028-06-30",
    sectors: ["healthcare"],
    productSlugs: ["veritas-mdx", "immunix-ia"],
    accountId: "st-aldric",
  },
  {
    id: "contract-northbridge",
    title: "Your academic master agreement",
    summary: "Academic tier 2 pricing plus 10% extra on service plans renewed before the end of the fiscal year.",
    offer: "10% off service plan renewals",
    code: "UMA-SVC10",
    ends: "2027-06-30",
    sectors: ["academic"],
    productSlugs: ["spectra-flow-x5", "singulo-sc"],
    accountId: "northbridge",
  },
];

export function getAccount(id: string): CustomerAccount | undefined {
  return accounts.find((a) => a.id === id);
}

export function findUserByEmail(email: string): { account: CustomerAccount; user: PortalUser } | undefined {
  const e = email.trim().toLowerCase();
  for (const account of accounts) {
    const user = account.users.find((u) => u.email.toLowerCase() === e);
    if (user) return { account, user };
  }
  return undefined;
}

export function promotionsFor(account: CustomerAccount): Promotion[] {
  return promotions.filter((p) =>
    p.accountId ? p.accountId === account.id : p.sectors.includes(account.sector),
  );
}

export function orderTotal(order: Order): number {
  return order.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
}

export function isLowStock(c: ConsumableStock): boolean {
  return c.onHand <= c.reorderPoint;
}

export const roleLabels: Record<PortalRole, string> = {
  admin: "Account admin",
  purchasing: "Purchasing",
  "lab-manager": "Lab manager",
  clinician: "Clinician",
  researcher: "Researcher",
};

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso;
  const [date, time] = iso.split(" ");
  const d = new Date(`${date}T00:00:00Z`);
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return time ? `${label}, ${time}` : label;
}
