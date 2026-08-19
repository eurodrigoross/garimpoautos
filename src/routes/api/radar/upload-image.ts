import { createFileRoute } from "@tanstack/react-router";
import { fail, preflight } from "@/lib/radar-api.server";
import { handleUploadImage } from "@/lib/radar-handlers.server";

/** Alias de compatibilidade: mesmo handler autenticado por token de /api/public/radar/upload-image. */
export const Route = createFileRoute("/api/radar/upload-image")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      GET: async ({ request }) => fail(request, 405, "Método não permitido. Use POST."),
      POST: async ({ request }) => handleUploadImage(request),
    },
  },
});
