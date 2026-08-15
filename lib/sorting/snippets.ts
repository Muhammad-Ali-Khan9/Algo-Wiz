import { SORT_CODE as comparison } from "./snippets-comparison";
import { SORT_CODE_HYBRID as hybrid } from "./snippets-hybrid";
import { SORT_CODE_LINEAR as linear } from "./snippets-linear";
import type { AlgorithmId } from "./types";
import type { CodeSnippets } from "@/lib/code/languages";

export const SORT_CODE: Record<AlgorithmId, CodeSnippets> = {
  ...comparison,
  ...linear,
  ...hybrid,
};
