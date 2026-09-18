import { caseSchema, classifyConfidence, classifyNoul, type EvaluationCase, type EvaluationResult, type JevScopeProject } from "@jevscope/core";

export type CaseOutcome = { id: string; result?: EvaluationResult; error?: string; errorCode?: string; latencyMs: number; expectations: Record<string, boolean>; };
export type Runner = (state: EvaluationCase["state"], project: JevScopeProject, signal?: AbortSignal) => Promise<EvaluationResult>;

export function parseCases(text: string): EvaluationCase[] {
  const ids = new Set<string>();
  return text.split(/\r?\n/).map((line, index) => ({line: line.trim(), index})).filter(({line}) => line).map(({line, index}) => {
    let value: unknown;
    try { value = JSON.parse(line); } catch { throw new Error(`Line ${index + 1}: invalid JSON`); }
    const parsed = caseSchema.safeParse(value);
    if (!parsed.success) throw new Error(`Line ${index + 1}: ${parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    if (ids.has(parsed.data.id)) throw new Error(`Line ${index + 1}: duplicate case id ${parsed.data.id}`);
    ids.add(parsed.data.id);
    return parsed.data;
  });
}

export function checkExpectations(item: EvaluationCase, result: EvaluationResult): Record<string, boolean> {
  const checks: Record<string, boolean> = {};
  for (const [name, expect] of Object.entries(item.expect ?? {})) {
    const answer = result.answers[name] as Record<string, unknown> | undefined;
    const choice = answer?.choice;
    const confidence = answer?.confidence;
    const score = answer?.score;
    const noul = answer?.noul;
    checks[name] = Boolean(answer) &&
      (expect.choiceEquals === undefined || choice === expect.choiceEquals) &&
      (expect.choiceOneOf === undefined || expect.choiceOneOf.includes(String(choice))) &&
      (expect.minConfidence === undefined || (typeof confidence === "number" && confidence >= expect.minConfidence)) &&
      (expect.scoreMin === undefined || (typeof score === "number" && score >= expect.scoreMin)) &&
      (expect.scoreMax === undefined || (typeof score === "number" && score <= expect.scoreMax)) &&
      (expect.scoreApprox === undefined || (typeof score === "number" && Math.abs(score - expect.scoreApprox) <= (expect.tolerance ?? 0))) &&
      (expect.noulMin === undefined || (typeof noul === "number" && noul >= expect.noulMin)) &&
      (expect.noulMax === undefined || (typeof noul === "number" && noul <= expect.noulMax));
  }
  return checks;
}

export async function runBatch(cases: EvaluationCase[], project: JevScopeProject, runner: Runner, concurrency = 4, signal?: AbortSignal): Promise<CaseOutcome[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error("Concurrency must be between 1 and 16");
  const outcomes = new Array<CaseOutcome>(cases.length);
  let cursor = 0;
  async function worker() {
    while (cursor < cases.length && !signal?.aborted) {
      const index = cursor++;
      const item = cases[index]!;
      const start = performance.now();
      try {
        const result = await runner(item.state, project, signal);
        outcomes[index] = { id: item.id, result, latencyMs: Math.round(performance.now() - start), expectations: checkExpectations(item, result) };
      } catch (error) {
        outcomes[index] = { id: item.id, error: error instanceof Error ? error.message : "Evaluation failed", errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : undefined, latencyMs: Math.round(performance.now() - start), expectations: {} };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, cases.length) }, worker));
  return outcomes.filter(Boolean);
}

export function summarize(outcomes: CaseOutcome[], project: JevScopeProject) {
  const successes = outcomes.filter(o => o.result);
  const latencies = successes.map(o => o.latencyMs).sort((a,b) => a-b);
  const percentile = (p: number) => latencies.length ? latencies[Math.ceil(p * latencies.length) - 1] : null;
  const buckets: Record<string, number> = {};
  const confidence: Record<string, { sum: number; count: number }> = {};
  let lowConfidence = 0;
  for (const outcome of successes) for (const [name, raw] of Object.entries(outcome.result!.answers)) {
    const answer = raw as Record<string, unknown>;
    const question = project.questions[name];
    if (!question) continue;
    const bucket = question.type === "noul" && typeof answer.noul === "number"
      ? classifyNoul(answer.noul, project.policy.noul)
      : typeof answer.confidence === "number"
        ? classifyConfidence(answer.confidence, question.type === "choice" ? project.policy.choiceConfidence : project.policy.scoreConfidence)
        : "unknown";
    buckets[bucket] = (buckets[bucket] ?? 0) + 1;
    if (bucket === "fallback" || bucket === "review") lowConfidence++;
    if (typeof answer.confidence === "number") {
      confidence[name] ??= {sum: 0, count: 0};
      confidence[name]!.sum += answer.confidence;
      confidence[name]!.count++;
    }
  }
  const expectationValues = outcomes.flatMap(o => Object.values(o.expectations));
  return { total: outcomes.length, completed: successes.length, failed: outcomes.length - successes.length,
    expectationPass: expectationValues.filter(Boolean).length, expectationFail: expectationValues.filter(v => !v).length,
    averageLatencyMs: latencies.length ? latencies.reduce((a,b) => a+b, 0) / latencies.length : null,
    p50LatencyMs: percentile(.5), p95LatencyMs: percentile(.95), lowConfidence, buckets,
    averageConfidence: Object.fromEntries(Object.entries(confidence).map(([name, v]) => [name, v.sum / v.count])) };
}

export function compare(a: CaseOutcome[], b: CaseOutcome[], projectA: JevScopeProject, projectB: JevScopeProject) {
  const byId = new Map(b.map(o => [o.id, o]));
  return a.map(left => {
    const right = byId.get(left.id);
    const questions = Object.keys(left.result?.answers ?? {}).map(name => {
      const x = left.result?.answers[name] as Record<string, unknown> | undefined;
      const y = right?.result?.answers[name] as Record<string, unknown> | undefined;
      const qa = projectA.questions[name], qb = projectB.questions[name];
      const metric = (v?: Record<string, unknown>) => typeof v?.noul === "number" ? v.noul : typeof v?.score === "number" ? v.score : v?.choice;
      const bucket = (v: Record<string, unknown> | undefined, q: typeof qa, p: JevScopeProject) => !v || !q ? null : q.type === "noul" && typeof v.noul === "number" ? classifyNoul(v.noul, p.policy.noul) : typeof v.confidence === "number" ? classifyConfidence(v.confidence, q.type === "choice" ? p.policy.choiceConfidence : p.policy.scoreConfidence) : null;
      return { name, valueA: metric(x), valueB: metric(y), changed: metric(x) !== metric(y), confidenceA: x?.confidence, confidenceB: y?.confidence,
        confidenceDelta: typeof x?.confidence === "number" && typeof y?.confidence === "number" ? y.confidence - x.confidence : null,
        bucketA: bucket(x, qa, projectA), bucketB: bucket(y, qb, projectB), expectationA: left.expectations[name], expectationB: right?.expectations[name] };
    });
    return { id: left.id, errorA: left.error, errorB: right?.error, questions, changed: questions.some(q => q.changed || q.bucketA !== q.bucketB || q.expectationA !== q.expectationB) };
  });
}
