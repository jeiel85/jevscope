export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// TypeSafe System One top-level entry semantics.
export type EntryValue = string | JsonValue[] | { [key: string]: JsonValue } | null;

export type EvaluationRequest = {
  state: EntryValue;
  questions: Record<string, unknown>;
  model?: string;
};

export type EvaluationResult = {
  provider: string;
  model: string;
  answers: Record<string, unknown>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  meta: {
    latencyMs: number;
    timestamp: string;
  };
};

export interface DecisionProvider {
  id(): string;
  evaluate(request: EvaluationRequest): Promise<EvaluationResult>;
}
