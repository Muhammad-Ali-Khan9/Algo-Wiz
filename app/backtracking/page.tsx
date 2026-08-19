import { BacktrackingWiz } from "@/components/backtracking/BacktrackingWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backtracking — Algorithms Wizard",
  description:
    "Visualize backtracking: combinatorial search and constraint satisfaction (N-Queens, Sudoku, graph coloring, crossword).",
};

export default function BacktrackingPage() {
  return <BacktrackingWiz />;
}
