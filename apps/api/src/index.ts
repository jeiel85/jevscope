import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { entrySchema, questionSchema } from "@jevscope/core";
import { TypeSafeDecisionProvider } from "@jevscope/provider-typesafe";
import { z } from "zod";

const port = Number(process.env.JEVSCOPE_API_PORT ?? 4317);
const maxBodyBytes = Number(process.env.JEVSCOPE_MAX_BODY_BYTES ?? 1_048_576);
const apiKey = process.env.TYPESAFE_API_KEY;

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
    "access-control-allow-origin": "http://localhost:5173",
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
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "http://localhost:5173",
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
