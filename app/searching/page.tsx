import { SearchingWiz } from "@/components/searching/SearchingWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Searching — Algorithms Wizard",
  description:
    "Interactive visualizations of linear, binary, jump, interpolation, exponential, Fibonacci, ternary, and sentinel linear search.",
};

export default function SearchingPage() {
  return <SearchingWiz />;
}
