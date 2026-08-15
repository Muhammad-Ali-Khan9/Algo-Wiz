"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./home-hero.module.scss";

const SECTIONS = [
  {
    id: "sorting",
    kicker: "01 — Comparison & linear",
    title: "Sorting",
    body: "Watch bubble, merge, quick, Tim, bitonic, pigeonhole, and more rearrange bars step by step — comparisons, swaps, and sorted suffixes in color.",
    href: "/sorting",
    cta: "Open Sorting",
    bg: "sorting",
  },
  {
    id: "searching",
    kicker: "02 — Lookups",
    title: "Searching",
    body: "Linear scans, binary search, jump, interpolation, and more. See how the window shrinks until the target is found — or ruled out.",
    href: "/searching",
    cta: "Open Searching",
    bg: "searching",
  },
  {
    id: "graphs",
    kicker: "03 — Networks",
    title: "Graphs",
    body: "Walk vertices and edges with BFS, DFS, and weighted searches. Follow the frontier as it spreads across a connected world.",
    href: null,
    cta: "Coming soon",
    bg: "graphs",
  },
  {
    id: "pathfinding",
    kicker: "04 — Routes",
    title: "Pathfinding",
    body: "Grid mazes, Dijkstra, and A*. Watch a path grow around walls from start to goal, one explored cell at a time.",
    href: null,
    cta: "Coming soon",
    bg: "pathfinding",
  },
  {
    id: "trees",
    kicker: "05 — Hierarchies",
    title: "Trees",
    body: "Binary search trees, traversals, and rotations. Follow a walk down the children, watch a node light up, and see a subtree rebalance in place.",
    href: null,
    cta: "Coming soon",
    bg: "trees",
  },
  {
    id: "dp",
    kicker: "06 — Overlap",
    title: "Dynamic Programming",
    body: "Fill a table of subproblems — knapsack, LCS, coin change — until the last cell is the answer. Overlapping work becomes a grid you can read.",
    href: null,
    cta: "Coming soon",
    bg: "dp",
  },
  {
    id: "backtracking",
    kicker: "07 — Search trees",
    title: "Backtracking",
    body: "N-queens, permutations, and constraint paths. A candidate grows until it fails, then the walk rewinds and tries the next branch.",
    href: null,
    cta: "Coming soon",
    bg: "backtracking",
  },
  {
    id: "strings",
    kicker: "08 — Patterns",
    title: "String Algorithms",
    body: "KMP, Rabin–Karp, and windowed matching. Watch the pattern slide along the text and skip ahead when the prefix table says it can.",
    href: null,
    cta: "Coming soon",
    bg: "strings",
  },
] as const;

const SLIDE_COUNT = 1 + SECTIONS.length;

function slideStyle(index: number, progress: number): CSSProperties {
  const opacity = Math.max(0, 1 - Math.abs(progress - index));
  return {
    opacity,
    zIndex: index + 1,
    pointerEvents: opacity > 0.45 ? "auto" : "none",
    visibility: opacity > 0.02 ? "visible" : "hidden",
  };
}

function SectionPanel({
  section,
  style,
}: {
  section: (typeof SECTIONS)[number];
  style: CSSProperties;
}) {
  return (
    <section
      className={styles.panel}
      data-bg={section.bg}
      style={style}
      aria-labelledby={`section-${section.id}`}
      aria-hidden={(style.opacity as number) < 0.02}
    >
      <div className={styles.panelBackdrop} aria-hidden="true">
        <div className={styles.panelArt} />
        <div className={styles.panelVignette} />
      </div>
      <div className={styles.panelCopy}>
        <p className={styles.kicker}>{section.kicker}</p>
        <h2 id={`section-${section.id}`} className={styles.panelTitle}>
          {section.title}
        </h2>
        <p className={styles.panelBody}>{section.body}</p>
        {section.href ? (
          <Link href={section.href} className={styles.cta}>
            {section.cta}
          </Link>
        ) : (
          <span className={styles.soon}>{section.cta}</span>
        )}
      </div>
    </section>
  );
}

export function HomeHero() {
  const pageRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const node = pageRef.current;
    if (!node) return;
    const span = node.clientHeight;
    setProgress(span > 0 ? node.scrollTop / span : 0);
  }, []);

  useEffect(() => {
    const node = pageRef.current;
    if (!node) return;

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(updateProgress);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => {
      node.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, [updateProgress]);

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.track} style={{ ["--slides" as string]: SLIDE_COUNT }}>
        <section
          className={styles.intro}
          style={slideStyle(0, progress)}
          aria-labelledby="home-title"
        >
          <div className={styles.backdrop} aria-hidden="true">
            <div className={styles.bgGrid} />
            <div className={styles.bgCurve} />
            <div className={styles.bgFormulas} />
            <div className={styles.bgSpiral} />
            <div className={styles.bgSymbols} />
            <div className={styles.bgGeometry} />
            <div className={styles.bgVignette} />
          </div>
          <div className={styles.content}>
            <p className={styles.kicker}>Algorithm Visualizer</p>
            <h1 id="home-title" className={styles.title}>
              Algorithms Wizard
            </h1>
            <p className={styles.subtitle}>
              A visual lab for classic computer science. Instead of reading
              pseudocode, you watch the data move — one comparison, swap, probe,
              or hop at a time.
            </p>
            <p className={styles.lead}>
              Play a run at speed, pause when something interesting happens, or
              step backward and forward through the exact operations. Counts,
              complexity bounds, and color-coded roles stay on screen so the
              algorithm&apos;s decisions are readable, not just animated.
            </p>
            <ul className={styles.points}>
              <li className={styles.point}>
                <p className={styles.pointTitle}>Step through</p>
                <p className={styles.pointBody}>
                  Play, pause, shuffle, and walk a single write or swap. Space,
                  arrows, and R work as shortcuts once a visualizer is open.
                </p>
              </li>
              <li className={styles.point}>
                <p className={styles.pointTitle}>State in color</p>
                <p className={styles.pointBody}>
                  Idle, comparing, selected, swapping, and sorted each keep a
                  role color, so you can see why a value moved.
                </p>
              </li>
              <li className={styles.point}>
                <p className={styles.pointTitle}>Complexity in view</p>
                <p className={styles.pointBody}>
                  Best, worst, and average bounds sit beside live comparison and
                  write counts as the trace plays.
                </p>
              </li>
            </ul>
            <p className={styles.mapLabel}>Inside this workspace</p>
            <ul className={styles.map}>
              <li>Sorting</li>
              <li>Searching</li>
              <li>Graphs</li>
              <li>Pathfinding</li>
              <li>Trees</li>
              <li>Dynamic Programming</li>
              <li>Backtracking</li>
              <li>String Algorithms</li>
            </ul>
            <p className={styles.scrollHint}>Scroll for sections</p>
          </div>
        </section>

        {SECTIONS.map((section, index) => (
          <SectionPanel
            key={section.id}
            section={section}
            style={slideStyle(index + 1, progress)}
          />
        ))}
      </div>
    </div>
  );
}
