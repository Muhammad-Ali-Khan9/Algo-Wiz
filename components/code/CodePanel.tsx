"use client";

import { CODE_LANGS, type CodeLang, type CodeSnippets } from "@/lib/code/languages";
import { useState } from "react";
import styles from "./code-panel.module.scss";

export function CodePanel({ snippets: samples }: { snippets: CodeSnippets }) {
  const [lang, setLang] = useState<CodeLang>("python");

  return (
    <section>
      <h2 className={styles.title}>Code</h2>
      <div className={styles.tabs} role="tablist" aria-label="Language">
        {CODE_LANGS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === lang}
            className={styles.tab}
            data-active={item.id === lang}
            onClick={() => setLang(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <pre className={styles.pre}>
        <code>{samples[lang]}</code>
      </pre>
    </section>
  );
}
