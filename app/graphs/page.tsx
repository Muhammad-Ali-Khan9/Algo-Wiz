import { GraphWiz } from "@/components/graphs/GraphWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graphs — Algorithms Wizard",
  description:
    "Interactive graph algorithms: traversal, connectivity, MSTs, ordering, and analysis on generated graphs.",
};

export default function GraphsPage() {
  return <GraphWiz />;
}
