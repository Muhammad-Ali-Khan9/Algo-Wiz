"use client";

import { CodePanel } from "@/components/code/CodePanel";
import { AlgoSidebar, AlgoSidebarToggle } from "@/components/wiz/AlgoSidebar";
import { WizPreloader } from "@/components/wiz/WizPreloader";
import { BOOT_HOLD_MS, PRELOAD_FADE_MS, delayForSpeed } from "@/components/wiz/playback";
import { SEARCH_META, SEARCH_RUNNERS, getSearch, needsSorted } from "@/lib/searching";
import { pickTarget, searchArray } from "@/lib/searching/random";
import type { ProbeRole, SearchId } from "@/lib/searching/types";
import { arrayMax, patternedArray } from "@/lib/sorting/random";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/wiz/wiz.module.scss";

const MIN_SIZE = 8;
const MAX_SIZE = 48;
const MIN_TARGET = 8;
const MAX_TARGET = 96;
const DEFAULT_SIZE = 28;
const DEFAULT_SPEED = 62;

const ROLE_COLORS: Record<ProbeRole, string> = {
  unsearched: "#94A3B8",
  current: "#FACC15",
  compared: "#38BDF8",
  found: "#22C55E",
  eliminated: "#EF4444",
  range: "#A78BFA",
};

const ROLE_LABELS: { role: ProbeRole; label: string }[] = [
  { role: "unsearched", label: "Unsearched" },
  { role: "current", label: "Current" },
  { role: "compared", label: "Compared" },
  { role: "found", label: "Found" },
  { role: "eliminated", label: "Not found / Eliminated" },
  { role: "range", label: "Search range" },
];

function initialArray() {
  return patternedArray(DEFAULT_SIZE);
}

export function SearchingWiz() {
  const [algorithmId, setAlgorithmId] = useState<SearchId>("linear");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [array, setArray] = useState(initialArray);
  const [target, setTarget] = useState(
    () => initialArray()[Math.floor(DEFAULT_SIZE / 2)] ?? 40,
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preloaderShown, setPreloaderShown] = useState(true);
  const [preloaderExiting, setPreloaderExiting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const swapTimers = useRef<number[]>([]);

  const algorithm = getSearch(algorithmId);

  const shuffle = useCallback(
    (nextSize = size, id = algorithmId) => {
      const next = searchArray(nextSize, needsSorted(id));
      setArray(next);
      setTarget(pickTarget(next));
      setIndex(0);
      setPlaying(false);
    },
    [algorithmId, size],
  );

  const selectAlgorithm = useCallback(
    (id: SearchId) => {
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
          if (needsSorted(id)) {
            setArray((current) => current.slice().sort((a, b) => a - b));
          }
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

  const frames = useMemo(() => {
    if (!array.length) return [];
    return SEARCH_RUNNERS[algorithmId](array, target);
  }, [algorithmId, array, target]);

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
        title="Searching algorithms"
        items={SEARCH_META}
        activeId={algorithmId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(id) => selectAlgorithm(id as SearchId)}
      />

      <div className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.kicker}>Searching</p>
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
                  Target <b>{target}</b>
                </span>
                <input
                  className={styles.range}
                  type="range"
                  min={MIN_TARGET}
                  max={MAX_TARGET}
                  value={target}
                  onChange={(event) => {
                    setTarget(Number(event.target.value));
                    setIndex(0);
                    setPlaying(false);
                  }}
                />
              </label>
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
            </div>
          </div>

          <div className={styles.stageWrap}>
            <div className={styles.stage} aria-label="Array visualization">
              {(frame?.array ?? []).map((value, barIndex) => {
                const role = frame?.roles[barIndex] ?? "unsearched";
                const color = ROLE_COLORS[role];
                return (
                  <div key={barIndex} className={styles.barCol}>
                    <div
                      className={styles.bar}
                      data-role={role}
                      style={{
                        ["--bar-size" as string]: `${Math.max((value / maxValue) * 100, 6)}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 12px ${color}59`,
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
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <p className={styles.hint}>{frame?.hint ?? "Shuffle an array to begin."}</p>

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
                Probes {frame?.stats.probes ?? 0}
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
                  <dt>Sorted</dt>
                  <dd>{algorithm.sortedInput ? "Yes" : "No"}</dd>
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
