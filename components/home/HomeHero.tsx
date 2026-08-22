"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AlgoMark } from "@/components/brand/AlgoMark";
import styles from "./home-hero.module.scss";

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.1 10.2V17.5M8.1 7.35v.05M16.2 17.5v-4.05c0-2.15-1.15-3.15-2.7-3.15-1.25 0-1.85.7-2.2 1.4V10.2H8.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <path
        d="M9.5 19.5c-5 1.5-5.5-2.2-7.5-2.5M15.5 21v-3.4a3 3 0 0 0-.85-2.35c2.85-.32 5.85-1.4 5.85-6.35a4.9 4.9 0 0 0-1.35-3.45 4.6 4.6 0 0 0-.1-3.4s-1.1-.35-3.55 1.35a12.2 12.2 0 0 0-6.4 0C6.55 1.7 5.45 2.05 5.45 2.05a4.6 4.6 0 0 0-.1 3.4A4.9 4.9 0 0 0 4 9.25c0 4.9 3 6.03 5.85 6.35A3 3 0 0 0 9 17.95V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconGmail() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
      <rect
        x="3.2"
        y="5.2"
        width="17.6"
        height="13.6"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4.4 7.4 7.6 6.1 7.6-6.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SOCIALS: readonly {
  href: string;
  label: string;
  icon: ReactNode;
}[] = [
  {
    href: "https://www.linkedin.com/in/muhammad-ali-khan-a238b9254/",
    label: "LinkedIn",
    icon: <IconLinkedIn />,
  },
  {
    href: "https://github.com/Muhammad-Ali-Khan9",
    label: "GitHub",
    icon: <IconGitHub />,
  },
  {
    href: "https://www.instagram.com/mobiuszero_ak",
    label: "Instagram",
    icon: <IconInstagram />,
  },
  {
    href: "mailto:muhammadalikhan0003@gmail.com",
    label: "Gmail",
    icon: <IconGmail />,
  },
];

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
    body: "Traversal, connectivity, MSTs, ordering, and analysis — BFS, DFS, Prim, Kruskal, and more on generated graph structures.",
    href: "/graphs",
    cta: "Open Graphs",
    bg: "graphs",
  },
  {
    id: "pathfinding",
    kicker: "04 — Routes",
    title: "Pathfinding",
    body: "What is the best route from A to B? Watch BFS, Dijkstra, A*, and more grow a path from start to goal.",
    href: "/pathfinding",
    cta: "Open Pathfinding",
    bg: "pathfinding",
  },
  {
    id: "trees",
    kicker: "05 — Hierarchies",
    title: "Trees",
    body: "Binary search trees, traversals, and rotations. Follow a walk down the children, watch a node light up, and see a subtree rebalance in place.",
    href: "/trees",
    cta: "Open Trees",
    bg: "trees",
  },
  {
    id: "dp",
    kicker: "06 — Overlap",
    title: "Dynamic Programming",
    body: "Fill a table of subproblems — knapsack, LCS, coin change — until the last cell is the answer. Overlapping work becomes a grid you can read.",
    href: "/dp",
    cta: "Open DP",
    bg: "dp",
  },
  {
    id: "backtracking",
    kicker: "07 — Search trees",
    title: "Backtracking",
    body: "Permutations, combinations, N-Queens, Sudoku, and more. A candidate grows until it fails, then the walk rewinds and tries the next branch.",
    href: "/backtracking",
    cta: "Open Backtracking",
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
            <div className={styles.introLayout}>
              <aside className={styles.portrait}>
                <p className={styles.madeBy}>Made By:</p>
                <Image
                  src="/personal-portrait.svg"
                  alt="Muhammad Ali Khan"
                  width={173}
                  height={405}
                  className={styles.portraitArt}
                  style={{ width: "auto", height: "auto" }}
                  loading="eager"
                  priority
                  unoptimized
                />
                <p className={styles.portraitName}>Muhammad Ali Khan</p>
                <p className={styles.portraitBio}>
                  A CS grad from GIKI, working as an associate software engineer in the
                  industry.
                </p>
              </aside>

              <div className={styles.contentInner}>
                <AlgoMark className={styles.brandMark} />
                <p className={styles.kicker}>Algorithm Visualizer</p>
                <h1 id="home-title" className={styles.title}>
                  Algorithms Wizard
                </h1>
                <p className={styles.subtitle}>
                  A visual lab for classic computer science. Instead of reading
                  pseudocode, you watch the data move — one comparison, swap, probe, or
                  hop at a time.
                </p>
                <p className={styles.lead}>
                  Play a run at speed, pause when something interesting happens, or step
                  backward and forward through the exact operations. Counts, complexity
                  bounds, and color-coded roles stay on screen so the algorithm&apos;s
                  decisions are readable, not just animated.
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
                      Idle, comparing, selected, swapping, and sorted each keep a role
                      color, so you can see why a value moved.
                    </p>
                  </li>
                  <li className={styles.point}>
                    <p className={styles.pointTitle}>Complexity in view</p>
                    <p className={styles.pointBody}>
                      Best, worst, and average bounds sit beside live comparison and write
                      counts as the trace plays.
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
                <p className={`${styles.scrollHint} ${styles.scrollHintDesktop}`}>
                  Scroll for sections
                </p>
              </div>

              <nav className={styles.socials} aria-label="Social links">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={styles.socialBtn}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      social.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={social.label}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </nav>

              <p className={`${styles.scrollHint} ${styles.scrollHintMobile}`}>
                Scroll for sections
              </p>
            </div>
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
