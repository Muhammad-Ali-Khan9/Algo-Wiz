"use client";

import { CodePanel } from "@/components/code/CodePanel";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import {
  GRAPH_KINDS,
  GRAPH_META,
  generateGraph,
  getGraphAlgo,
  runGraphAlgo,
} from "@/lib/graphs";
import type {
  EdgeRole,
  GraphAlgoId,
  GraphData,
  GraphKind,
  NodeRole,
} from "@/lib/graphs/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraphTypeSelect } from "./GraphTypeSelect";
import graphStyles from "./graph-wiz.module.scss";
import styles from "@/components/wiz/wiz.module.scss";

const MIN_SIZE = 5;
const MAX_SIZE = 9;
const DEFAULT_SIZE = 6;
const DEFAULT_SPEED = 58;
const INITIAL_SEED = 42;
const STEP_NORMAL = 26;

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
  { role: "path", label: "Path / MST" },
  { role: "start", label: "Start" },
  { role: "goal", label: "Goal" },
];

export function GraphWiz() {
  const [algorithmId, setAlgorithmId] = useState<GraphAlgoId>("bfs");
  const [graphKind, setGraphKind] = useState<GraphKind>("random");
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

  const algorithm = getGraphAlgo(algorithmId);

  const makeGraph = useCallback(
    (nextSize: number, seed: number, kind = graphKind) =>
      generateGraph(kind, nextSize, seed, { minStep: STEP_NORMAL }),
    [graphKind],
  );

  const shuffle = useCallback(
    (nextSize = size, kind = graphKind) => {
      setGraph(makeGraph(nextSize, Date.now(), kind));
      setIndex(0);
      setPlaying(false);
    },
    [size, graphKind, makeGraph],
  );

  const selectAlgorithm = useCallback(
    (id: string) => {
      const next = id as GraphAlgoId;
      const nextMeta = getGraphAlgo(next);
      if (!nextMeta.available) return;
      setSidebarOpen(false);
      if (next === algorithmId) return;
      swapTimers.current.forEach((timer) => window.clearTimeout(timer));
      swapTimers.current = [];
      setBusy(true);
      setPlaying(false);
      swapTimers.current.push(
        window.setTimeout(() => {
          setAlgorithmId(next);
          setIndex(0);
        }, 400),
        window.setTimeout(() => setBusy(false), 850),
      );
    },
    [algorithmId],
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

  const frames = useMemo(() => runGraphAlgo(algorithmId, graph), [algorithmId, graph]);

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

  const nodes = frame?.nodes ?? graph.nodes;
  const edges = frame?.edges ?? graph.edges;

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />

      <AlgoSidebar
        title="Graph algorithms"
        items={GRAPH_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={selectAlgorithm}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Graphs</p>
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
                  <span>Graph type</span>
                  <span>{GRAPH_KINDS.find((item) => item.id === graphKind)?.label}</span>
                </span>
                <GraphTypeSelect
                  value={graphKind}
                  options={GRAPH_KINDS}
                  locked={preloaderShown}
                  onChange={(next) => {
                    setGraphKind(next);
                    shuffle(size, next);
                  }}
                />
              </label>
              <label className={styles.slider}>
                <span className={styles.sliderLabel}>
                  <span>Nodes</span>
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
            <div className={graphStyles.graphStage} aria-label="Graph visualization">
              <svg className={graphStyles.graphSvg} viewBox="0 0 100 100" role="img">
                {edges.map((edge) => {
                  const role = frame?.edgeRoles[edge.id] ?? "idle";
                  const a = nodes[edge.u];
                  const b = nodes[edge.v];
                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const len = Math.hypot(dx, dy) || 1;
                  const offset = 2.4;
                  const mx = (a.x + b.x) / 2 - (dy / len) * offset;
                  const my = (a.y + b.y) / 2 + (dx / len) * offset;
                  return (
                    <g key={edge.id}>
                      <line
                        className={graphStyles.edge}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={EDGE_COLORS[role]}
                        strokeWidth={role === "idle" ? 0.45 : 0.9}
                        opacity={role === "rejected" ? 0.4 : 0.95}
                      />
                      {algorithm.weighted ? (
                        <g>
                          <circle
                            cx={mx}
                            cy={my}
                            r={1.7}
                            className={graphStyles.edgeWeightBg}
                          />
                          <text
                            className={graphStyles.edgeWeight}
                            x={mx}
                            y={my + 0.75}
                            textAnchor="middle"
                            fontSize={2.1}
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
                  const radius = nodes.length > 8 ? 2.6 : 3;
                  return (
                    <g key={node.id}>
                      <circle
                        className={graphStyles.node}
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill={color}
                        stroke="#0f172a"
                        strokeWidth={0.35}
                      />
                      <text
                        className={graphStyles.nodeLabel}
                        x={node.x}
                        y={node.y + 0.75}
                        textAnchor="middle"
                        fontSize={2.4}
                      >
                        {node.label}
                      </text>
                      {metric ? (
                        <text
                          className={graphStyles.distLabel}
                          x={node.x}
                          y={node.y - radius - 1.6}
                          textAnchor="middle"
                          fontSize={2}
                        >
                          {metric}
                        </text>
                      ) : null}
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
