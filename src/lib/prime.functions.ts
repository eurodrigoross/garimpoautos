/**
 * Server functions da Área Prime.
 * Todo acesso passa por:
 *   1) validação do bearer token (requireSupabaseAuth)
 *   2) verificação de membership PRIME ativa ou papel admin (leitura direta com RLS)
 *   3) leitura via `context.supabase` — RLS continua aplicada como o próprio usuário.
 * Campos internos (internal_base_cost / internal_agio) nunca são selecionados aqui.
 */
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  PRIME_GARIMPO_COLUMNS,
  mapGarimpoRow,
  organizePrimeGarimpos,
  type PrimeContent,
  type PrimeSession,
} from "@/lib/prime.shared";

const requirePrime = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const [{ data: prime }, { data: isAdmin }] = await Promise.all([
      context.supabase
        .from("memberships")
        .select("id")
        .eq("user_id", context.userId)
        .eq("plan", "PRIME")
        .eq("status", "active")
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .maybeSingle(),
      context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle(),
    ]);
    if (!prime && !isAdmin) throw new Error("Forbidden: prime membership required");
    return next({ context: { userId: context.userId } });
  });

export const checkPrime = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PrimeSession> => {
    const [{ data: prime }, { data: isAdmin }, membership] = await Promise.all([
      context.supabase
        .from("memberships")
        .select("id")
        .eq("user_id", context.userId)
        .eq("plan", "PRIME")
        .eq("status", "active")
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .maybeSingle(),
      context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin")
        .maybeSingle(),
      context.supabase
        .from("memberships")
        .select("plan, status, starts_at, expires_at")
        .eq("user_id", context.userId)
        .eq("plan", "PRIME")
        .maybeSingle(),
    ]);
    const claims = context.claims as Record<string, unknown> | undefined;
    return {
      userId: context.userId,
      email: (claims?.["email"] as string) ?? null,
      createdAt: null,
      isPrime: Boolean(prime),
      isAdmin: Boolean(isAdmin),
      membership: (membership.data as PrimeSession["membership"]) ?? null,
    };
  });

export const listPrimeGarimpos = createServerFn({ method: "GET" })
  .middleware([requirePrime])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("garimpos")
      .select(PRIME_GARIMPO_COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return organizePrimeGarimpos((data ?? []).map((r) => mapGarimpoRow(r as Record<string, unknown>)));
  });

export const getPrimeGarimpo = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const id = String((raw as { id?: unknown })?.id ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("ID inválido.");
    return { id };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("garimpos")
      .select(PRIME_GARIMPO_COLUMNS)
      .eq("id", data.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Garimpo não encontrado ou indisponível.");
    return mapGarimpoRow(row as Record<string, unknown>);
  });

export const listPrimeContents = createServerFn({ method: "GET" })
  .middleware([requirePrime])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("prime_contents")
      .select("id, title, slug, category, excerpt, content, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PrimeContent[];
  });

export const getPrimeContent = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const slug = String((raw as { slug?: unknown })?.slug ?? "").slice(0, 160);
    if (!/^[a-z0-9-]{1,160}$/.test(slug)) throw new Error("Conteúdo inválido.");
    return { slug };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("prime_contents")
      .select("id, title, slug, category, excerpt, content, created_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Conteúdo não encontrado.");
    return row as PrimeContent;
  });
