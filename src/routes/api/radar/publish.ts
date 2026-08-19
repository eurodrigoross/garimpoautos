import { createFileRoute } from "@tanstack/react-router";
import { fail, preflight } from "@/lib/radar-api.server";
import { handlePublish } from "@/lib/radar-handlers.server";

/** Alias de compatibilidade: mesmo handler autenticado por token de /api/public/radar/publish. */
export const Route = createFileRoute("/api/radar/publish")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      GET: async ({ request }) => fail(request, 405, "Método não permitido. Use POST."),
      POST: async ({ request }) => handlePublish(request),
    },
  },
});
