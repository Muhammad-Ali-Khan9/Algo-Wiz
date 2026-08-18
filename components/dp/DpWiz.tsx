"use client";

import { CodePanel } from "@/components/code/CodePanel";
import dpStyles from "@/components/dp/dp-wiz.module.scss";
import graphStyles from "@/components/graphs/graph-wiz.module.scss";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import styles from "@/components/wiz/wiz.module.scss";
import {
  DP_META,
  generateDpInput,
  getDpAlgo,
  isUnreachable,
  runDpAlgo,
  shuffleSeed,
} from "@/lib/dp";
import type { DpAlgoId, DpCellRole, DpInput } from "@/lib/dp/types";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MIN_SIZE = 5;
const MAX_SIZE = 16;
const DEFAULT_SIZE = 10;
const DEFAULT_SPEED = 58;
const INITIAL_SEED = 42;

const ROLE_COLORS: Record<DpCellRole, string> = {
  idle: "#64748b",
  current: "#3b82f6",
  read: "#eab308",
  write: "#22c55e",
  answer: "#a855f7",
  skip: "#ef4444",
};

const ROLE_LABELS: { role: DpCellRole; label: string }[] = [
  { role: "idle", label: "Idle" },
  { role: "current", label: "Current" },
  { role: "read", label: "Read" },
  { role: "write", label: "Write" },
  { role: "answer", label: "Answer" },
  { role: "skip", label: "Skip" },
];

