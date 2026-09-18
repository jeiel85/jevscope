import { TypeSafeClient } from "@typesafe-ai/sdk";
import type {
  DecisionProvider,
  EvaluationRequest,
  EvaluationResult,
} from "@jevscope/core";

export function normalizeResponse(response: { model: string; answers: Record<string, unknown>; usage?: { input_tokens: number; output_tokens: number } }, latencyMs: number): EvaluationResult {
  return { provider: "typesafe", model: response.model, answers: response.answers, usage: response.usage,
    meta: { latencyMs, timestamp: new Date().toISOString() } };
}

export class TypeSafeDecisionProvider implements DecisionProvider {
  readonly #client: TypeSafeClient;

  constructor(apiKey?: string) {
    this.#client = new TypeSafeClient(apiKey ? { apiKey } : undefined);
  }

  id(): string {
    return "typesafe";
  }

  async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    const started = performance.now();

    // This cast is intentionally contained at the provider boundary. JevScope's
    // runtime schema mirrors the official System One question/state shapes.
    const response = await this.#client.systemOne({
      state: request.state,
      questions: request.questions,
      model: request.model,
    } as any, { timeout: 30_000, retry: { maxRetries: 0 } });

    return normalizeResponse(response, Math.round(performance.now() - started));
  }
}
