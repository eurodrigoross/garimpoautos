import { createFileRoute } from "@tanstack/react-router";
import { fail, preflight } from "@/lib/radar-api.server";
import { handleUploadImage } from "@/lib/radar-handlers.server";

export const Route = createFileRoute("/api/public/radar/upload-image")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      GET: async ({ request }) => fail(request, 405, "Método não permitido. Use POST."),
      POST: async ({ request }) => handleUploadImage(request),
    },
  },
});
