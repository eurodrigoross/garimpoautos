/**
 * Handlers compartilhados do Radar. Usados pelas rotas canônicas
 * (/api/public/radar/*) e pelos aliases (/api/radar/*), para que a extensão
 * funcione mesmo se apontar para o caminho curto.
 * Server-only: nunca importar em código de cliente.
 */
import { authorize, fail, json } from "@/lib/radar-api.server";
import {
  ALLOWED_IMAGE_TYPES,
  CODE_PATTERN,
  IMAGE_EXTENSION,
  LIMITS,
  ValidationError,
  validatePublishPayload,
  type RadarPublishResult,
} from "@/lib/radar-contract";

const BUCKET = "garimpo-images";
/** ~10 anos: URL assinada estável para uso em <img> na landing (bucket é privado). */
const SIGNED_URL_TTL = 60 * 60 * 24 * 3650;

type UploadResult = { path: string; main_image_url: string; expires_in: number };

export async function handlePublish(request: Request): Promise<Response> {
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
}

export async function handleUploadImage(request: Request): Promise<Response> {
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
}
