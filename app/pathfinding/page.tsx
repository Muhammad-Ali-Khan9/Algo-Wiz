import { PathfindingWiz } from "@/components/pathfinding/PathfindingWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pathfinding — Algorithms Wizard",
  description:
    "Find the best route from A to B with BFS, Dijkstra, A*, and more pathfinding algorithms.",
};

export default function PathfindingPage() {
  return <PathfindingWiz />;
}
