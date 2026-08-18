import { createFileRoute } from "@tanstack/react-router";
import { authorize, fail, json, preflight } from "@/lib/radar-api.server";
import {
  ALLOWED_IMAGE_TYPES,
  CODE_PATTERN,
  IMAGE_EXTENSION,
  LIMITS,
} from "@/lib/radar-contract";

const BUCKET = "garimpo-images";
/** ~10 anos: URL assinada estável para uso em <img> na landing (bucket é privado). */
const SIGNED_URL_TTL = 60 * 60 * 24 * 3650;

type UploadResult = { path: string; main_image_url: string; expires_in: number };

export const Route = createFileRoute("/api/public/radar/upload-image")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      POST: async ({ request }) => {
        const unauthorized = authorize(request);
        if (unauthorized) return unauthorized;

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return fail(request, 400, "Envie a imagem como multipart/form-data no campo 'file'.");
        }

        const file = form.get("file");
        if (!(file instanceof File)) {
          return fail(request, 400, "Campo 'file' é obrigatório e deve ser um arquivo.");
        }

        const type = file.type.toLowerCase();
        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)) {
          return fail(request, 400, "Formato inválido. Aceitos: JPEG, PNG ou WebP.");
        }
        if (file.size === 0) return fail(request, 400, "Arquivo vazio.");
        if (file.size > LIMITS.imageBytes) {
          return fail(request, 400, "Imagem excede o limite de 8 MB.");
        }

        // Nome sempre gerado pelo servidor: sem path traversal e sem colisão.
        const rawCode = String(form.get("code") ?? "").toLowerCase();
        const code = CODE_PATTERN.test(rawCode) && rawCode.length <= LIMITS.code ? rawCode : "sem-code";
        const path = `${code}/${crypto.randomUUID()}.${IMAGE_EXTENSION[type]}`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(path, await file.arrayBuffer(), { contentType: type, upsert: false });

        if (uploadError) {
          console.error("[radar] falha no upload da imagem", path, uploadError.message);
          return fail(request, 500, "Não foi possível enviar a imagem.");
        }

        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(path, SIGNED_URL_TTL);

        if (signError || !signed?.signedUrl) {
          console.error("[radar] falha ao assinar URL", path, signError?.message);
          return fail(request, 500, "Imagem enviada, mas não foi possível gerar a URL.");
        }

        console.log("[radar] imagem enviada", path);
        return json<UploadResult>(request, 201, {
          ok: true,
          data: { path, main_image_url: signed.signedUrl, expires_in: SIGNED_URL_TTL },
        });
      },
    },
  },
});
