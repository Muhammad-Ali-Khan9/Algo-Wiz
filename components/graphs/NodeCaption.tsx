import graphStyles from "./graph-wiz.module.scss";

export function parseCaptionLines(idLabel: string, metric?: string): string[] {
  if (metric) {
    return metric
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);
  }
  return [idLabel];
}

/**
 * Radius needed so caption text fits comfortably inside the disk
 * (readable font, not cramped against the rim).
 */
export function radiusForCaption(
  lines: string[],
  options?: { minFont?: number; comfort?: number },
): number {
  const minFont = options?.minFont ?? 2.25;
  const comfort = options?.comfort ?? 1.28;
  const maxLen = Math.max(...lines.map((line) => line.length), 1);
  const lineCount = Math.max(lines.length, 1);
  const textW = maxLen * minFont * 0.64;
  const textH = lineCount * minFont * 1.22;
  const content = Math.max(textW, textH, minFont * 1.6);
  // Keep ~22% of the diameter as padding around the text block.
  const diameter = (content / 0.78) * comfort;
  return diameter / 2;
}

function fitFontSize(radius: number, lines: string[]) {
  const maxLen = Math.max(...lines.map((line) => line.length), 1);
  const byHeight = (radius * 1.52) / Math.max(lines.length, 1);
  const byWidth = (radius * 1.7) / (maxLen * 0.58);
  const capped = radius * 0.42;
  // Prefer a readable size; radius should already be large enough.
  return Math.max(1.8, Math.min(capped, byHeight * 0.88, byWidth, radius * 0.5));
}

/**
 * Draw the node id, or metric data when present — always centered inside the disk.
 */
export function NodeCaption({
  x,
  y,
  radius,
  idLabel,
  metric,
}: {
  x: number;
  y: number;
  radius: number;
  idLabel: string;
  metric?: string;
}) {
  const lines = parseCaptionLines(idLabel, metric);
  const fontSize = fitFontSize(radius, lines);
  const lineGap = fontSize * (lines.length > 2 ? 1.08 : 1.2);
  const startY = y - ((lines.length - 1) * lineGap) / 2;
  const useMono = Boolean(metric);

  return (
    <>
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          className={useMono ? graphStyles.nodeMetric : graphStyles.nodeLabel}
          x={x}
          y={startY + index * lineGap}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={line === "∞" ? fontSize * 1.1 : fontSize}
        >
          {line}
        </text>
      ))}
    </>
  );
}
