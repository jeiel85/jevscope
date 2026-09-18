import { TypeSafeClient } from "@typesafe-ai/sdk";
import type {
  DecisionProvider,
  EvaluationRequest,
  EvaluationResult,
} from "@jevscope/core";

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
    } as any);

    return {
      provider: this.id(),
      model: response.model,
      answers: response.answers as Record<string, unknown>,
      usage: response.usage,
      meta: {
        latencyMs: Math.round(performance.now() - started),
        timestamp: new Date().toISOString(),
      },
    };
  }
}
