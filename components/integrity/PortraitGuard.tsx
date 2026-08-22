"use client";

import {
  PORTRAIT_ATTR,
  PORTRAIT_ATTR_VALUE,
  PORTRAIT_ROLE_ATTR,
  PORTRAIT_SRC,
  verifyPortraitDom,
  verifyPortraitIntegrity,
} from "@/lib/integrity/portrait";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./portrait-guard.module.scss";

type IntegrityApi = {
  reportTamper: () => void;
  setHeroMounted: (mounted: boolean) => void;
};

const IntegrityContext = createContext<IntegrityApi | null>(null);

export function usePortraitIntegrity(): IntegrityApi {
  const ctx = useContext(IntegrityContext);
  if (!ctx) {
    throw new Error("usePortraitIntegrity must be used within PortraitGuard");
  }
  return ctx;
}

export function PortraitGuard({ children }: { children: ReactNode }) {
  const [tampered, setTampered] = useState(false);
  const heroMounted = useRef(false);
  const locked = useRef(false);

  const reportTamper = useCallback(() => {
    if (locked.current) return;
    locked.current = true;
    setTampered(true);
  }, []);

  const setHeroMounted = useCallback((mounted: boolean) => {
    heroMounted.current = mounted;
  }, []);

  const api = useMemo(
    () => ({ reportTamper, setHeroMounted }),
    [reportTamper, setHeroMounted],
  );

  // Byte fingerprint of the portrait file — never block the tree on "checking"
  useEffect(() => {
    let cancelled = false;

    verifyPortraitIntegrity().then((ok) => {
      if (cancelled) return;
      if (!ok) reportTamper();
    });

    return () => {
      cancelled = true;
    };
  }, [reportTamper]);

  // Live DOM watch (inspect-element remove / src swap)
  useEffect(() => {
    if (tampered) return;

    let cancelled = false;
    const fail = () => {
      if (!cancelled) reportTamper();
    };

    const checkDom = () => {
      if (cancelled || locked.current) return;
      if (!verifyPortraitDom(heroMounted.current)) fail();
    };

    // Let React commit the sentinel (and home hero) before the first check
    const start = window.setTimeout(() => {
      checkDom();
      observer = new MutationObserver(() => checkDom());
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "href", PORTRAIT_ATTR, PORTRAIT_ROLE_ATTR],
      });
      heartbeat = window.setInterval(checkDom, 700);
      hashTimer = window.setInterval(() => {
        verifyPortraitIntegrity().then((stillOk) => {
          if (!stillOk) fail();
        });
      }, 8000);
    }, 50);

    let observer: MutationObserver | null = null;
    let heartbeat: number | undefined;
    let hashTimer: number | undefined;

    return () => {
      cancelled = true;
      window.clearTimeout(start);
      observer?.disconnect();
      if (heartbeat) window.clearInterval(heartbeat);
      if (hashTimer) window.clearInterval(hashTimer);
    };
  }, [tampered, reportTamper]);

  if (tampered) {
    return (
      <div className={styles.lockout} role="alert" aria-live="assertive">
        <p className={styles.kicker}>Integrity check failed</p>
        <h1 className={styles.title}>You are a dirty hacker after all</h1>
        <p className={styles.body}>
          The signed portrait asset <code>{PORTRAIT_SRC}</code> was removed, altered, or
          failed its fingerprint check. Access is locked.
        </p>
      </div>
    );
  }

  return (
    <IntegrityContext.Provider value={api}>
      {/* Always-on sentinel — deleting this via DevTools also locks the site */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...{
          [PORTRAIT_ATTR]: PORTRAIT_ATTR_VALUE,
          [PORTRAIT_ROLE_ATTR]: "sentinel",
        }}
        src={PORTRAIT_SRC}
        alt=""
        aria-hidden="true"
        className={styles.sentinel}
        width={1}
        height={1}
        decoding="async"
      />
      {children}
    </IntegrityContext.Provider>
  );
}
