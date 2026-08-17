import { TreesWiz } from "@/components/trees/TreesWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trees — Algorithms Wizard",
  description:
    "Visualize binary trees, BST, AVL, red-black trees, heaps, tries, and segment trees — with insert, delete, rotations, and range queries.",
};

export default function TreesPage() {
  return <TreesWiz />;
}
