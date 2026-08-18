import { DpWiz } from "@/components/dp/DpWiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dynamic Programming — Algorithms Wizard",
  description:
    "Visualize 1D dynamic programming: Fibonacci, Climbing Stairs, House Robber, and Coin Change.",
};

export default function DpPage() {
  return <DpWiz />;
}
