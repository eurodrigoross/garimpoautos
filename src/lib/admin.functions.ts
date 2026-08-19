/**
 * Server functions do Painel Administrativo.
 * Toda leitura/escrita administrativa passa por:
 *   1) validação do bearer token do usuário (requireSupabaseAuth)
 *   2) verificação de papel `admin` no banco (public.has_role)
 *   3) somente então operações privilegiadas com service role.
 *
 * Nenhum campo interno (internal_base_cost / internal_agio) é acessível sem admin.
 */
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  ACCESS_TYPES,
  STATUSES,
  type RadarAccessType,
  type RadarStatus,
} from "@/lib/radar-contract";
import { computeFinance } from "@/lib/garimpo-finance";

const BUCKET = "garimpo-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 3650;

export const ADMIN_COLUMNS =
  "id, code, vehicle_name, year, mileage_km, transmission, fuel, location, fipe_value, market_value, internal_base_cost, internal_agio, garimpo_value, discount_fipe_percent, market_difference, main_image_url, positives, attention_points, garimpo_note, access_type, status, published, published_at, closed_at, created_at, updated_at";

export type AdminGarimpo = {
  id: string;
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
  main_image_url: string | null;
  positives: string[];
  attention_points: string[];
  garimpo_note: string | null;
  access_type: RadarAccessType;
  status: RadarStatus;
  published: boolean;
  published_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) {
      console.error("[admin] falha ao verificar papel", error.message);
      throw new Error("Unauthorized: role check failed");
    }
    if (data !== true) throw new Error("Forbidden: admin role required");
    return next({ context: { userId: context.userId } });
  });

const admin = async () => (await import("@/integrations/supabase/client.server")).supabaseAdmin;

/* ------------------------------- validação -------------------------------- */

const asObject = (v: unknown): Record<string, unknown> => {
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error("Payload inválido.");
  return v as Record<string, unknown>;
};

const asId = (v: unknown): { id: string } => {
  const o = asObject(v);
  const id = String(o["id"] ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("ID inválido.");
  return { id };
};

const optText = (v: unknown, max: number): string | null => {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  if (!s) return null;
  return s.slice(0, max);
};

const optNum = (v: unknown): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const num = Number(v);
  if (!Number.isFinite(num) || num < 0 || num > 100_000_000) return null;
  return Math.round(num * 100) / 100;
};

const list = (v: unknown): string[] =>
  Array.isArray(v)
    ? v
        .map((i) => optText(i, 200))
        .filter((i): i is string => Boolean(i))
        .slice(0, 12)
    : [];

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

/* ------------------------------- server fns -------------------------------- */

/** Verifica se o usuário autenticado é admin (não lança quando não for). */
export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: data === true, userId: context.userId };
  });

export const listGarimpos = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const db = await admin();
    const { data, error } = await db
      .from("garimpos")
      .select(ADMIN_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as AdminGarimpo[];
  });

export const getGarimpo = createServerFn({ method: "GET" })
  .inputValidator(asId)
  .middleware([requireAdmin])
  .handler(async ({ data: { id } }) => {
    const db = await admin();
    const { data, error } = await db.from("garimpos").select(ADMIN_COLUMNS).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Garimpo não encontrado.");
    return data as unknown as AdminGarimpo;
  });

export type GarimpoPatch = {
  id: string;
  vehicle_name?: string;
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
  positives?: string[];
  attention_points?: string[];
  garimpo_note?: string | null;
  access_type?: RadarAccessType;
  status?: RadarStatus;
  published?: boolean;
  main_image_url?: string | null;
};

