import { describe, expect, it } from "vitest";
import { normalizeResponse } from "./index.js";
describe("TypeSafe response boundary", () => {
 it("preserves all three primitive payloads, returned model, and usage", () => {
  const fixture = { model: "jev-fixed", usage: {input_tokens:12,output_tokens:3}, answers: {
   action: {type:"choice",choice:"retreat",confidence:.81,probabilities:{attack:.19,retreat:.81}},
   danger: {type:"score",score:2.7,confidence:.73,legend:{0:"Safe",1:"Risky",2:"Critical"},probabilities:{0:.1,1:.2,2:.7}},
   special: {type:"noul",noul:.65}
  }};
  const result = normalizeResponse(fixture,114);
  expect(result.answers).toEqual(fixture.answers);
  expect(result.model).toBe("jev-fixed");
  expect(result.usage).toEqual(fixture.usage);
  expect(result.meta.latencyMs).toBe(114);
 });
});