function compactNumber(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const scaled = value / 1_000_000;
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}M`;
  }
  if (abs >= 10_000) {
    const scaled = value / 1_000;
    return `${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}k`;
  }
  return String(value);
}

export function DpWiz() {
  const [algorithmId, setAlgorithmId] = useState<DpAlgoId>("fibonacci");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [input, setInput] = useState<DpInput>(() =>
    generateDpInput("fibonacci", DEFAULT_SIZE, INITIAL_SEED),
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getDpAlgo(algorithmId);

  const shuffle = useCallback(
    (nextSize = size, id = algorithmId) => {
      setInput(generateDpInput(id, nextSize, shuffleSeed(nextSize * 19 + 5)));
      setIndex(0);
      setPlaying(false);
    },
    [size, algorithmId],
  );

  const selectAlgorithm = useCallback(
    (next: string) => {
      if (next === algorithmId) {
        setSidebarOpen(false);
        return;
      }
      const nextMeta = getDpAlgo(next as DpAlgoId);
      if (nextMeta.available === false) return;
      setSidebarOpen(false);
      setPlaying(false);
      setBusy(true);
      for (const id of swapTimers.current) window.clearTimeout(id);
      swapTimers.current = [];
      swapTimers.current.push(
        window.setTimeout(() => {
          setAlgorithmId(nextMeta.id);
          setInput(generateDpInput(nextMeta.id, size, shuffleSeed(size * 31 + 9)));
          setIndex(0);
        }, 400),
        window.setTimeout(() => setBusy(false), 850),
      );
    },
    [algorithmId, size],
  );

  const frames = useMemo(() => runDpAlgo(algorithmId, input), [algorithmId, input]);
  const safeIndex = Math.min(index, Math.max(frames.length - 1, 0));
  const frame = frames[safeIndex];
  const atEnd = frames.length > 0 && safeIndex >= frames.length - 1;

  const viewportRef = useRef<HTMLDivElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const lastFitKeyRef = useRef("");
  const applyFitRef = useRef(() => {});
  const fitSnapshotRef = useRef({
    gridRows: 0,
    gridCols: 0,
    hasSourceGrid: false,
    hasItems: false,
    tableLen: 0,
    isGrid: false,
    maxDigits: 1,
  });

  useEffect(() => {
    const boot = window.setTimeout(() => setBooting(false), BOOT_HOLD_MS);
    return () => window.clearTimeout(boot);
  }, []);

  useEffect(() => {
    if (!booting && !busy) {
      setPreloaderExiting(true);
      const fade = window.setTimeout(() => setPreloaderShown(false), PRELOAD_FADE_MS);
      return () => window.clearTimeout(fade);
    }
    setPreloaderShown(true);
    setPreloaderExiting(false);
  }, [booting, busy]);

  useEffect(() => {
    if (!playing || atEnd || frames.length === 0) {
      if (atEnd) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, frames.length - 1));
    }, delayForSpeed(speed));
    return () => window.clearTimeout(timer);
  }, [playing, atEnd, frames.length, speed, safeIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        if (atEnd) {
          setIndex(0);
          setPlaying(true);
        } else setPlaying((value) => !value);
      } else if (event.key === "ArrowRight") {
        setPlaying(false);
        setIndex((current) => Math.min(current + 1, Math.max(frames.length - 1, 0)));
      } else if (event.key === "ArrowLeft") {
        setPlaying(false);
        setIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === "r" || event.key === "R") {
        shuffle();
      } else if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [atEnd, frames.length, shuffle]);

  const progress =
    frames.length > 1 ? Math.round((safeIndex / (frames.length - 1)) * 100) : 0;

  const amountHint =
    algorithmId === "coin-change" ? input.amount || input.n : Number.MAX_SAFE_INTEGER;
  const table = frame?.table ?? [];
  const roles = frame?.roles ?? [];
  const inputRow = frame?.input;
  const inputRoles = frame?.inputRoles;
  const isGrid = Boolean(frame?.grid?.length);
  const dpGrid = frame?.grid ?? [];
  const dpGridRoles = frame?.gridRoles ?? [];
  const sourceGrid = frame?.sourceGrid;
  const items = frame?.items;
  const itemRoles = frame?.itemRoles;
  const frameWords = frame?.words;
  const wordRoles = frame?.wordRoles;
  const treeNodes = frame?.treeNodes;
  const treeEdges = frame?.treeEdges;
  const treeRoles = frame?.treeRoles;
  const treeEdgeRoles = frame?.treeEdgeRoles;
  const isTree = Boolean(treeNodes?.length);
  const isSubsetSum = algorithmId === "subset-sum";
  const isWordBreak = algorithmId === "word-break";
  const isPalindromePartition = algorithmId === "palindrome-partitioning";
  const isBoolTable = isSubsetSum || isWordBreak || isPalindromePartition;

  const isGridAlgo =
    algorithmId === "unique-paths" ||
    algorithmId === "min-path-sum" ||
    algorithmId === "dungeon-game";

  const isKnapsackAlgo =
    algorithmId === "knapsack-01" ||
    algorithmId === "knapsack-unbounded" ||
    algorithmId === "subset-sum";

  const isStringAlgo =
    algorithmId === "lcs" ||
    algorithmId === "edit-distance" ||
    algorithmId === "word-break" ||
    algorithmId === "palindromic-subsequence" ||
    isPalindromePartition;

  const isSequenceAlgo = algorithmId === "lis" || algorithmId === "bitonic-subsequence";

  const isTreeAlgo =
    algorithmId === "tree-diameter" ||
    algorithmId === "maximum-path-sum" ||
    algorithmId === "minimax";

  const isGraphAlgo = algorithmId === "dag-dp" || algorithmId === "tsp";
  const isBitmaskAlgo = algorithmId === "tsp" || algorithmId === "assignment";

  const sizeLabel = isGridAlgo
    ? "Grid"
    : isKnapsackAlgo
      ? "Items"
      : isStringAlgo
        ? "Length"
        : algorithmId === "assignment"
          ? "Size"
          : algorithmId === "minimax"
            ? "Depth"
            : algorithmId === "optimal-strategy"
              ? "Pots"
              : isTreeAlgo || isGraphAlgo
                ? "Nodes"
                : isSequenceAlgo || algorithmId === "burst-balloons"
                  ? "Values"
                  : algorithmId === "matrix-chain"
                    ? "Matrices"
                    : algorithmId === "house-robber"
                      ? "Houses"
                      : algorithmId === "coin-change"
                        ? "Amount"
                        : "n";

  const sizeDisplay = isGridAlgo
    ? `${input.rows}×${input.cols}`
    : isKnapsackAlgo
      ? `${input.weights.length} · W=${input.capacity}`
      : algorithmId === "lcs" || algorithmId === "edit-distance"
        ? `${input.textA.length}×${input.textB.length}`
        : algorithmId === "word-break"
          ? `${input.textA.length} · ${input.words.length}w`
          : algorithmId === "palindromic-subsequence" || isPalindromePartition
            ? input.textA.length
            : algorithmId === "matrix-chain"
              ? Math.max(0, input.values.length - 1)
              : algorithmId === "assignment"
                ? `${input.n}×${input.n}`
                : algorithmId === "minimax"
                  ? input.n
                  : algorithmId === "optimal-strategy"
                    ? input.values.length
                    : isTreeAlgo ||
                        isGraphAlgo ||
                        isBitmaskAlgo ||
                        isSequenceAlgo ||
                        algorithmId === "house-robber" ||
                        algorithmId === "burst-balloons"
                      ? input.n || input.values.length
                      : algorithmId === "coin-change"
                        ? input.amount
                        : input.n;

  function formatGridCell(value: number | null) {
    if (value == null) return "·";
    if (isBoolTable) return value === 1 ? "T" : "F";
    return compactNumber(value);
  }

  function formatTableCell(value: number | null) {
    if (isWordBreak) {
      if (value == null) return "·";
      return value === 1 ? "T" : "F";
    }
    if (value == null) return "·";
    if (isUnreachable(value, amountHint)) return "∞";
    return compactNumber(value);
  }

  const maxDigits = useMemo(() => {
    let max = 1;
    const consider = (value: number | null | undefined) => {
      if (value == null) return;
      if (isUnreachable(value, amountHint)) {
        max = Math.max(max, 1);
        return;
      }
      max = Math.max(max, compactNumber(value).length);
    };
    for (const row of dpGrid) for (const value of row) consider(value);
    for (const value of table) consider(value);
    if (inputRow) for (const value of inputRow) consider(value);
    return max;
  }, [dpGrid, table, inputRow, amountHint]);

  const gridRows = dpGrid.length;
  const gridCols = dpGrid[0]?.length ?? 0;
  const hasSourceGrid = Boolean(sourceGrid?.length);
  const hasItems =
    Boolean(items?.length) ||
    Boolean(frameWords?.length) ||
    Boolean(sourceGrid?.length) ||
    isStringAlgo;
  const tableLen = table.length;

  fitSnapshotRef.current = {
    gridRows,
    gridCols,
    hasSourceGrid,
    hasItems,
    tableLen,
    isGrid,
    maxDigits,
  };

  const density = useMemo(() => {
    const rows = Math.max(gridRows, 1);
    const cols = Math.max(gridCols, 1);
    const dual = hasSourceGrid ? 2 : 1;
    const span = Math.max(rows, cols * dual, tableLen);
    const cells = Math.max(rows * cols * dual, tableLen, 1);
    if (span >= 14 || cells >= 80) return "tiny";
    if (span >= 10 || cells >= 48) return "compact";
    if (span >= 7 || cells >= 24) return "cozy";
    return "comfortable";
  }, [gridRows, gridCols, hasSourceGrid, tableLen]);

  useEffect(() => {
    const el = viewportRef.current;
    const wrap = tableWrapRef.current;
    if (!el || !wrap) return;

    const applyFit = () => {
      const snap = fitSnapshotRef.current;
      const rows = Math.max(snap.gridRows, 1);
      const cols = Math.max(snap.gridCols, 1);
      const dual = snap.hasSourceGrid ? 2 : 1;
      const padX = 40;
      const padY = snap.hasItems ? 88 : 56;
      const gap = 3;
      const availW = Math.max(el.clientWidth - padX, 120);
      const availH = Math.max(el.clientHeight - padY, 120);

      let cell = 44;
      if (snap.isGrid && cols > 0) {
        const panelGap = dual > 1 ? 48 : 0;
        const wBudget = (availW - panelGap) / dual;
        const fromW = (wBudget - gap * Math.max(cols - 1, 0)) / cols;
        let fromH = (availH - gap * Math.max(rows - 1, 0)) / rows;
        cell = Math.min(fromW, fromH);
        if (cell >= 22) {
          const labelReserve = Math.max(10, cell * 0.28);
          fromH = (availH - gap * Math.max(rows - 1, 0) - labelReserve * rows) / rows;
          cell = Math.min(fromW, fromH);
        }
      } else if (snap.tableLen > 0) {
        cell = (availW - gap * Math.max(snap.tableLen - 1, 0)) / snap.tableLen;
      }

      const digits = Math.max(1, snap.maxDigits);
      const fit = Math.round(Math.min(56, Math.max(12, cell)));
      const digitNeed = Math.min(56, 8 + digits * 7.5);
      // Widen a little for long values when the viewport allows; never shrink below fit.
      const sized = Math.round(
        Math.min(56, Math.max(fit, Math.min(digitNeed, fit + digits * 2))),
      );

      const fontFromBox = Math.round(sized * 0.28);
      const fontFromDigits = Math.floor((sized - 8) / Math.max(digits * 0.62, 1));
      const font = Math.max(6, Math.min(14, fontFromBox, fontFromDigits || fontFromBox));
      const showLabels = sized >= 22;
      const label = showLabels ? Math.max(7, Math.round(sized * 0.2)) : 0;
      const gapPx = Math.max(2, Math.round(sized * 0.08));
      const radius = Math.max(3, Math.round(sized * 0.16));
      const key = `${sized}:${font}:${label}:${gapPx}:${digits}`;
      if (lastFitKeyRef.current === key) return;
      lastFitKeyRef.current = key;

      wrap.style.setProperty("--cell-w", `${sized}px`);
      wrap.style.setProperty("--cell-h", `${sized}px`);
      wrap.style.setProperty("--cell-font", `${font}px`);
      wrap.style.setProperty("--cell-gap", `${gapPx}px`);
      wrap.style.setProperty("--cell-radius", `${radius}px`);
      wrap.style.setProperty("--label-font", label ? `${label}px` : "0px");
      wrap.style.setProperty("--1d-w", `${sized}px`);
      wrap.style.setProperty("--1d-h", `${sized}px`);
      wrap.style.setProperty("--1d-font", `${font}px`);
      wrap.dataset.hideLabels = showLabels ? "false" : "true";
    };

    applyFitRef.current = () => {
      lastFitKeyRef.current = "";
      applyFit();
    };

    applyFit();
    const ro = new ResizeObserver(() => {
      lastFitKeyRef.current = "";
      applyFit();
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      applyFitRef.current = () => {};
    };
  }, []);

  useLayoutEffect(() => {
    applyFitRef.current();
  });

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />

      <AlgoSidebar
        title="DP algorithms"
        items={DP_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={selectAlgorithm}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Dynamic Programming · {algorithm.group}</p>
              <h1 className={styles.title}>{algorithm.name}</h1>
            </div>
            <AlgoSidebarToggle
              open={sidebarOpen}
              onToggle={() => setSidebarOpen((value) => !value)}
            />
          </header>

          <div className={styles.controls}>
            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.play}
                onClick={() => {
                  if (atEnd) {
                    setIndex(0);
                    setPlaying(true);
                  } else setPlaying((value) => !value);
                }}
              >
                {playing ? "Pause" : atEnd ? "Replay" : "Play"}
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  setPlaying(false);
                  setIndex((current) => Math.max(current - 1, 0));
                }}
              >
                Step back
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  setPlaying(false);
                  setIndex((current) =>
                    Math.min(current + 1, Math.max(frames.length - 1, 0)),
                  );
                }}
              >
                Step
              </button>
              <button type="button" className={styles.btn} onClick={() => shuffle()}>
                Shuffle
              </button>
            </div>

            <div className={styles.sliders}>
              <label className={styles.slider}>
                <span className={styles.sliderLabel}>
                  <span>{sizeLabel}</span>
                  <span>{sizeDisplay}</span>
                </span>
                <input
                  className={styles.range}
                  type="range"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  value={size}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setSize(next);
                    shuffle(next);
                  }}
                />
              </label>
              <label className={styles.slider}>
                <span className={styles.sliderLabel}>
                  <span>Speed</span>
                  <span>{speed}</span>
                </span>
                <input
                  className={styles.range}
                  type="range"
                  min={1}
                  max={100}
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                />
              </label>
            </div>
          </div>

          <div className={styles.stageWrap}>
            <div
              ref={viewportRef}
              className={dpStyles.viewport}
              aria-label="DP table visualization"
            >
              <div
                ref={tableWrapRef}
                className={dpStyles.tableWrap}
                data-density={density}
                data-tree={isTree ? "true" : "false"}
              >
                {isStringAlgo && (input.textA || input.textB) ? (
                  <div>
                    <p className={dpStyles.rowLabel}>
                      {algorithmId === "lcs" || algorithmId === "edit-distance"
                        ? "Strings"
                        : "String"}
                    </p>
                    <div className={dpStyles.items}>
                      {input.textA ? (
                        <span className={dpStyles.itemChip} data-role="idle">
                          {algorithmId === "lcs" || algorithmId === "edit-distance"
                            ? `A = "${input.textA}"`
                            : `"${input.textA}"`}
                        </span>
                      ) : null}
                      {input.textB ? (
                        <span className={dpStyles.itemChip} data-role="idle">
                          B = "{input.textB}"
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {frameWords && frameWords.length > 0 ? (
                  <div>
                    <p className={dpStyles.rowLabel}>Dictionary</p>
                    <div className={dpStyles.items}>
                      {frameWords.map((word, i) => (
                        <span
                          key={`word-${i}`}
                          className={dpStyles.itemChip}
                          data-role={wordRoles?.[i] ?? "idle"}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {items && items.length > 0 ? (
                  <div>
                    <p className={dpStyles.rowLabel}>
                      {isSubsetSum ? "Numbers" : "Items"}
                      {input.capacity > 0
                        ? ` · ${isSubsetSum ? "target" : "capacity"} ${input.capacity}`
                        : ""}
                    </p>
                    <div className={dpStyles.items}>
                      {items.map((item, i) => (
                        <span
                          key={`item-${i}`}
                          className={dpStyles.itemChip}
                          data-role={itemRoles?.[i] ?? "idle"}
                        >
                          {isSubsetSum
                            ? `#${i} = ${item.weight}`
                            : `#${i} w=${item.weight} v=${item.value}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {isTree && treeNodes ? (
                  <div className={dpStyles.treeBlock}>
                    <svg
                      className={dpStyles.treeSvg}
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                      role="img"
                      aria-label={
                        isGraphAlgo ? "Graph DP visualization" : "Tree DP visualization"
                      }
                    >
                      {(treeEdges ?? []).map((edge) => {
                        const a = treeNodes.find((n) => n.id === edge.u);
                        const b = treeNodes.find((n) => n.id === edge.v);
                        if (!a || !b) return null;
                        const edgeRole = treeEdgeRoles?.[edge.id] ?? "idle";
                        const stroke =
                          edgeRole === "current"
                            ? ROLE_COLORS.current
                            : edgeRole === "write"
                              ? ROLE_COLORS.write
                              : edgeRole === "read"
                                ? ROLE_COLORS.read
                                : "color-mix(in srgb, var(--border) 85%, transparent)";
                        const midX = (a.x + b.x) / 2;
                        const midY = (a.y + b.y) / 2;
                        return (
                          <g key={`e-${edge.id}`}>
                            <line
                              className={graphStyles.edge}
                              x1={a.x}
                              y1={a.y}
                              x2={b.x}
                              y2={b.y}
                              stroke={stroke}
                              strokeWidth={edgeRole === "idle" ? 0.45 : 0.85}
                            />
                            {edge.weight != null ? (
                              <text
                                className={dpStyles.treeCaption}
                                x={midX}
                                y={midY - 1.2}
                                textAnchor="middle"
                                fontSize={2.2}
                              >
                                {edge.weight}
                              </text>
                            ) : null}
                          </g>
                        );
                      })}
                      {treeNodes.map((node) => {
                        const role = treeRoles?.[node.id] ?? "idle";
                        const fill = ROLE_COLORS[role];
                        return (
                          <g key={`n-${node.id}`}>
                            <circle
                              className={graphStyles.node}
                              cx={node.x}
                              cy={node.y}
                              r={4.2}
                              fill={fill}
                              stroke="color-mix(in srgb, var(--foreground) 18%, transparent)"
                              strokeWidth={0.35}
                            />
                            <text
                              className={graphStyles.nodeLabel}
                              x={node.x}
                              y={node.y + 0.35}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={3.2}
                            >
                              {node.label}
                            </text>
                            {node.caption ? (
                              <text
                                className={dpStyles.treeCaption}
                                x={node.x}
                                y={node.y + 7.2}
                                textAnchor="middle"
                                fontSize={2.4}
                              >
                                {node.caption}
                              </text>
                            ) : null}
                          </g>
                        );
                      })}
                    </svg>
                    {frame?.formula ? (
                      <p className={dpStyles.formula}>{frame.formula}</p>
                    ) : null}
                  </div>
                ) : isGrid ? (
                  <div className={dpStyles.gridBlock}>
                    {isPalindromePartition && input.textA ? (
                      <div>
                        <p className={dpStyles.rowLabel}>Characters</p>
                        <div className={dpStyles.row}>
                          {input.textA.split("").map((ch, i) => (
                            <div key={`pch-${i}`} className={dpStyles.cell}>
                              <div
                                className={dpStyles.box}
                                data-role={inputRoles?.[i] ?? "idle"}
                              >
                                {ch}
                              </div>
                              <span className={dpStyles.index}>{i}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : inputRow && inputRow.length > 0 ? (
                      <div>
                        <p className={dpStyles.rowLabel}>
                          {algorithmId === "matrix-chain"
                            ? "Dimensions"
                            : algorithmId === "burst-balloons"
                              ? "Balloons"
                              : "Sequence"}
                        </p>
                        <div className={dpStyles.row}>
                          {inputRow.map((value, i) => (
                            <div key={`seq-${i}`} className={dpStyles.cell}>
                              <div
                                className={dpStyles.box}
                                data-role={inputRoles?.[i] ?? "idle"}
                              >
                                {value}
                              </div>
                              <span className={dpStyles.index}>{i}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className={dpStyles.grids}>
                      {sourceGrid && sourceGrid.length > 0 ? (
                        <div className={dpStyles.gridPanel}>
                          <p className={dpStyles.rowLabel}>
                            {algorithmId === "dungeon-game" ? "Dungeon" : "Grid costs"}
                          </p>
                          <div className={dpStyles.grid}>
                            {sourceGrid.map((row, i) => (
                              <div key={`src-${i}`} className={dpStyles.gridRow}>
                                {row.map((value, j) => (
                                  <div
                                    key={`src-${i}-${j}`}
                                    className={dpStyles.gridCell}
                                  >
                                    <div className={dpStyles.gridBox} data-source="true">
                                      {value}
                                    </div>
                                    <span className={dpStyles.coord}>
                                      {i},{j}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className={dpStyles.gridPanel}>
                        <p className={dpStyles.rowLabel}>DP table</p>
                        <div className={dpStyles.grid}>
                          {dpGrid.map((row, i) => (
                            <div key={`dp-${i}`} className={dpStyles.gridRow}>
                              {row.map((value, j) => (
                                <div key={`dp-${i}-${j}`} className={dpStyles.gridCell}>
                                  <div
                                    className={dpStyles.gridBox}
                                    data-role={dpGridRoles[i]?.[j] ?? "idle"}
                                    data-empty={value == null}
                                  >
                                    {formatGridCell(value)}
                                  </div>
                                  <span className={dpStyles.coord}>
                                    {frame?.rowLabels?.[i] ?? i},
                                    {frame?.colLabels?.[j] ?? j}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {frame?.formula ? (
                      <p className={dpStyles.formula}>{frame.formula}</p>
                    ) : null}
                  </div>
                ) : (
                  <>
                    {sourceGrid && sourceGrid.length > 0 ? (
                      <div className={dpStyles.gridPanel}>
                        <p className={dpStyles.rowLabel}>
                          {algorithmId === "assignment" ? "Cost matrix" : "Input grid"}
                        </p>
                        <div className={dpStyles.grid}>
                          {sourceGrid.map((row, i) => (
                            <div key={`cost-${i}`} className={dpStyles.gridRow}>
                              {row.map((value, j) => (
                                <div key={`cost-${i}-${j}`} className={dpStyles.gridCell}>
                                  <div
                                    className={dpStyles.gridBox}
                                    data-source="true"
                                    data-role={dpGridRoles[i]?.[j] ?? "idle"}
                                  >
                                    {value}
                                  </div>
                                  <span className={dpStyles.coord}>
                                    {frame?.rowLabels?.[i] ?? i},J{j}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {isWordBreak && input.textA ? (
                      <div>
                        <p className={dpStyles.rowLabel}>Characters</p>
                        <div className={dpStyles.row}>
                          {input.textA.split("").map((ch, i) => (
                            <div key={`ch-${i}`} className={dpStyles.cell}>
                              <div
                                className={dpStyles.box}
                                data-role={inputRoles?.[i] ?? "idle"}
                              >
                                {ch}
                              </div>
                              <span className={dpStyles.index}>{i}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : isPalindromePartition && input.textA ? (
                      <div>
                        <p className={dpStyles.rowLabel}>Characters</p>
                        <div className={dpStyles.row}>
                          {input.textA.split("").map((ch, i) => (
                            <div key={`cut-ch-${i}`} className={dpStyles.cell}>
                              <div
                                className={dpStyles.box}
                                data-role={inputRoles?.[i] ?? "idle"}
                              >
                                {ch}
                              </div>
                              <span className={dpStyles.index}>{i}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : inputRow && inputRow.length > 0 ? (
                      <div>
                        <p className={dpStyles.rowLabel}>
                          {algorithmId === "coin-change" ? "Coins" : "Input"}
                        </p>
                        <div className={dpStyles.row}>
                          {inputRow.map((value, i) => (
                            <div key={`in-${i}`} className={dpStyles.cell}>
                              <div
                                className={dpStyles.box}
                                data-role={inputRoles?.[i] ?? "idle"}
                              >
                                {value}
                              </div>
                              <span className={dpStyles.index}>
                                {algorithmId === "coin-change" ? `c${i}` : i}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <p className={dpStyles.rowLabel}>
                        {algorithmId === "assignment" ? "dp[mask]" : "DP table"}
                      </p>
                      <div className={dpStyles.row}>
                        {table.map((value, i) => (
                          <div key={`dp-${i}`} className={dpStyles.cell}>
                            <div
                              className={dpStyles.box}
                              data-role={roles[i] ?? "idle"}
                              data-empty={
                                value == null ||
                                (!isWordBreak && isUnreachable(value, amountHint))
                              }
                            >
                              {formatTableCell(value)}
                            </div>
                            <span className={dpStyles.index}>
                              {frame?.colLabels?.[i] ?? i}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {frame?.formula ? (
                      <p className={dpStyles.formula}>{frame.formula}</p>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className={styles.progress} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <p className={styles.hint}>{frame?.hint ?? "Shuffle to begin."}</p>

            <div className={styles.metaRow}>
              <div className={styles.legend}>
                {ROLE_LABELS.map((item) => (
                  <span key={item.role} className={styles.legendItem}>
                    <span
                      className={styles.swatch}
                      style={{ backgroundColor: ROLE_COLORS[item.role] }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
              <p className={styles.live}>
                Subproblems {frame?.stats.subproblems ?? 0} · Transitions{" "}
                {frame?.stats.transitions ?? 0} · Step {frames.length ? safeIndex + 1 : 0}
                /{frames.length}
              </p>
            </div>
          </div>

          <div className={styles.detail}>
            <section>
              <h2 className={styles.detailTitle}>Definition</h2>
              <p className={styles.detailBody}>{algorithm.definition}</p>
            </section>
            <section>
              <h2 className={styles.detailTitle}>Complexity</h2>
              <dl className={styles.complexity}>
                <div>
                  <dt>Best</dt>
                  <dd>{algorithm.best}</dd>
                </div>
                <div>
                  <dt>Average</dt>
                  <dd>{algorithm.average}</dd>
                </div>
                <div>
                  <dt>Worst</dt>
                  <dd>{algorithm.worst}</dd>
                </div>
                <div>
                  <dt>Space</dt>
                  <dd>{algorithm.space}</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2 className={styles.detailTitle}>Usage</h2>
              <p className={styles.detailBody}>{algorithm.usage}</p>
            </section>
            {algorithm.code ? <CodePanel snippets={algorithm.code} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
