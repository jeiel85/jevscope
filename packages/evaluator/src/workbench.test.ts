import { describe, expect, it } from "vitest";
import { parseCases, checkExpectations, runBatch, summarize, compare } from "./workbench.js";
import { projectSchema } from "@jevscope/core";
const project = projectSchema.parse({ schemaVersion: 1, name: "test", provider: { type: "typesafe", model: "jev-latest" }, questions: { next: { type: "choice", criteria: {a:null,b:null} } }, policy: { choiceConfidence: {auto:.8,review:.5}, scoreConfidence: {auto:.8,review:.5}, noul: {yes:.8,no:.2} } });
const result = (choice: string, confidence = .9) => ({ provider: "typesafe", model: "jev-fixed", answers: { next: { type: "choice", choice, confidence, probabilities: {a:.9,b:.1} } }, meta: {latencyMs:10,timestamp:"2026-01-01T00:00:00Z"} });
describe("evaluation workbench", () => {
 it("validates every JSONL case and rejects duplicates", () => { expect(parseCases('{"id":"a","state":{}}')).toHaveLength(1); expect(() => parseCases('{"id":"a","state":{}}\n{"id":"a","state":{}}')).toThrow(/duplicate/); expect(() => parseCases('{"id":"a","state":1}')).toThrow(/state/); });
 it("checks expected decisions and confidence", () => { const item = parseCases('{"id":"a","state":{},"expect":{"next":{"choiceEquals":"a","minConfidence":0.8}}}')[0]!; expect(checkExpectations(item, result("a"))).toEqual({next:true}); expect(checkExpectations(item, result("b"))).toEqual({next:false}); });
 it("bounds concurrency and compares changed decisions", async () => { const cases = parseCases(Array.from({length:5},(_,i) => JSON.stringify({id:String(i),state:{}})).join("\n")); let active=0, peak=0; const outcomes = await runBatch(cases,project,async () => { active++; peak=Math.max(peak,active); await new Promise(r => setTimeout(r,5)); active--; return result("a"); },2); expect(peak).toBe(2); expect(summarize(outcomes,project).completed).toBe(5); const other = await runBatch(cases,project,async () => result("b"),2); expect(compare(outcomes,other,project,project).every(x => x.changed)).toBe(true); });
});
