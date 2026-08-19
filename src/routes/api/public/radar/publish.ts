import { createFileRoute } from "@tanstack/react-router";
import { fail, preflight } from "@/lib/radar-api.server";
import { handlePublish } from "@/lib/radar-handlers.server";

export const Route = createFileRoute("/api/public/radar/publish")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      GET: async ({ request }) => fail(request, 405, "Método não permitido. Use POST."),
      POST: async ({ request }) => handlePublish(request),
    },
  },
});
