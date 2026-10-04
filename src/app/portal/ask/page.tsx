import type { Metadata } from "next";
import { AskView } from "./AskView";

export const metadata: Metadata = { title: "Ask about products" };

export default function Page() {
  return <AskView />;
}