export const updateGarimpo = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const o = asObject(raw);
    const { id } = asId(o);
    const patch: Record<string, unknown> = { id };
    const has = (k: string) => Object.prototype.hasOwnProperty.call(o, k);

    if (has("vehicle_name")) patch["vehicle_name"] = optText(o["vehicle_name"], 160) ?? "";
    for (const k of ["year", "mileage_km"] as const) if (has(k)) patch[k] = optText(o[k], 32);
    for (const k of ["transmission", "fuel", "location"] as const)
      if (has(k)) patch[k] = optText(o[k], 120);
    if (has("garimpo_note")) patch["garimpo_note"] = optText(o["garimpo_note"], 800);
    for (const k of [
      "fipe_value",
      "market_value",
      "internal_base_cost",
      "internal_agio",
      "garimpo_value",
    ] as const)
      if (has(k)) patch[k] = optNum(o[k]);
    if (has("positives")) patch["positives"] = list(o["positives"]);
    if (has("attention_points")) patch["attention_points"] = list(o["attention_points"]);
    if (has("access_type")) patch["access_type"] = oneOf(o["access_type"], ACCESS_TYPES, "OPEN");
    if (has("status")) patch["status"] = oneOf(o["status"], STATUSES, "AVAILABLE");
    if (has("published")) patch["published"] = Boolean(o["published"]);
    if (has("main_image_url")) {
      const url = optText(o["main_image_url"], 4096);
      if (url && !url.startsWith("https://")) throw new Error("A foto deve usar uma URL https.");
      patch["main_image_url"] = url;
    }
    return patch as GarimpoPatch;
  })
  .middleware([requireAdmin])
  .handler(async ({ data }) => {
    const db = await admin();
    const { id, ...patch } = data;

    const { data: current, error: readError } = await db
      .from("garimpos")
      .select(ADMIN_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!current) throw new Error("Garimpo não encontrado.");
    const row = current as unknown as AdminGarimpo;

    const merged = { ...row, ...patch } as AdminGarimpo;

    // Derivados sempre recalculados no servidor: nunca aceitar do cliente.
    const finance = computeFinance({
      fipe: merged.fipe_value,
      market: merged.market_value,
      garimpo: merged.garimpo_value,
      internalCost: merged.internal_base_cost,
      agio: merged.internal_agio,
    });

    const update: Record<string, unknown> = {
      ...patch,
      discount_fipe_percent: finance.discountFipePercent,
      market_difference: finance.marketDifference,
    };

    // Ciclo de vida coerente: encerrar carimba closed_at, reabrir limpa.
    if (patch.status !== undefined) {
      if (patch.status === "CLOSED") {
        update["closed_at"] = row.closed_at ?? new Date().toISOString();
      } else {
        update["closed_at"] = null;
      }
    }
    if (patch.published !== undefined) {
      update["published_at"] = patch.published ? (row.published_at ?? new Date().toISOString()) : null;
    }

    const { data: saved, error } = await db
      .from("garimpos")
      .update(update as never)
      .eq("id", id)
      .select(ADMIN_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return saved as unknown as AdminGarimpo;
  });

/** Upload/substituição da foto principal, reaproveitando o bucket existente. */
export const uploadGarimpoImage = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const o = asObject(raw);
    const code = optText(o["code"], 60) ?? "sem-code";
    const contentType = String(o["contentType"] ?? "");
    const base64 = String(o["base64"] ?? "");
    if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
      throw new Error("Formato inválido. Aceitos: JPEG, PNG ou WebP.");
    }
    if (!base64 || base64.length > 12_000_000) throw new Error("Imagem inválida ou muito grande.");
    return { code: code.toLowerCase().replace(/[^a-z0-9-]/g, "-"), contentType, base64 };
  })
  .middleware([requireAdmin])
  .handler(async ({ data }) => {
    const db = await admin();
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const ext = data.contentType === "image/png" ? "png" : data.contentType === "image/webp" ? "webp" : "jpg";
    const path = `${data.code}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(path, bin, { contentType: data.contentType, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: signed, error: signError } = await db.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL);
    if (signError || !signed?.signedUrl) throw new Error("Não foi possível gerar a URL da imagem.");

    return { main_image_url: signed.signedUrl, path };
  });

/* --------------------------- MEMBROS PRIME (admin) -------------------------- */

export type AdminMember = {
  userId: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  isAdmin: boolean;
  isPrime: boolean;
  status: string;
  expiresAt: string | null;
};

/** Lista usuários (Auth Admin API) cruzando papéis e assinaturas Prime. */
export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminMember[]> => {
    const db = await admin();
    const { data: users, error } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);

    const [{ data: memberships }, { data: roles }] = await Promise.all([
      db.from("memberships").select("user_id, status, expires_at, plan").eq("plan", "PRIME"),
      db.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);

    const byUser = new Map(
      (memberships ?? []).map((m) => [m.user_id as string, m as { status: string; expires_at: string | null }]),
    );
    const admins = new Set((roles ?? []).map((r) => r.user_id as string));

    return users.users.map((u) => {
      const m = byUser.get(u.id);
      const expired = Boolean(m?.expires_at && new Date(m.expires_at).getTime() <= Date.now());
      return {
        userId: u.id,
        email: u.email ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        isAdmin: admins.has(u.id),
        isPrime: m?.status === "active" && !expired,
        status: m?.status ?? "none",
        expiresAt: m?.expires_at ?? null,
      };
    });
  });

/** Ativa ou desativa manualmente o acesso Prime de um usuário. */
export const setMembership = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const o = asObject(raw);
    const { id } = asId({ id: o["user_id"] });
    const active = Boolean(o["active"]);
    const expiresRaw = optText(o["expires_at"], 40);
    let expires_at: string | null = null;
    if (expiresRaw) {
      const d = new Date(expiresRaw);
      if (Number.isNaN(d.getTime())) throw new Error("Data de vencimento inválida.");
      expires_at = d.toISOString();
    }
    return { user_id: id, active, expires_at };
  })
  .middleware([requireAdmin])
  .handler(async ({ data }) => {
    const db = await admin();
    const { error } = await db
      .from("memberships")
      .upsert(
        {
          user_id: data.user_id,
          plan: "PRIME",
          status: data.active ? "active" : "inactive",
          expires_at: data.active ? data.expires_at : null,
        } as never,
        { onConflict: "user_id,plan" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
