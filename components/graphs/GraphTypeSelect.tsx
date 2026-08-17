"use client";

import type { GraphKind } from "@/lib/graphs/types";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./graph-wiz.module.scss";

type Option = { id: GraphKind; label: string };

export function GraphTypeSelect({
  value,
  options,
  onChange,
  locked = false,
}: {
  value: GraphKind;
  options: readonly Option[];
  onChange: (next: GraphKind) => void;
  locked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((item) => item.id === value) ?? options[0];

  useEffect(() => {
    if (locked) setOpen(false);
  }, [locked]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={styles.typeSelectWrap}
      data-open={open}
    >
      <button
        type="button"
        className={styles.typeSelect}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={locked}
        onClick={() => setOpen((current) => !current)}
      >
        {selected?.label}
      </button>
      {open && !locked ? (
        <ul
          id={listId}
          className={styles.typeMenu}
          role="listbox"
          aria-label="Graph type"
        >
          {options.map((item) => (
            <li key={item.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.id === value}
                className={styles.typeOption}
                data-active={item.id === value}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
