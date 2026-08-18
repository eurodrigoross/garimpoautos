/**
 * Utilidades server-only das rotas do Radar: autenticação por token dedicado,
 * CORS mínimo para a extensão e respostas JSON padronizadas.
 * Nunca importar este arquivo em código de cliente.
 */
import { timingSafeEqual } from "crypto";
import type { RadarApiResponse } from "@/lib/radar-contract";

/** CORS só para a extensão (chrome-extension://...) e chamadas same-origin. */
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !/^(chrome|moz)-extension:\/\/[a-z0-9-]+$/i.test(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Radar-Token",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

export function json<T>(
  request: Request,
  status: number,
  body: RadarApiResponse<T>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(request),
    },
  });
}

export const fail = (request: Request, status: number, error: string) =>
  json(request, status, { ok: false, error });

export const preflight = (request: Request) =>
  new Response(null, { status: 204, headers: corsHeaders(request) });

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Valida o segredo de publicação. Aceita Authorization: Bearer <token>
 * ou X-Radar-Token. Retorna null quando autorizado.
 */
export function authorize(request: Request): Response | null {
  const expected = process.env["RADAR_PUBLISH_TOKEN"];
  if (!expected) {
    console.error("[radar] RADAR_PUBLISH_TOKEN ausente no ambiente do servidor");
    return fail(request, 503, "Publicação indisponível: segredo do servidor não configurado.");
  }

  const auth = request.headers.get("authorization") ?? "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  const provided = bearer || request.headers.get("x-radar-token")?.trim() || "";

  if (!provided || !safeEqual(provided, expected)) {
    return fail(request, 401, "Token de publicação ausente ou inválido.");
  }
  return null;
}
