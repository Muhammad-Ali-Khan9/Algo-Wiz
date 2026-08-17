"use client";

import { CodePanel } from "@/components/code/CodePanel";
import {
  NodeCaption,
  parseCaptionLines,
  radiusForCaption,
} from "@/components/graphs/NodeCaption";
import graphStyles from "@/components/graphs/graph-wiz.module.scss";
import treeStyles from "@/components/trees/trees-wiz.module.scss";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import styles from "@/components/wiz/wiz.module.scss";
import { edgeDrawGeometry } from "@/lib/graphs/edge-geometry";
import { fitGraphViewBox, spreadNodesForRadius } from "@/lib/graphs/viewbox";
import {
  TREE_META,
  generateTreeInput,
  getTreeAlgo,
  runTreeAlgo,
  shuffleSeed,
} from "@/lib/trees";
import type { TreeAlgoId, TreeInput, TreeNodeRole } from "@/lib/trees/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MIN_SIZE = 5;
const MAX_SIZE = 12;
const DEFAULT_SIZE = 7;
const DEFAULT_SPEED = 58;
const INITIAL_SEED = 42;

const NODE_COLORS: Record<TreeNodeRole, string> = {
  idle: "#64748b",
  frontier: "#eab308",
  current: "#3b82f6",
  visited: "#94a3b8",
  path: "#a855f7",
  start: "#22c55e",
  goal: "#ef4444",
};

const NODE_LEGEND: { role: TreeNodeRole; label: string }[] = [
  { role: "idle", label: "Idle" },
  { role: "frontier", label: "Frontier" },
  { role: "current", label: "Current" },
  { role: "visited", label: "Visited" },
  { role: "path", label: "Path" },
  { role: "start", label: "Start / Root" },
  { role: "goal", label: "Goal" },
];

