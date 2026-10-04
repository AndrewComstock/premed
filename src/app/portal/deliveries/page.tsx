import type { Metadata } from "next";
import { DeliveriesView } from "./DeliveriesView";

export const metadata: Metadata = { title: "Deliveries" };

export default function Page() {
  return <DeliveriesView />;
}
