import fs from "node:fs";

const filename = process.argv[2];
if (!filename) {
  console.error("Usage: node scripts/validate-project.mjs <project.jevscope.json>");
  process.exit(2);
}

const value = JSON.parse(fs.readFileSync(filename, "utf8"));

const errors = [];
if (value.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (!value.name) errors.push("name is required");
if (value?.provider?.type !== "typesafe") errors.push("provider.type must be typesafe");

const questions = value.questions ?? {};
if (Object.keys(questions).length === 0) errors.push("at least one question is required");

for (const [name, q] of Object.entries(questions)) {
  if (!["choice", "score", "noul"].includes(q?.type)) {
    errors.push(`questions.${name}.type is invalid`);
  }
  if (q?.type === "choice" && Object.keys(q.criteria ?? {}).length < 2) {
    errors.push(`questions.${name}.criteria requires >= 2 labels`);
  }
  if (q?.type === "score" && (!Array.isArray(q.criteria) || q.criteria.length < 2)) {
    errors.push(`questions.${name}.criteria requires >= 2 rubric levels`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${filename}`);
