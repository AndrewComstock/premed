// Customer portal types and display helpers.
// The data itself (invented institutions, users, orders, inventory, shipments and
// promotions) lives in DynamoDB and is served by the portal API in infra/agent-api
// after sign-in; the seed file is infra/agent-api/seed/portal-seed.json. Instruments
// reference catalog entries in src/lib/products.ts by slug, so agents can join portal
// data with product specifications.

import type { Sector } from "./products";

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

/** What GET /portal/me returns for the signed-in user. */
export interface PortalSession {
  user: PortalUser;
  account: CustomerAccount;
  /** Promotions this account is eligible for, including its contract pricing. */
  promotions: Promotion[];
  /** Set once an account admin has activated HalcyraIQ for the institution. */
  halcyraIQ: HalcyraIQActivation | null;
}

export interface HalcyraIQActivation {
  activatedAt: string;
  /** Name of the admin who activated it. */
  activatedBy: string;
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
