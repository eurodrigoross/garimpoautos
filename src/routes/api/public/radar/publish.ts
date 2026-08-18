import { createFileRoute } from "@tanstack/react-router";
import { authorize, fail, json, preflight } from "@/lib/radar-api.server";
import {
  ValidationError,
  validatePublishPayload,
  type RadarPublishResult,
} from "@/lib/radar-contract";

export const Route = createFileRoute("/api/public/radar/publish")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      POST: async ({ request }) => {
        const unauthorized = authorize(request);
        if (unauthorized) return unauthorized;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return fail(request, 400, "Corpo da requisição deve ser JSON válido.");
        }

        let row;
        try {
          row = validatePublishPayload(body);
        } catch (err) {
          if (err instanceof ValidationError) return fail(request, 400, err.message);
          return fail(request, 400, "Payload inválido.");
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: existing, error: lookupError } = await supabaseAdmin
          .from("garimpos")
          .select("id")
          .eq("code", row.code)
          .maybeSingle();

        if (lookupError) {
          console.error("[radar] falha ao consultar code", row.code, lookupError.message);
          return fail(request, 500, "Não foi possível verificar o código do garimpo.");
        }
        if (existing) {
          return fail(request, 409, `Já existe um garimpo com o code "${row.code}".`);
        }

        const { data, error } = await supabaseAdmin
          .from("garimpos")
          .insert(row)
          .select(
            "id, code, vehicle_name, garimpo_value, status, access_type, main_image_url, published, created_at, updated_at",
          )
          .single();

        if (error || !data) {
          if (error?.code === "23505") {
            return fail(request, 409, `Já existe um garimpo com o code "${row.code}".`);
          }
          console.error("[radar] falha ao inserir garimpo", row.code, error?.message);
          return fail(request, 500, "Não foi possível publicar o garimpo.");
        }

        console.log("[radar] garimpo publicado", data.id, data.code, data.status);
        return json<RadarPublishResult>(request, 201, {
          ok: true,
          data: data as RadarPublishResult,
        });
      },
    },
  },
});
