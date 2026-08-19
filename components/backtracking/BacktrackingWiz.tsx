"use client";

import { CodePanel } from "@/components/code/CodePanel";
import btStyles from "@/components/backtracking/backtracking-wiz.module.scss";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import styles from "@/components/wiz/wiz.module.scss";
import {
  BACKTRACKING_META,
  generateBacktrackingInput,
  getBacktrackingAlgo,
  runBacktrackingAlgo,
  shuffleSeed,
} from "@/lib/backtracking";
import type {
  BacktrackingAlgoId,
  BacktrackingInput,
  BtRole,
} from "@/lib/backtracking/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MIN_SIZE = 5;
const MAX_SIZE = 16;
const DEFAULT_SIZE = 10;
const DEFAULT_SPEED = 58;
const INITIAL_SEED = 42;

const ROLE_COLORS: Record<BtRole, string> = {
  idle: "#64748b",
  current: "#3b82f6",
  choose: "#22c55e",
  skip: "#ef4444",
  backtrack: "#eab308",
  solution: "#a855f7",
  fixed: "#94a3b8",
};

const ROLE_LABELS: { role: BtRole; label: string }[] = [
  { role: "idle", label: "Idle" },
  { role: "current", label: "Current" },
  { role: "choose", label: "Chosen" },
  { role: "skip", label: "Skip" },
  { role: "backtrack", label: "Backtrack" },
  { role: "solution", label: "Solution" },
  { role: "fixed", label: "Fixed" },
];

