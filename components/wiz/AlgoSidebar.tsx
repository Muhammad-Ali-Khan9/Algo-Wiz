"use client";

import closeIcon from "@/public/icons/close.svg";
import listIcon from "@/public/icons/list.svg";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./wiz.module.scss";

export type AlgoListItem = {
  id: string;
  name: string;
  average: string;
  worst: string;
  group?: string;
  available?: boolean;
};

export function AlgoSidebar({
  title,
  items,
  activeId,
  open,
  onClose,
  onSelect,
}: {
  title: string;
  items: readonly AlgoListItem[];
  activeId: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const groups: { label: string | null; items: AlgoListItem[] }[] = [];
  const groupIndex = new Map<string | null, number>();
  for (const item of items) {
    const label = item.group ?? null;
    const existing = groupIndex.get(label);
    if (existing != null) {
      groups[existing]!.items.push(item);
    } else {
      groupIndex.set(label, groups.length);
      groups.push({ label, items: [item] });
    }
  }

  return (
    <>
      <div
        className={styles.sidebarScrim}
        data-open={open}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside className={styles.sidebar} data-open={open} aria-label={title}>
        <div className={styles.sidebarInner}>
          <div className={styles.sidebarHead}>
            <p className={styles.sideTitle}>Algorithms</p>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close algorithms"
              onClick={onClose}
            >
              <Image
                src={closeIcon}
                alt=""
                width={16}
                height={16}
                className={styles.sidebarCloseIcon}
                unoptimized
              />
            </button>
          </div>
          {groups.map((group, index) => (
            <div key={`${group.label ?? "all"}-${index}`} className={styles.algoGroup}>
              {group.label ? (
                <p className={styles.algoGroupLabel}>{group.label}</p>
              ) : null}
              {group.items.map((item) => {
                const available = item.available !== false;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.algoBtn}
                    data-active={item.id === activeId}
                    data-soon={!available}
                    disabled={!available}
                    onClick={() => available && onSelect(item.id)}
                  >
                    <span className={styles.algoName}>
                      {item.name}
                      {!available ? <span className={styles.algoSoon}>Soon</span> : null}
                    </span>
                    <span className={styles.algoComplex}>
                      Avg {item.average} · Worst {item.worst}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export function AlgoSidebarToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.sidebarToggle}
      aria-expanded={open}
      aria-label={open ? "Close algorithms" : "Open algorithms"}
      onClick={onToggle}
    >
      <span className={styles.sidebarToggleLabel}>Algorithm</span>
      <Image
        src={listIcon}
        alt=""
        width={18}
        height={18}
        className={styles.sidebarToggleIcon}
        unoptimized
      />
    </button>
  );
}

export function WizShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className ?? styles.shell}>{children}</div>;
}
