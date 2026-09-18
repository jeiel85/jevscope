import { describe, expect, it } from "vitest";
import { mapConcurrent, percentile } from "./index.js";

describe("evaluator helpers", () => {
  it("calculates nearest-rank percentile", () => {
    expect(percentile([1, 2, 3, 4], 50)).toBe(2);
    expect(percentile([1, 2, 3, 4], 95)).toBe(4);
  });

  it("preserves input ordering", async () => {
    const values = await mapConcurrent([3, 1, 2], 2, async (v) => v * 2);
    expect(values).toEqual([6, 2, 4]);
  });
});
