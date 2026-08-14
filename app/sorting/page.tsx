import { SortingWiz } from "@/components/sorting/SortingWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sorting — Algorithms Wizard",
  description:
    "Interactive visualizations of bubble, selection, insertion, merge, quick, heap, shell, counting, radix, bucket, pigeonhole, Tim, intro, bitonic, and stooge sort.",
};

export default function SortingPage() {
  return <SortingWiz />;
}
