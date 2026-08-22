"use client";

import closeIcon from "@/public/icons/close.svg";
import graphIcon from "@/public/icons/graph.svg";
import homeIcon from "@/public/icons/home.svg";
import menuIcon from "@/public/icons/menu.svg";
import moonIcon from "@/public/icons/moon.svg";
import pathfindingIcon from "@/public/icons/pathfinding.svg";
import searchIcon from "@/public/icons/search.svg";
import sortIcon from "@/public/icons/sort.svg";
import sunIcon from "@/public/icons/sun.svg";
import treeIcon from "@/public/icons/tree.svg";
import dpIcon from "@/public/icons/dp.svg";
import backtrackingIcon from "@/public/icons/backtracking.svg";
import { AlgoMark } from "@/components/brand/AlgoMark";
import { useTheme } from "@/components/theme/ThemeProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./side-nav.module.scss";

const SECTIONS = [
  { href: "/", label: "Home", icon: homeIcon },
  { href: "/sorting", label: "Sorting", icon: sortIcon },
  { href: "/searching", label: "Searching", icon: searchIcon },
  { href: "/graphs", label: "Graphs", icon: graphIcon },
  { href: "/pathfinding", label: "Pathfinding", icon: pathfindingIcon },
  { href: "/trees", label: "Trees", icon: treeIcon },
  { href: "/dp", label: "DP", icon: dpIcon },
  { href: "/backtracking", label: "Backtracking", icon: backtrackingIcon },
] as const;

export function SideNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.menuBtn}
        aria-expanded={open}
        aria-controls="global-rail"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <Image
          src={open ? closeIcon : menuIcon}
          alt=""
          width={18}
          height={18}
          className={styles.icon}
          loading="eager"
          unoptimized
        />
      </button>
      <div
        className={styles.scrim}
        data-open={open}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />
      <nav
        id="global-rail"
        className={styles.rail}
        data-open={open}
        aria-label="Sections"
      >
        <Link
          href="/"
          className={styles.brandLink}
          aria-label="Algorithms Wizard home"
          title="Algorithms Wizard"
        >
          <AlgoMark className={styles.brand} />
        </Link>
        <p className={styles.label}>Menu</p>
        {SECTIONS.map((section) => {
          const active =
            section.href === "/" ? pathname === "/" : pathname.startsWith(section.href);

          return (
            <Link
              key={section.href}
              href={section.href}
              className={styles.btn}
              data-active={active}
              aria-current={active ? "page" : undefined}
              title={section.label}
              aria-label={section.label}
            >
              <Image
                src={section.icon}
                alt=""
                width={18}
                height={18}
                className={styles.icon}
                loading="eager"
                unoptimized
              />
            </Link>
          );
        })}
        <div className={styles.spacer} />
        <div
          className={styles.themeCapsule}
          data-mode={theme}
          role="radiogroup"
          aria-label="Theme"
        >
          <span className={styles.themeThumb} aria-hidden="true" />
          <button
            type="button"
            className={styles.themeBtn}
            data-active={theme === "light"}
            aria-checked={theme === "light"}
            role="radio"
            title="Light theme"
            aria-label="Light theme"
            onClick={() => setTheme("light")}
          >
            <Image
              src={sunIcon}
              alt=""
              width={15}
              height={15}
              className={styles.themeIcon}
              loading="eager"
              unoptimized
            />
          </button>
          <button
            type="button"
            className={styles.themeBtn}
            data-active={theme === "dark"}
            aria-checked={theme === "dark"}
            role="radio"
            title="Dark theme"
            aria-label="Dark theme"
            onClick={() => setTheme("dark")}
          >
            <Image
              src={moonIcon}
              alt=""
              width={15}
              height={15}
              className={styles.themeIcon}
              loading="eager"
              unoptimized
            />
          </button>
        </div>
      </nav>
    </div>
  );
}
