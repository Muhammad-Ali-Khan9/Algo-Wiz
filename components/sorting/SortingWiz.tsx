"use client";

import { CodePanel } from "@/components/code/CodePanel";
import {
  AlgoSidebar,
  AlgoSidebarToggle,
} from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import {
  BOOT_HOLD_MS,
  PRELOAD_FADE_MS,
  delayForSpeed,
} from "@/components/wiz/playback";
import { ALGORITHM_META, RUNNERS, bucketSort, getAlgorithm } from "@/lib/sorting";
import { arrayMax, patternedArray, randomArray } from "@/lib/sorting/random";
import type { AlgorithmId, BarRole } from "@/lib/sorting/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/wiz/wiz.module.scss";

const MIN_SIZE = 8;
const MAX_SIZE = 48;
const MIN_BUCKETS = 1;
const MAX_BUCKETS = 64;
const DEFAULT_SIZE = 28;
const DEFAULT_SPEED = 62;
const DEFAULT_BUCKETS = 8;

const ROLE_COLORS: Record<BarRole, string> = {
  idle: "#22c55e",
  compare: "#eab308",
  key: "#3b82f6",
  min: "#3b82f6",
  pivot: "#3b82f6",
  write: "#3b82f6",
  swap: "#ef4444",
  sorted: "#a855f7",
};

const ROLE_LABELS: { role: BarRole; label: string }[] = [
  { role: "idle", label: "Normal" },
  { role: "compare", label: "Comparing" },
  { role: "key", label: "Selected" },
  { role: "swap", label: "Swapping" },
  { role: "sorted", label: "Sorted" },
];

export function SortingWiz() {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>("bubble");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [bucketCount, setBucketCount] = useState(DEFAULT_BUCKETS);
  const [array, setArray] = useState(() => patternedArray(DEFAULT_SIZE));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getAlgorithm(algorithmId);

  const shuffle = useCallback((nextSize = size) => {
    setArray(randomArray(nextSize));
    setIndex(0);
    setPlaying(false);
  }, [size]);

  const selectAlgorithm = useCallback((id: AlgorithmId) => {
    setSidebarOpen(false);
    if (id === algorithmId) return;
    swapTimers.current.forEach((timer) => window.clearTimeout(timer));
    swapTimers.current = [];
    setBusy(true);
    setPlaying(false);
    swapTimers.current.push(
      window.setTimeout(() => {
        setAlgorithmId(id);
        setIndex(0);
      }, 400),
      window.setTimeout(() => setBusy(false), 850),
    );
  }, [algorithmId]);

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

  const frames = useMemo(() => {
    if (!array.length) return [];
    if (algorithmId === "bucket") return bucketSort(array, bucketCount);
    return RUNNERS[algorithmId](array);
  }, [algorithmId, array, bucketCount]);

  const safeIndex = frames.length ? Math.min(index, frames.length - 1) : 0;
  const frame = frames[safeIndex];
  const maxValue = arrayMax(frame?.array ?? array);
  const atEnd = frames.length > 0 && safeIndex >= frames.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (frames.length === 0) return;
    if (index >= frames.length - 1) return;

    const timer = window.setTimeout(() => {
      const next = index + 1;
      setIndex(next);
      if (next >= frames.length - 1) {
        setPlaying(false);
      }
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
        } else {
          setPlaying((value) => !value);
        }
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

  return (
    <div className={styles.shell}>
      <WizPreloader shown={preloaderShown} exiting={preloaderExiting} />

      <AlgoSidebar
        title="Sorting algorithms"
        items={ALGORITHM_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(id) => selectAlgorithm(id as AlgorithmId)}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Sorting</p>
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
              <button
                type="button"
                className={styles.btn}
                onClick={() => shuffle()}
              >
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
                  Size <b>{size}</b>
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
              {algorithmId === "bucket" ? (
                <label className={styles.slider}>
                  <span className={styles.sliderLabel}>
                    Buckets <b>{bucketCount}</b>
                  </span>
                  <input
                    className={styles.range}
                    type="range"
                    min={MIN_BUCKETS}
                    max={MAX_BUCKETS}
                    value={bucketCount}
                    onChange={(event) => {
                      setBucketCount(Number(event.target.value));
                      setIndex(0);
                      setPlaying(false);
                    }}
                  />
                </label>
              ) : null}
            </div>
          </div>

          <div className={styles.stageWrap}>
            <div className={styles.stage} aria-label="Array visualization">
              {(frame?.array ?? []).map((value, barIndex) => {
                const role = frame?.roles[barIndex] ?? "idle";
                return (
                  <div key={barIndex} className={styles.barCol}>
                    <div
                      className={styles.bar}
                      data-role={role}
                      style={{
                        ["--bar-size" as string]: `${Math.max((value / maxValue) * 100, 6)}%`,
                        backgroundColor: ROLE_COLORS[role],
                      }}
                      title={String(value)}
                    >
                      <span className={styles.barValue}>{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.progress} aria-hidden="true">
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className={styles.hint}>
              {frame?.hint ?? "Shuffle an array to begin."}
            </p>

            {frame?.auxBuckets && frame.auxBuckets.length > 0 ? (
              <div className={styles.aux} aria-label="Auxiliary buckets">
                {frame.auxBuckets.map((bucket) => (
                  <div key={bucket.label} className={styles.bucket}>
                    <div className={styles.bucketVessel}>
                      <div className={styles.bucketStack}>
                        {bucket.values.map((value, valueIndex) => (
                          <span
                            key={`${bucket.label}-${valueIndex}`}
                            className={styles.chip}
                            title={String(value)}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={styles.bucketLabel}>{bucket.label}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={styles.metaRow}>
              <div className={styles.legend}>
                {ROLE_LABELS.map((item) => (
                  <span key={item.role} className={styles.legendItem}>
                    <i
                      className={styles.swatch}
                      data-role={item.role}
                      style={{ backgroundColor: ROLE_COLORS[item.role] }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
              <p className={styles.live}>
                Comparisons {frame?.stats.comparisons ?? 0}
                <span aria-hidden="true"> · </span>
                Writes {frame?.stats.writes ?? 0}
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
                <div>
                  <dt>Stable</dt>
                  <dd>{algorithm.stable ? "Yes" : "No"}</dd>
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