export function BacktrackingWiz() {
  const [algorithmId, setAlgorithmId] = useState<BacktrackingAlgoId>("permutations");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [input, setInput] = useState<BacktrackingInput>(() =>
    generateBacktrackingInput("permutations", DEFAULT_SIZE, INITIAL_SEED),
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getBacktrackingAlgo(algorithmId);

  const shuffle = useCallback(
    (nextSize = size, id = algorithmId) => {
      setInput(generateBacktrackingInput(id, nextSize, shuffleSeed(nextSize * 23 + 7)));
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
      const nextMeta = getBacktrackingAlgo(next as BacktrackingAlgoId);
      if (nextMeta.available === false) return;
      setSidebarOpen(false);
      swapTimers.current.forEach((timer) => window.clearTimeout(timer));
      swapTimers.current = [];
      setBusy(true);
      setPlaying(false);
      swapTimers.current.push(
        window.setTimeout(() => {
          setAlgorithmId(next as BacktrackingAlgoId);
          setInput(
            generateBacktrackingInput(
              next as BacktrackingAlgoId,
              size,
              shuffleSeed(size * 23 + 7),
            ),
          );
          setIndex(0);
        }, 400),
        window.setTimeout(() => setBusy(false), 850),
      );
    },
    [algorithmId, size],
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

  const frames = useMemo(
    () => runBacktrackingAlgo(algorithmId, input),
    [algorithmId, input],
  );

  const safeIndex = Math.min(index, Math.max(frames.length - 1, 0));
  const frame = frames[safeIndex];
  const atEnd = frames.length > 0 && safeIndex >= frames.length - 1;
  const progress = frames.length ? ((safeIndex + 1) / frames.length) * 100 : 0;

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    if (safeIndex >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, frames.length - 1));
    }, delayForSpeed(speed));
    return () => window.clearTimeout(timer);
  }, [playing, safeIndex, frames.length, speed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === " ") {
        event.preventDefault();
        if (atEnd) {
          setIndex(0);
          setPlaying(true);
        } else {
          setPlaying((value) => !value);
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setPlaying(false);
        setIndex((current) => Math.min(current + 1, Math.max(frames.length - 1, 0)));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPlaying(false);
        setIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        shuffle();
      } else if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [atEnd, frames.length, shuffle]);

  const isCsp =
    algorithmId === "n-queens" ||
    algorithmId === "sudoku" ||
    algorithmId === "graph-coloring" ||
    algorithmId === "crossword";

  const sizeLabel =
    algorithmId === "combinations"
      ? "n / k"
      : algorithmId === "combination-sum"
        ? "Candidates"
        : algorithmId === "n-queens"
          ? "Board"
          : algorithmId === "sudoku"
            ? "Puzzle"
            : algorithmId === "graph-coloring"
              ? "Nodes"
              : algorithmId === "crossword"
                ? "Grid"
                : "n";

  const sizeDisplay =
    algorithmId === "combinations"
      ? `${input.values.length} · k=${input.k}`
      : algorithmId === "combination-sum"
        ? `${input.values.length} · T=${input.target}`
        : algorithmId === "n-queens" ||
            algorithmId === "sudoku" ||
            algorithmId === "crossword"
          ? `${input.n}×${input.n}`
          : algorithmId === "graph-coloring"
            ? `${input.n} · k=${input.k}`
            : input.values.length;

  const found = frame?.found ?? [];
  const foundLabels = frame?.foundLabels ?? [];
  const showAllSolutions = algorithmId === "permutations" || algorithmId === "n-queens";
  const showLabels = foundLabels.length
    ? showAllSolutions
      ? foundLabels
      : foundLabels.slice(-8)
    : (showAllSolutions ? found : found.slice(-8)).map((sol) =>
        sol.length === 0 ? "∅" : `[${sol.join(", ")}]`,
      );

  const board = frame?.board;
  const boardRoles = frame?.boardRoles;
  const nodes = frame?.nodes;
  const edges = frame?.edges;
  const nodeRoles = frame?.nodeRoles;
  const isGraph = Boolean(nodes?.length);
  const candidateValues =
    algorithmId === "crossword" && input.words?.length
      ? input.words
      : (frame?.candidates ?? input.values);

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />
      <AlgoSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Algorithms"
        items={BACKTRACKING_META}
        activeId={algorithmId}
        onSelect={selectAlgorithm}
      />
      <div className={styles.main} data-busy={busy || booting}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>Backtracking · {algorithm.group}</p>
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
                    return;
                  }
                  setPlaying((value) => !value);
                }}
                disabled={frames.length === 0}
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
                  if (atEnd) {
                    setIndex(0);
                    setPlaying(true);
                    return;
                  }
                  setPlaying(false);
                  setIndex((current) =>
                    Math.min(current + 1, Math.max(frames.length - 1, 0)),
                  );
                }}
              >
                Step ahead
              </button>
              <button type="button" className={styles.btn} onClick={() => shuffle()}>
                Shuffle
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  setIndex(0);
                  setPlaying(false);
                }}
              >
                Reset
              </button>
            </div>

            <div className={styles.sliders}>
              <label className={styles.slider}>
                <span className={styles.sliderLabel}>
                  {sizeLabel} <b>{sizeDisplay}</b>
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
                  Speed <b>{speed}</b>
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
            <div className={btStyles.stage} aria-label="Backtracking visualization">
              {isGraph ? (
                <div className={btStyles.panel}>
                  <p className={btStyles.panelLabel}>Graph</p>
                  <svg className={btStyles.graph} viewBox="0 0 100 100" role="img">
                    {(edges ?? []).map((edge) => {
                      const u = nodes?.find((n) => n.id === edge.u);
                      const v = nodes?.find((n) => n.id === edge.v);
                      if (!u || !v) return null;
                      return (
                        <line
                          key={edge.id}
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          className={btStyles.graphEdge}
                        />
                      );
                    })}
                    {(nodes ?? []).map((node, i) => {
                      const role = nodeRoles?.[i] ?? "idle";
                      const color = ROLE_COLORS[role];
                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={6.5}
                            fill={`${color}33`}
                            stroke={color}
                            strokeWidth={1.4}
                          />
                          <text
                            x={node.x}
                            y={node.y + 1.2}
                            textAnchor="middle"
                            className={btStyles.graphLabel}
                            fill={color}
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : null}

              {board ? (
                <div className={btStyles.panel}>
                  <p className={btStyles.panelLabel}>Board</p>
                  <div
                    className={btStyles.board}
                    style={{
                      gridTemplateColumns: `repeat(${board[0]?.length ?? 1}, minmax(0, 1fr))`,
                    }}
                  >
                    {board.map((row, r) =>
                      row.map((cell, c) => {
                        const role = boardRoles?.[r]?.[c] ?? "idle";
                        const color = ROLE_COLORS[role];
                        const blocked = cell === "#";
                        return (
                          <span
                            key={`${r}-${c}`}
                            className={btStyles.cell}
                            data-role={role}
                            data-blocked={blocked ? "true" : "false"}
                            style={
                              blocked
                                ? undefined
                                : {
                                    backgroundColor: `${color}22`,
                                    borderColor: color,
                                    color,
                                  }
                            }
                          >
                            {blocked ? "" : (cell ?? "")}
                          </span>
                        );
                      }),
                    )}
                  </div>
                </div>
              ) : null}

              {!isCsp || algorithmId === "crossword" || !board ? (
                <div className={btStyles.panel}>
                  <p className={btStyles.panelLabel}>
                    {algorithmId === "crossword" ? "Word bank" : "Candidates"}
                  </p>
                  <div className={btStyles.chips}>
                    {candidateValues.length === 0 ? (
                      <span className={btStyles.empty}>—</span>
                    ) : (
                      candidateValues.map((value, i) => {
                        const role = frame?.roles[i] ?? "idle";
                        const color = ROLE_COLORS[role];
                        return (
                          <span
                            key={`${value}-${i}`}
                            className={btStyles.chip}
                            data-role={role}
                            style={{
                              backgroundColor: `${color}22`,
                              borderColor: color,
                              color,
                              boxShadow: `0 0 10px ${color}33`,
                            }}
                          >
                            {value}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : null}

              {!isCsp ? (
                <div className={btStyles.panel}>
                  <p className={btStyles.panelLabel}>
                    Path
                    {frame ? ` · depth ${frame.depth}` : ""}
                  </p>
                  <div className={btStyles.chips}>
                    {(frame?.path ?? []).length === 0 ? (
                      <span className={btStyles.empty}>∅</span>
                    ) : (
                      (frame?.path ?? []).map((value, i) => {
                        const role = frame?.pathRoles[i] ?? "choose";
                        const color = ROLE_COLORS[role];
                        return (
                          <span
                            key={`p-${i}-${value}`}
                            className={btStyles.chip}
                            data-role={role}
                            style={{
                              backgroundColor: `${color}22`,
                              borderColor: color,
                              color,
                            }}
                          >
                            {value}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : null}

              <div className={btStyles.panel}>
                <p className={btStyles.panelLabel}>
                  Solutions <b>{frame?.stats.solutions ?? 0}</b>
                  {!showAllSolutions && foundLabels.length > showLabels.length
                    ? ` · showing last ${showLabels.length}`
                    : showAllSolutions && showLabels.length > 0
                      ? ` · all ${showLabels.length}`
                      : ""}
                </p>
                <div
                  className={btStyles.solutions}
                  data-all={showAllSolutions ? "true" : "false"}
                >
                  {showLabels.length === 0 ? (
                    <span className={btStyles.empty}>None yet</span>
                  ) : (
                    showLabels.map((label, i) => (
                      <span key={`s-${i}-${label}`} className={btStyles.sol}>
                        {label}
                      </span>
                    ))
                  )}
                </div>
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
                    <i
                      className={styles.swatch}
                      style={{ backgroundColor: ROLE_COLORS[item.role] }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
              <p className={styles.live}>
                Calls {frame?.stats.calls ?? 0}
                <span aria-hidden="true"> · </span>
                Choices {frame?.stats.choices ?? 0}
                <span aria-hidden="true"> · </span>
                Backtracks {frame?.stats.backtracks ?? 0}
                <span aria-hidden="true"> · </span>
                Step {frames.length ? `${safeIndex + 1}/${frames.length}` : "0/0"}
              </p>
            </div>
          </div>

          <article className={styles.detail} aria-label={`${algorithm.name} notes`}>
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
          </article>
        </div>
      </div>
    </div>
  );
}
