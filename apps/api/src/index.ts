import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { entrySchema, questionSchema } from "@jevscope/core";
import { TypeSafeDecisionProvider } from "@jevscope/provider-typesafe";
import { z } from "zod";
import { AuthenticationError, RateLimitError, APITimeoutError, BadRequestError } from "@typesafe-ai/sdk";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../../.env") });

const port = Number(process.env.JEVSCOPE_API_PORT ?? 4317);
const maxBodyBytes = Number(process.env.JEVSCOPE_MAX_BODY_BYTES ?? 1_048_576);
const apiKey = process.env.TYPESAFE_API_KEY;
const studioOrigin = process.env.JEVSCOPE_STUDIO_ORIGIN ?? "http://localhost:5173";

const evaluateRequestSchema = z.object({
  state: entrySchema,
  questions: z
    .record(z.string(), questionSchema)
    .refine((q) => Object.keys(q).length > 0, "At least one question is required."),
  model: z.string().min(1).optional(),
});

function json(res: ServerResponse, status: number, value: unknown) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "access-control-allow-origin": studioOrigin,
    "vary": "origin",
  });
  res.end(body);
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBodyBytes) throw new Error("BODY_TOO_LARGE");
    chunks.push(buffer);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (req, res) => {
  if (req.headers.origin && req.headers.origin !== studioOrigin) {
    return json(res, 403, { error: { code: "forbidden_origin", message: "Origin is not allowed." } });
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": studioOrigin,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    return res.end();
  }

  if (req.method === "GET" && req.url === "/health") {
    return json(res, 200, {
      ok: true,
      provider: "typesafe",
      configured: Boolean(apiKey),
    });
  }

  if (req.method === "POST" && req.url === "/api/evaluate") {
    if (!apiKey) {
      return json(res, 503, {
        error: {
          code: "provider_not_configured",
          message: "TYPESAFE_API_KEY is not configured on the API process.",
        },
      });
    }

    try {
      if (Number(req.headers["content-length"] ?? 0) > maxBodyBytes) throw new Error("BODY_TOO_LARGE");
      const parsed = evaluateRequestSchema.parse(await readJson(req));
      const provider = new TypeSafeDecisionProvider(apiKey);
      const result = await provider.evaluate(parsed);
      return json(res, 200, result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json(res, 400, {
          error: {
            code: "validation_error",
            message: z.prettifyError(error),
          },
        });
      }

      if (error instanceof SyntaxError) return json(res, 400, { error: { code: "invalid_json", message: "Request body must be valid JSON." } });
      if (error instanceof AuthenticationError) return json(res, 401, { error: { code: "provider_auth", message: "Provider authentication failed." } });
      if (error instanceof RateLimitError) return json(res, 429, { error: { code: "rate_limit", message: "Provider rate limit reached." } });
      if (error instanceof APITimeoutError) return json(res, 504, { error: { code: "provider_timeout", message: "Provider request timed out." } });
      if (error instanceof BadRequestError) return json(res, 400, { error: { code: "provider_validation", message: "Provider rejected the evaluation request." } });

      if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
        return json(res, 413, {
          error: { code: "body_too_large", message: "Request body is too large." },
        });
      }

      console.error("evaluate failed", error instanceof Error ? error.name : "unknown");
      return json(res, 502, {
        error: {
          code: "provider_error",
          message: "The provider request failed. Check server logs for details.",
        },
      });
    }
  }

  return json(res, 404, { error: { code: "not_found", message: "Not found." } });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`JevScope API listening on http://127.0.0.1:${port}`);
});
