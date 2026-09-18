export type ConfidenceBucket = "auto" | "review" | "fallback";
export type NoulBucket = "yes" | "review" | "no";

export function classifyConfidence(
  confidence: number,
  thresholds: { auto: number; review: number },
): ConfidenceBucket {
  if (confidence >= thresholds.auto) return "auto";
  if (confidence >= thresholds.review) return "review";
  return "fallback";
}

export function classifyNoul(
  probabilityYes: number,
  thresholds: { yes: number; no: number },
): NoulBucket {
  if (probabilityYes >= thresholds.yes) return "yes";
  if (probabilityYes <= thresholds.no) return "no";
  return "review";
}
