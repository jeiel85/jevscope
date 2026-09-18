import { z } from "zod";

export const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

// Matches TypeSafe EntryType: text, JSON object/array, or null.
// Bare numbers/booleans are valid nested JSON values but not top-level entries.
export const entrySchema = z.union([
  z.string(),
  z.null(),
  z.array(jsonValueSchema),
  z.record(z.string(), jsonValueSchema),
]);

const choiceQuestionSchema = z.object({
  type: z.literal("choice"),
  instructions: entrySchema.optional(),
  criteria: z.record(z.string(), entrySchema).refine(
    (value) => Object.keys(value).length >= 2,
    "Choice criteria must contain at least two labels.",
  ),
});

const scoreQuestionSchema = z.object({
  type: z.literal("score"),
  instructions: entrySchema.optional(),
  criteria: z.array(entrySchema).min(2),
});

const noulQuestionSchema = z.object({
  type: z.literal("noul"),
  instructions: entrySchema.optional(),
  criteria: z
    .object({
      true: entrySchema.optional(),
      false: entrySchema.optional(),
    })
    .nullable()
    .optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  choiceQuestionSchema,
  scoreQuestionSchema,
  noulQuestionSchema,
]);

const confidencePolicySchema = z
  .object({
    auto: z.number().min(0).max(1),
    review: z.number().min(0).max(1),
  })
  .refine((v) => v.auto >= v.review, {
    message: "auto threshold must be >= review threshold",
  });

const noulPolicySchema = z
  .object({
    yes: z.number().min(0).max(1),
    no: z.number().min(0).max(1),
  })
  .refine((v) => v.yes > v.no, {
    message: "yes threshold must be greater than no threshold",
  });

export const projectSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().min(1),
  description: z.string().optional(),
  provider: z.object({
    type: z.literal("typesafe"),
    model: z.string().min(1).default("jev-latest"),
  }).strict(),
  questions: z
    .record(z.string(), questionSchema)
    .refine((v) => Object.keys(v).length > 0, "At least one question is required."),
  policy: z.object({
    choiceConfidence: confidencePolicySchema,
    scoreConfidence: confidencePolicySchema,
    noul: noulPolicySchema,
  }).strict(),
}).strict();

export const expectationSchema = z.object({
  choiceEquals: z.string().optional(),
  choiceOneOf: z.array(z.string()).min(1).optional(),
  minConfidence: z.number().min(0).max(1).optional(),
  scoreMin: z.number().optional(),
  scoreMax: z.number().optional(),
  scoreApprox: z.number().optional(),
  tolerance: z.number().min(0).optional(),
  noulMin: z.number().min(0).max(1).optional(),
  noulMax: z.number().min(0).max(1).optional(),
}).strict();

export const caseSchema = z.object({
  id: z.string().min(1),
  state: entrySchema,
  expect: z.record(z.string(), expectationSchema).optional(),
}).strict();

export type EvaluationCase = z.infer<typeof caseSchema>;

export type JevScopeProject = z.infer<typeof projectSchema>;
export type QuestionDefinition = z.infer<typeof questionSchema>;
export type EntryValue = z.infer<typeof entrySchema>;
