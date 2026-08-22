/** Canonical portrait asset — tampering trips the site lockout. */
export const PORTRAIT_SRC = "/personal-portrait.svg";

/** DOM marker on every protected portrait node. */
export const PORTRAIT_ATTR = "data-algo-integrity";
export const PORTRAIT_ATTR_VALUE = "portrait";
export const PORTRAIT_ROLE_ATTR = "data-portrait-role";

/**
 * SHA-256 of `public/personal-portrait.svg` (hex, lowercase).
 * Recompute after intentionally replacing the file:
 *   Get-FileHash -Algorithm SHA256 public/personal-portrait.svg
 */
export const PORTRAIT_SHA256 =
  "d03dd9c42e30413be49115e1bcbdc35dd1afe0346c14a628e4b66dd237fe2748";

export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Fetches the portrait and returns whether its bytes match the expected hash. */
export async function verifyPortraitIntegrity(): Promise<boolean> {
  try {
    const res = await fetch(PORTRAIT_SRC, { cache: "no-store" });
    if (!res.ok) return false;
    const hash = await sha256Hex(await res.arrayBuffer());
    return hash === PORTRAIT_SHA256;
  } catch {
    return false;
  }
}

function srcLooksCanonical(src: string | null): boolean {
  if (!src) return false;
  try {
    const path = new URL(src, window.location.origin).pathname;
    return path === PORTRAIT_SRC || path.endsWith(PORTRAIT_SRC);
  } catch {
    return src.includes(PORTRAIT_SRC);
  }
}

/** Live DOM check — nodes present, correct src, hero required when mounted. */
export function verifyPortraitDom(heroExpected: boolean): boolean {
  if (typeof document === "undefined") return true;

  const nodes = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      `img[${PORTRAIT_ATTR}="${PORTRAIT_ATTR_VALUE}"]`,
    ),
  );

  if (nodes.length === 0) return false;

  for (const node of nodes) {
    if (!document.contains(node)) return false;
    if (!srcLooksCanonical(node.getAttribute("src"))) return false;
  }

  const sentinel = nodes.find((n) => n.getAttribute(PORTRAIT_ROLE_ATTR) === "sentinel");
  if (!sentinel) return false;

  if (heroExpected) {
    const hero = nodes.find((n) => n.getAttribute(PORTRAIT_ROLE_ATTR) === "hero");
    if (!hero) return false;
  }

  return true;
}
