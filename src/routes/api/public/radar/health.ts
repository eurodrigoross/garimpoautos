import { createFileRoute } from "@tanstack/react-router";
import { json, preflight } from "@/lib/radar-api.server";

/** Diagnóstico público (sem dados sensíveis): confirma que as rotas do Radar estão no ar. */
export const Route = createFileRoute("/api/public/radar/health")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      GET: async ({ request }) =>
        json(request, 200, {
          ok: true,
          data: {
            service: "radar-api",
            token_configured: Boolean(process.env["RADAR_PUBLISH_TOKEN"]),
            endpoints: [
              "/api/public/radar/publish",
              "/api/public/radar/upload-image",
              "/api/radar/publish",
              "/api/radar/upload-image",
            ],
          },
        }),
    },
  },
});
