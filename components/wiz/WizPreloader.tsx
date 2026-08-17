"use client";

import styles from "./wiz.module.scss";

export function WizPreloader({ shown, exiting }: { shown: boolean; exiting: boolean }) {
  if (!shown) return null;

  return (
    <div
      className={styles.preloader}
      data-exiting={exiting ? "true" : "false"}
      aria-busy={!exiting}
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.loader}>
        <span className={styles.loaderRing} aria-hidden="true" />
      </div>
    </div>
  );
}
