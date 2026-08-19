/**
 * Contrato compartilhado do endpoint de publicação do Radar.
 * Usado pelo servidor (validação) e, futuramente, pela extensão (tipagem do payload).
 * NÃO contém segredos e não importa nada de servidor.
 */

export const ACCESS_TYPES = ["OPEN", "PRIME"] as const;
export const STATUSES = ["AVAILABLE", "RESERVED", "CLOSED"] as const;

export type RadarAccessType = (typeof ACCESS_TYPES)[number];
export type RadarStatus = (typeof STATUSES)[number];

export type RadarPublishPayload = {
  code: string;
  vehicle_name: string;
  year?: string | null;
  mileage_km?: string | null;
  transmission?: string | null;
  fuel?: string | null;
  location?: string | null;
  fipe_value?: number | null;
  market_value?: number | null;
  internal_base_cost?: number | null;
  internal_agio?: number | null;
  garimpo_value?: number | null;
  /** Ignorado se der para calcular no servidor. */
  discount_fipe_percent?: number | null;
  /** Ignorado se der para calcular no servidor. */
  market_difference?: number | null;
  positives?: string[];
  attention_points?: string[];
  garimpo_note?: string | null;
  access_type?: RadarAccessType;
  status?: RadarStatus;
  published?: boolean;
  main_image_url?: string | null;
};

/** Campos seguros devolvidos ao cliente. Nunca inclui custo interno nem ágio. */
export type RadarPublishResult = {
  id: string;
  code: string;
  vehicle_name: string;
  garimpo_value: number | null;
  status: RadarStatus;
  access_type: RadarAccessType;
  main_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type RadarApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

/* ---------------------------------- limites --------------------------------- */

export const LIMITS = {
  code: 60,
  vehicleName: 160,
  shortText: 120,
  note: 800,
  listItem: 200,
  listCount: 12,
  imageBytes: 8 * 1024 * 1024,
} as const;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* --------------------------------- validação -------------------------------- */

export class ValidationError extends Error {}

const fail = (msg: string): never => {
  throw new ValidationError(msg);
};

const cleanString = (v: unknown, field: string, max: number): string | null => {
  if (v === undefined || v === null) return null;
  if (typeof v !== "string") fail(`Campo "${field}" deve ser texto.`);
  const s = (v as string).replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  if (!s) return null;
  if (s.length > max) fail(`Campo "${field}" excede ${max} caracteres.`);
  return s;
};

const requiredString = (v: unknown, field: string, max: number): string => {
  const s = cleanString(v, field, max);
  if (!s) fail(`Campo "${field}" é obrigatório.`);
  return s as string;
};

const optionalNumber = (v: unknown, field: string): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) fail(`Campo "${field}" deve ser numérico.`);
  const num = n as number;
  if (num < 0) fail(`Campo "${field}" não pode ser negativo.`);
  if (num > 100_000_000) fail(`Campo "${field}" fora do intervalo aceito.`);
  return Math.round(num * 100) / 100;
};

const stringList = (v: unknown, field: string): string[] => {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) fail(`Campo "${field}" deve ser uma lista de textos.`);
  const arr = v as unknown[];
  if (arr.length > LIMITS.listCount) fail(`Campo "${field}" aceita no máximo ${LIMITS.listCount} itens.`);
  return arr
    .map((item) => cleanString(item, field, LIMITS.listItem))
    .filter((item): item is string => Boolean(item));
};

const enumValue = <T extends string>(
  v: unknown,
  field: string,
  allowed: readonly T[],
  fallback: T,
): T => {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v !== "string" || !allowed.includes(v as T)) {
    fail(`Campo "${field}" deve ser um de: ${allowed.join(", ")}.`);
  }
  return v as T;
};

const httpsUrl = (v: unknown, field: string, max = 500): string | null => {
  const s = cleanString(v, field, max);
  if (!s) return null;
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return fail(`Campo "${field}" deve ser uma URL válida.`);
  }
  if (url.protocol !== "https:") fail(`Campo "${field}" deve usar https.`);
  return url.toString();
};

/** Linha pronta para insert na tabela administrativa. Sem spread cego do body. */
export type RadarInsertRow = {
  code: string;
  vehicle_name: string;
  year: string | null;
  mileage_km: string | null;
  transmission: string | null;
  fuel: string | null;
  location: string | null;
  fipe_value: number | null;
  market_value: number | null;
  internal_base_cost: number | null;
  internal_agio: number | null;
  garimpo_value: number | null;
  discount_fipe_percent: number | null;
  market_difference: number | null;
  positives: string[];
  attention_points: string[];
  garimpo_note: string | null;
  access_type: RadarAccessType;
  status: RadarStatus;
  published: boolean;
  main_image_url: string | null;
  published_at: string | null;
  closed_at: string | null;
};

export function validatePublishPayload(input: unknown): RadarInsertRow {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    fail("Payload deve ser um objeto JSON.");
  }
  const body = input as Record<string, unknown>;

  const code = requiredString(body["code"], "code", LIMITS.code).toLowerCase();
  if (!CODE_PATTERN.test(code)) {
    fail('Campo "code" deve ser um slug (letras minúsculas, números e hífens).');
  }

  const fipe = optionalNumber(body["fipe_value"], "fipe_value");
  const market = optionalNumber(body["market_value"], "market_value");
  const garimpo = optionalNumber(body["garimpo_value"], "garimpo_value");

  // Servidor é a fonte de verdade dos derivados.
  const discount =
    fipe && fipe > 0 && garimpo !== null
      ? Math.round(((fipe - garimpo) / fipe) * 1000) / 10
      : optionalNumber(body["discount_fipe_percent"], "discount_fipe_percent");
  const marketDiff =
    market !== null && garimpo !== null
      ? Math.round((market - garimpo) * 100) / 100
      : optionalNumber(body["market_difference"], "market_difference");

  const status = enumValue(body["status"], "status", STATUSES, "AVAILABLE");
  const published = body["published"] === undefined ? false : Boolean(body["published"]);
  const now = new Date().toISOString();

  return {
    code,
    vehicle_name: requiredString(body["vehicle_name"], "vehicle_name", LIMITS.vehicleName),
    year: cleanString(body["year"], "year", 32),
    mileage_km: cleanString(body["mileage_km"], "mileage_km", 32),
    transmission: cleanString(body["transmission"], "transmission", LIMITS.shortText),
    fuel: cleanString(body["fuel"], "fuel", LIMITS.shortText),
    location: cleanString(body["location"], "location", LIMITS.shortText),
    fipe_value: fipe,
    market_value: market,
    internal_base_cost: optionalNumber(body["internal_base_cost"], "internal_base_cost"),
    internal_agio: optionalNumber(body["internal_agio"], "internal_agio"),
    garimpo_value: garimpo,
    discount_fipe_percent: discount,
    market_difference: marketDiff,
    positives: stringList(body["positives"], "positives"),
    attention_points: stringList(body["attention_points"], "attention_points"),
    garimpo_note: cleanString(body["garimpo_note"], "garimpo_note", LIMITS.note),
    access_type: enumValue(body["access_type"], "access_type", ACCESS_TYPES, "OPEN"),
    status,
    published,
    main_image_url: httpsUrl(body["main_image_url"], "main_image_url", 4096),
    published_at: published ? now : null,
    closed_at: status === "CLOSED" ? now : null,
  };
}
