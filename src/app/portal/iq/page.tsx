import type { Metadata } from "next";
import { IQView } from "./IQView";

export const metadata: Metadata = { title: "HalcyraIQ" };

export default function Page() {
  return <IQView />;
}
