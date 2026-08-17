"use client";

import { CodePanel } from "@/components/code/CodePanel";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import { generateGraph, shuffleSeed } from "@/lib/graphs";
import { edgeDrawGeometry } from "@/lib/graphs/edge-geometry";
import { fitGraphViewBox, spreadNodesForRadius } from "@/lib/graphs/viewbox";
import type { EdgeRole, GraphData, NodeRole } from "@/lib/graphs/types";
import { PATH_META, getPathAlgo, runPathAlgo } from "@/lib/pathfinding";
import type { PathAlgoId } from "@/lib/pathfinding/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NodeCaption,
  parseCaptionLines,
  radiusForCaption,
} from "@/components/graphs/NodeCaption";
import graphStyles from "@/components/graphs/graph-wiz.module.scss";
import styles from "@/components/wiz/wiz.module.scss";

const MIN_SIZE = 5;
const MAX_SIZE = 11;
const MAX_SIZE_HEURISTIC = 8;
const DEFAULT_SIZE = 7;
const DEFAULT_SPEED = 58;
const INITIAL_SEED = 42;
const STEP_NORMAL = 30;
const STEP_HEURISTIC = 92;
/** Layout spacing radius for heuristic algos (display radius can grow with labels). */
const NODE_RADIUS_HEURISTIC = 10.5;

const NODE_COLORS: Record<NodeRole, string> = {
  idle: "#64748b",
  frontier: "#eab308",
  current: "#3b82f6",
  visited: "#94a3b8",
  path: "#a855f7",
  start: "#22c55e",
  goal: "#ef4444",
};

const EDGE_COLORS: Record<EdgeRole, string> = {
  idle: "#475569",
  consider: "#eab308",
  tree: "#38bdf8",
  path: "#a855f7",
  rejected: "#ef4444",
};

const NODE_LEGEND: { role: NodeRole; label: string }[] = [
  { role: "idle", label: "Idle" },
  { role: "frontier", label: "Frontier" },
  { role: "current", label: "Current" },
  { role: "visited", label: "Visited" },
  { role: "path", label: "Path" },
  { role: "start", label: "Start" },
  { role: "goal", label: "Goal" },
];

