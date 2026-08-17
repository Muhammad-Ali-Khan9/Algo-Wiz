import type { TreeInput, TreeKind } from "./types";

export function shuffleSeed(n = 1): number {
  const a = (Math.sin(n * 12.9898) * 43758.5453) % 1;
  return Math.floor(Math.abs(a) * 1e9) ^ (Date.now() & 0xffff);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function uniqueKeys(count: number, rand: () => number, max = 99): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, count);
}

const WORD_BANK = [
  "ace",
  "ape",
  "app",
  "apt",
  "art",
  "ash",
  "ask",
  "ate",
  "cab",
  "can",
  "cap",
  "car",
  "cat",
  "cod",
  "cog",
  "cop",
  "cot",
  "cow",
  "cub",
  "cup",
  "cut",
  "dab",
  "dam",
  "den",
  "dew",
  "dig",
  "dim",
  "dip",
  "dog",
  "dot",
  "dry",
  "dub",
  "dug",
  "ear",
  "eat",
  "eel",
  "egg",
  "elf",
  "elm",
  "end",
  "era",
  "eve",
  "fan",
  "far",
  "fat",
  "fax",
  "fed",
  "fig",
  "fin",
  "fit",
  "fix",
  "fog",
  "for",
  "fox",
  "fun",
  "fur",
  "gap",
  "gas",
  "gel",
  "gem",
  "get",
  "gig",
  "gin",
  "god",
  "got",
  "gum",
  "gun",
  "gut",
  "guy",
  "gym",
  "had",
  "ham",
  "has",
  "hat",
  "hay",
  "hem",
  "hen",
  "her",
  "hew",
  "hex",
  "hey",
  "hid",
  "him",
  "hip",
  "his",
  "hit",
  "hog",
  "hop",
  "hot",
  "how",
  "hub",
  "hue",
  "hug",
  "hum",
  "hut",
];

export function generateTreeInput(kind: TreeKind, size: number, seed: number): TreeInput {
  const rand = mulberry32(seed);
  const n = Math.max(3, Math.min(size, kind === "trie" ? 8 : 14));

  if (kind === "trie") {
    const words = uniqueKeys(n, rand, WORD_BANK.length).map((i) => WORD_BANK[i - 1]!);
    const queryWord =
      rand() < 0.55
        ? words[Math.floor(rand() * words.length)]!
        : words[0]!.slice(0, Math.max(1, Math.floor(rand() * words[0]!.length)));
    return {
      kind,
      values: [],
      target: 0,
      words,
      queryWord,
      queryL: 0,
      queryR: 0,
      updateIndex: 0,
      updateValue: 0,
    };
  }

  const values = uniqueKeys(n, rand);
  const target =
    rand() < 0.7
      ? values[Math.floor(rand() * values.length)]!
      : Math.floor(rand() * 99) + 1;

  if (kind === "segment") {
    const arr = values.map((v) => Math.max(1, Math.round(v / 3)));
    const queryL = Math.floor(rand() * Math.max(1, arr.length - 1));
    const queryR = queryL + Math.floor(rand() * (arr.length - queryL));
    const updateIndex = Math.floor(rand() * arr.length);
    const updateValue = Math.floor(rand() * 30) + 1;
    return {
      kind,
      values: arr,
      target,
      words: [],
      queryWord: "",
      queryL,
      queryR,
      updateIndex,
      updateValue,
    };
  }

  return {
    kind,
    values,
    target,
    words: [],
    queryWord: "",
    queryL: 0,
    queryR: 0,
    updateIndex: 0,
    updateValue: 0,
  };
}