export function TreesWiz() {
  const [algorithmId, setAlgorithmId] = useState<TreeAlgoId>("bst-insert");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [input, setInput] = useState<TreeInput>(() =>
    generateTreeInput("bst", DEFAULT_SIZE, INITIAL_SEED),
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getTreeAlgo(algorithmId);

  const shuffle = useCallback(
    (nextSize = size, kind = algorithm.kind) => {
      setInput(generateTreeInput(kind, nextSize, shuffleSeed(nextSize * 17 + 3)));
      setIndex(0);
      setPlaying(false);
    },
    [size, algorithm.kind],
  );

  const selectAlgorithm = useCallback(
    (next: string) => {
      if (next === algorithmId) {
        setSidebarOpen(false);
        return;
      }
      const nextMeta = getTreeAlgo(next as TreeAlgoId);
      if (nextMeta.available === false) return;
      setSidebarOpen(false);
      setPlaying(false);
      setBusy(true);
      for (const id of swapTimers.current) window.clearTimeout(id);
      swapTimers.current = [];
      swapTimers.current.push(
        window.setTimeout(() => {
          setAlgorithmId(nextMeta.id);
          setInput(generateTreeInput(nextMeta.kind, size, shuffleSeed(size * 31 + 7)));
          setIndex(0);
        }, 400),
        window.setTimeout(() => setBusy(false), 850),
      );
    },
    [algorithmId, size],
  );

  const frames = useMemo(() => {
    try {
      return runTreeAlgo(algorithmId, input);
    } catch {
      return [];
    }
  }, [algorithmId, input]);

  const safeIndex = Math.min(index, Math.max(frames.length - 1, 0));
  const frame = frames[safeIndex];
  const atEnd = frames.length > 0 && safeIndex >= frames.length - 1;

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

  const rawNodes = frame?.nodes ?? [];
  const edges = frame?.edges ?? [];
  const isRb = algorithm.kind === "rb";
  const isAvl = algorithm.kind === "avl";

  const nodeRadius = useMemo(() => {
    const base = isAvl || algorithm.kind === "trie" ? 5.2 : 4.6;
    const labels = frame?.labels ?? {};
    let radius = base;
    for (const node of rawNodes) {
      const metric = labels[node.id];
      const lines = parseCaptionLines(node.label, metric).slice(0, 2);
      radius = Math.max(radius, radiusForCaption(lines, { minFont: 2.3, comfort: 1.22 }));
    }
    return Math.round(radius * 10) / 10;
  }, [rawNodes, frame?.labels, isAvl, algorithm.kind]);

  const nodes = useMemo(
    () => spreadNodesForRadius(rawNodes, nodeRadius, 8),
    [rawNodes, nodeRadius],
  );

  const viewBox = useMemo(
    () =>
      fitGraphViewBox(nodes, nodeRadius, {
        edgePad: Math.max(8, nodeRadius + 4),
      }),
    [nodes, nodeRadius],
  );

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />

      <AlgoSidebar
        title="Tree algorithms"
        items={TREE_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={selectAlgorithm}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Trees · {algorithm.group}</p>
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
                  <span>Size</span>
                  <span>{size}</span>
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
            <div className={graphStyles.graphStage} aria-label="Tree visualization">
              <svg
                className={graphStyles.graphSvg}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                role="img"
              >
                {edges.map((edge, edgeIndex) => {
                  const role = frame?.edgeRoles[edgeIndex] ?? "idle";
                  const a = nodes.find((n) => n.id === edge.u);
                  const b = nodes.find((n) => n.id === edge.v);
                  if (!a || !b) return null;
                  const draw = edgeDrawGeometry(a, b, nodes, nodeRadius, {
                    showWeight: false,
                  });
                  const stroke =
                    role === "path"
                      ? "#a855f7"
                      : role === "consider"
                        ? "#eab308"
                        : role === "tree"
                          ? "#38bdf8"
                          : "#475569";
                  return (
                    <g key={edge.id}>
                      {draw.segments.map((seg, segIndex) =>
                        seg.kind === "line" ? (
                          <line
                            key={segIndex}
                            className={graphStyles.edge}
                            x1={seg.x1}
                            y1={seg.y1}
                            x2={seg.x2}
                            y2={seg.y2}
                            stroke={stroke}
                            strokeWidth={role === "idle" ? 0.45 : 0.85}
                          />
                        ) : (
                          <path
                            key={segIndex}
                            className={graphStyles.edge}
                            d={seg.d}
                            stroke={stroke}
                            strokeWidth={role === "idle" ? 0.45 : 0.85}
                            fill="none"
                          />
                        ),
                      )}
                    </g>
                  );
                })}
                {nodes.map((node, nodeIndex) => {
                  const role = frame?.nodeRoles[nodeIndex] ?? "idle";
                  const fill =
                    isRb &&
                    (role === "idle" || role === "visited") &&
                    frame?.fills?.[node.id]
                      ? frame.fills[node.id]
                      : NODE_COLORS[role];
                  const metric = frame?.labels[node.id];
                  return (
                    <g key={node.id}>
                      <circle
                        className={graphStyles.node}
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius}
                        fill={fill}
                        stroke={isRb ? "#e2e8f0" : "#0f172a"}
                        strokeWidth={isRb ? 0.45 : 0.35}
                      />
                      <NodeCaption
                        x={node.x}
                        y={node.y}
                        radius={nodeRadius}
                        idLabel={node.label}
                        metric={metric}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className={styles.progress} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <p className={styles.hint}>{frame?.hint ?? "Shuffle a tree to begin."}</p>

            {isRb ? (
              <div className={treeStyles.rbHint} aria-label="Red-black legend">
                <span
                  className={treeStyles.rbSwatch}
                  style={{ ["--swatch" as string]: "#ef4444" }}
                >
                  Red
                </span>
                <span
                  className={treeStyles.rbSwatch}
                  style={{ ["--swatch" as string]: "#0f172a" }}
                >
                  Black
                </span>
              </div>
            ) : null}

            {(frame?.frontier?.length ?? 0) > 0 ? (
              <div className={graphStyles.frontierStrip} aria-label="Frontier">
                {frame!.frontier.map((id, chipIndex) => (
                  <span key={`${id}-${chipIndex}`} className={graphStyles.frontierChip}>
                    {id}
                  </span>
                ))}
              </div>
            ) : null}

            <div className={styles.metaRow}>
              <div className={styles.legend}>
                {NODE_LEGEND.map((item) => (
                  <span key={item.role} className={styles.legendItem}>
                    <span
                      className={styles.swatch}
                      style={{ backgroundColor: NODE_COLORS[item.role] }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
              <p className={styles.live}>
                Visits {frame?.stats.visits ?? 0} · Compares {frame?.stats.compares ?? 0}{" "}
                · Rotations {frame?.stats.rotations ?? 0} · Step{" "}
                {frames.length ? safeIndex + 1 : 0}/{frames.length}
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
