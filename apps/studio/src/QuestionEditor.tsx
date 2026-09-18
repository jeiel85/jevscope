import type { JevScopeProject } from "@jevscope/core";

type Props = { project: JevScopeProject; onChange: (project: JevScopeProject) => void };
export function QuestionEditor({ project, onChange }: Props) {
  function update(name: string, question: JevScopeProject["questions"][string] | null) {
    const next = { ...project, questions: { ...project.questions } };
    if (question) next.questions[name] = question;
    else delete next.questions[name];
    onChange(next);
  }
  return <details className="question-editor"><summary>Structured question editor</summary>
    {Object.entries(project.questions).map(([name, q]) => <fieldset key={name}><legend>{name} · {q.type}</legend>
      <label>Instructions<input aria-label={`${name} instructions`} value={typeof q.instructions === "string" ? q.instructions : ""} onChange={e => update(name, { ...q, instructions: e.target.value } as typeof q)}/></label>
      {q.type === "choice" && <label>Labels, comma separated<input aria-label={`${name} labels`} defaultValue={Object.keys(q.criteria).join(", ")} onBlur={e => { const labels = e.target.value.split(",").map(x => x.trim()).filter(Boolean); if (labels.length >= 2 && new Set(labels).size === labels.length) update(name, { ...q, criteria: Object.fromEntries(labels.map(label => [label, q.criteria[label] ?? null])) }); }}/></label>}
      {q.type === "score" && <label>Rubric levels, one per line<textarea aria-label={`${name} rubric`} defaultValue={q.criteria.map(x => typeof x === "string" ? x : JSON.stringify(x)).join("\n")} onBlur={e => { const levels = e.target.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean); if (levels.length >= 2) update(name, { ...q, criteria: levels }); }}/></label>}
      <button type="button" disabled={Object.keys(project.questions).length < 2} onClick={() => update(name, null)}>Remove question</button>
    </fieldset>)}
    <div className="row"><button type="button" onClick={() => { const name = prompt("Question name"); if (!name || project.questions[name]) return; update(name, { type: "choice", instructions: "", criteria: { yes: null, no: null } }); }}>Add choice</button><button type="button" onClick={() => { const name = prompt("Question name"); if (!name || project.questions[name]) return; update(name, { type: "score", instructions: "", criteria: ["Low", "High"] }); }}>Add score</button><button type="button" onClick={() => { const name = prompt("Question name"); if (!name || project.questions[name]) return; update(name, { type: "noul", instructions: "" }); }}>Add noul</button></div>
  </details>;
}
