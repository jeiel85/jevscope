import { describe, expect, it } from "vitest";
import { classifyConfidence, classifyNoul } from "./policy.js";

describe("confidence policy", () => {
  it("classifies threshold boundaries", () => {
    expect(classifyConfidence(0.85, { auto: 0.85, review: 0.6 })).toBe("auto");
    expect(classifyConfidence(0.6, { auto: 0.85, review: 0.6 })).toBe("review");
    expect(classifyConfidence(0.59, { auto: 0.85, review: 0.6 })).toBe("fallback");
  });

  it("classifies noul probability", () => {
    expect(classifyNoul(0.8, { yes: 0.8, no: 0.2 })).toBe("yes");
    expect(classifyNoul(0.2, { yes: 0.8, no: 0.2 })).toBe("no");
    expect(classifyNoul(0.5, { yes: 0.8, no: 0.2 })).toBe("review");
  });
});
