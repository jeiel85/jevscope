import { describe, expect, it } from "vitest";
import { projectSchema, caseSchema } from "./schema.js";
const base = {schemaVersion:1,name:"x",provider:{type:"typesafe",model:"jev-latest"},questions:{q:{type:"choice",criteria:{a:null,b:null}}},policy:{choiceConfidence:{auto:.8,review:.5},scoreConfidence:{auto:.8,review:.5},noul:{yes:.8,no:.2}}};
describe("project schema v1", () => {
 it("rejects fewer than two choice labels or score levels", () => { expect(projectSchema.safeParse({...base,questions:{q:{type:"choice",criteria:{a:null}}}}).success).toBe(false); expect(projectSchema.safeParse({...base,questions:{q:{type:"score",criteria:["one"]}}}).success).toBe(false); });
 it("rejects empty questions and embedded credentials", () => { expect(projectSchema.safeParse({...base,questions:{}}).success).toBe(false); expect(projectSchema.safeParse({...base,apiKey:"secret"}).success).toBe(false); expect(projectSchema.safeParse({...base,provider:{...base.provider,apiKey:"secret"}}).success).toBe(false); });
 it("accepts noul and valid JSONL state", () => { expect(projectSchema.safeParse({...base,questions:{q:{type:"noul"}}}).success).toBe(true); expect(caseSchema.safeParse({id:"x",state:{value:true}}).success).toBe(true); });
});