export function PathfindingWiz() {
  const [algorithmId, setAlgorithmId] = useState<PathAlgoId>("dijkstra");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [graph, setGraph] = useState<GraphData>(() =>
    generateGraph("random", DEFAULT_SIZE, INITIAL_SEED, { minStep: STEP_NORMAL }),
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getPathAlgo(algorithmId);
  const spacious = algorithm.heuristic || Boolean(algorithm.roomy);
  const maxSize = spacious ? MAX_SIZE_HEURISTIC : MAX_SIZE;

  const makeGraph = useCallback(
    (nextSize: number, seed: number, roomyLayout = spacious) =>
      generateGraph(
        "random",
        Math.min(nextSize, roomyLayout ? MAX_SIZE_HEURISTIC : MAX_SIZE),
        seed,
        {
          minStep: roomyLayout ? STEP_HEURISTIC : STEP_NORMAL,
          nodeRadius: roomyLayout ? NODE_RADIUS_HEURISTIC : undefined,
        },
      ),
    [spacious],
  );

  const shuffle = useCallback(
    (nextSize = size) => {
      setGraph(makeGraph(nextSize, shuffleSeed(nextSize * 31)));
      setIndex(0);
      setPlaying(false);
    },
    [size, makeGraph],
  );

  const selectAlgorithm = useCallback(
    (id: string) => {
      const next = id as PathAlgoId;
      const nextMeta = getPathAlgo(next);
      if (!nextMeta.available) return;
      setSidebarOpen(false);
      if (next === algorithmId) return;
      swapTimers.current.forEach((timer) => window.clearTimeout(timer));
      swapTimers.current = [];
      setBusy(true);
      setPlaying(false);
      const nextRoomy = nextMeta.heuristic || Boolean(nextMeta.roomy);
      const nextMax = nextRoomy ? MAX_SIZE_HEURISTIC : MAX_SIZE;
      const nextSize = Math.min(size, nextMax);
      swapTimers.current.push(
        window.setTimeout(() => {
          setAlgorithmId(next);
          if (nextSize !== size) setSize(nextSize);
          setGraph(makeGraph(nextSize, shuffleSeed(nextSize * 31 + 7), nextRoomy));
          setIndex(0);
        }, 400),
        window.setTimeout(() => setBusy(false), 850),
      );
    },
    [algorithmId, size, makeGraph],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), BOOT_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      swapTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const preloaderActive = booting || busy;

  useEffect(() => {
    if (preloaderActive) {
      setPreloaderShown(true);
      setPreloaderExiting(false);
      return;
    }
    setPreloaderExiting(true);
    const timer = window.setTimeout(() => {
      setPreloaderShown(false);
      setPreloaderExiting(false);
    }, PRELOAD_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [preloaderActive]);

  const frames = useMemo(() => runPathAlgo(algorithmId, graph), [algorithmId, graph]);

  const safeIndex = frames.length ? Math.min(index, frames.length - 1) : 0;
  const frame = frames[safeIndex];
  const atEnd = frames.length > 0 && safeIndex >= frames.length - 1;

  useEffect(() => {
    if (!playing || frames.length === 0 || index >= frames.length - 1) return;
    const timer = window.setTimeout(() => {
      const next = index + 1;
      setIndex(next);
      if (next >= frames.length - 1) setPlaying(false);
    }, delayForSpeed(speed));
    return () => window.clearTimeout(timer);
  }, [playing, index, speed, frames.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (atEnd) {
          setIndex(0);
          setPlaying(true);
        } else setPlaying((value) => !value);
      } else if (event.code === "ArrowRight") {
        setPlaying(false);
        setIndex((current) => Math.min(current + 1, Math.max(frames.length - 1, 0)));
      } else if (event.code === "ArrowLeft") {
        setPlaying(false);
        setIndex((current) => Math.max(current - 1, 0));
      } else if (event.key.toLowerCase() === "r") {
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

  const rawNodes = frame?.nodes ?? graph.nodes;
  const edges = frame?.edges ?? graph.edges;
  const nodeRadius = useMemo(() => {
    const base = spacious
      ? NODE_RADIUS_HEURISTIC
      : algorithm.weighted
        ? rawNodes.length > 8
          ? 4.2
          : 4.8
        : rawNodes.length > 8
          ? 3.4
          : 3.8;
    const labels = frame?.labels ?? {};
    let radius = base;
    for (const node of rawNodes) {
      const metric = labels[node.id];
      const lines = parseCaptionLines(node.label, metric).slice(0, 2);
      radius = Math.max(
        radius,
        radiusForCaption(lines, {
          minFont: spacious ? 2.7 : metric ? 2.35 : 2.35,
          comfort: spacious ? 1.36 : 1.24,
        }),
      );
    }
    return Math.round(radius * 10) / 10;
  }, [rawNodes, frame?.labels, spacious, algorithm.weighted]);
  const nodes = useMemo(
    () => spreadNodesForRadius(rawNodes, nodeRadius, spacious ? 14 : 7),
    [rawNodes, nodeRadius, spacious],
  );
  const viewBox = useMemo(
    () =>
      fitGraphViewBox(nodes, nodeRadius, {
        labelPad: spacious ? 4 : undefined,
        edgePad: Math.max(10, nodeRadius + (spacious ? 7 : 4)),
      }),
    [nodes, nodeRadius, spacious],
  );

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />

      <AlgoSidebar
        title="Pathfinding algorithms"
        items={PATH_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={selectAlgorithm}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Pathfinding</p>
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
                  <span>Nodes</span>
                  <span>{size}</span>
                </span>
                <input
                  className={styles.range}
                  type="range"
                  min={MIN_SIZE}
                  max={maxSize}
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
              className={graphStyles.graphStage}
              aria-label="Pathfinding visualization"
            >
              <svg
                className={graphStyles.graphSvg}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                role="img"
              >
                {edges.map((edge) => {
                  const role = frame?.edgeRoles[edge.id] ?? "idle";
                  const a = nodes[edge.u];
                  const b = nodes[edge.v];
                  const draw = edgeDrawGeometry(a, b, nodes, nodeRadius, {
                    showWeight: algorithm.weighted,
                    badgeR: spacious ? 2.45 : 1.8,
                  });
                  const stroke = EDGE_COLORS[role];
                  const strokeWidth = role === "idle" ? 0.45 : 0.9;
                  const opacity = role === "rejected" ? 0.4 : 0.95;
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
                            strokeWidth={strokeWidth}
                            opacity={opacity}
                          />
                        ) : (
                          <path
                            key={segIndex}
                            className={graphStyles.edge}
                            d={seg.d}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            opacity={opacity}
                          />
                        ),
                      )}
                      {algorithm.weighted ? (
                        <g>
                          <circle
                            cx={draw.mx}
                            cy={draw.my}
                            r={draw.badgeR}
                            className={graphStyles.edgeWeightBg}
                          />
                          <text
                            className={graphStyles.edgeWeight}
                            x={draw.mx}
                            y={draw.my}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={spacious ? 2.35 : 2.1}
                          >
                            {edge.weight}
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}
                {nodes.map((node) => {
                  const role = frame?.nodeRoles[node.id] ?? "idle";
                  const color = NODE_COLORS[role];
                  const metric = frame?.labels[node.id];
                  return (
                    <g key={node.id}>
                      <circle
                        className={graphStyles.node}
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius}
                        fill={color}
                        stroke="#0f172a"
                        strokeWidth={0.35}
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

            <p className={styles.hint}>{frame?.hint ?? "Shuffle a graph to begin."}</p>

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
                Visits {frame?.stats.visits ?? 0} · Relaxes {frame?.stats.relaxes ?? 0} ·
                Step {frames.length ? safeIndex + 1 : 0}/{frames.length}
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
                <div>
                  <dt>Weighted</dt>
                  <dd>{algorithm.weighted ? "Yes" : "No"}</dd>
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
