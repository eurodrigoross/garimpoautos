/**
 * Server functions do módulo MEUS ARREMATES.
 * Toda leitura/escrita usa `context.supabase` (RLS como o próprio usuário),
 * portanto um membro nunca alcança registros de outro.
 */
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEAL_COLUMNS, mapDealRow, type DealStatus, type UserDeal } from "@/lib/deals.shared";

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
    return next({ context: { userId: context.userId, supabase: context.supabase } });
  });

const STATUSES: DealStatus[] = ["ANALYSIS", "ACQUIRED", "PREPARING", "FOR_SALE", "SOLD"];

const money = (v: unknown, fallback = 0): number => {
  const num = Number(v);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return Math.min(num, 100_000_000);
};
const optMoney = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  return money(v);
};
const text = (v: unknown, max: number): string | null => {
  if (v === null || v === undefined) return null;
  const t = String(v).trim().slice(0, max);
  return t.length ? t : null;
};
const uuid = (v: unknown): string | null => {
  const t = String(v ?? "");
  return /^[0-9a-f-]{36}$/i.test(t) ? t : null;
};

export const listMyDeals = createServerFn({ method: "GET" })
  .middleware([requirePrime])
  .handler(async ({ context }): Promise<UserDeal[]> => {
    const { data, error } = await context.supabase
      .from("user_deals")
      .select(DEAL_COLUMNS)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => mapDealRow(r as Record<string, unknown>));
  });

export const getMyDeal = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => {
    const id = uuid((raw as { id?: unknown })?.id);
    if (!id) throw new Error("Registro inválido.");
    return { id };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }): Promise<UserDeal> => {
    const { data: row, error } = await context.supabase
      .from("user_deals")
      .select(DEAL_COLUMNS)
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Registro não encontrado.");
    return mapDealRow(row as Record<string, unknown>);
  });

export const createMyDeal = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const vehicleName = text(r["vehicleName"], 160);
    if (!vehicleName) throw new Error("Informe o veículo.");
    const source: "GARIMPO_AUTO" | "MANUAL" = r["source"] === "GARIMPO_AUTO" ? "GARIMPO_AUTO" : "MANUAL";
    const status: DealStatus = r["status"] === "ACQUIRED" ? "ACQUIRED" : "ANALYSIS";
    return {
      source,
      status,
      garimpoId: source === "GARIMPO_AUTO" ? uuid(r["garimpoId"]) : null,
      garimpoCode: source === "GARIMPO_AUTO" ? text(r["garimpoCode"], 60) : null,
      imageUrl: source === "GARIMPO_AUTO" ? text(r["imageUrl"], 4096) : null,
      vehicleName,
      yearModel: text(r["yearModel"], 40),
      acquisitionValue: money(r["acquisitionValue"]),
      fipeValue: optMoney(r["fipeValue"]),
      transportCost: money(r["transportCost"]),
      documentationCost: money(r["documentationCost"]),
      repairCost: money(r["repairCost"]),
      otherCost: money(r["otherCost"]),
      notes: text(r["notes"], 2000),
    };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }): Promise<UserDeal> => {
    const { data: row, error } = await context.supabase
      .from("user_deals")
      .insert({
        user_id: context.userId,
        source: data.source,
        status: data.status,
        garimpo_id: data.garimpoId,
        garimpo_code: data.garimpoCode,
        image_url: data.imageUrl,
        vehicle_name: data.vehicleName,
        year_model: data.yearModel,
        acquisition_value: data.acquisitionValue,
        fipe_value: data.fipeValue,
        transport_cost: data.transportCost,
        documentation_cost: data.documentationCost,
        repair_cost: data.repairCost,
        other_cost: data.otherCost,
        notes: data.notes,
      })
      .select(DEAL_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return mapDealRow(row as Record<string, unknown>);
  });

export const updateMyDeal = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const id = uuid(r["id"]);
    if (!id) throw new Error("Registro inválido.");
    const status = STATUSES.includes(r["status"] as DealStatus)
      ? (r["status"] as DealStatus)
      : undefined;
    if (status === "SOLD") {
      const saleValue = optMoney(r["saleValue"]);
      if (saleValue === null || saleValue <= 0)
        throw new Error("Informe o valor real da venda para marcar como VENDIDO.");
    }
    return {
      id,
      status,
      vehicleName: text(r["vehicleName"], 160),
      yearModel: text(r["yearModel"], 40),
      acquisitionValue: r["acquisitionValue"] === undefined ? undefined : money(r["acquisitionValue"]),
      fipeValue: r["fipeValue"] === undefined ? undefined : optMoney(r["fipeValue"]),
      transportCost: r["transportCost"] === undefined ? undefined : money(r["transportCost"]),
      documentationCost:
        r["documentationCost"] === undefined ? undefined : money(r["documentationCost"]),
      repairCost: r["repairCost"] === undefined ? undefined : money(r["repairCost"]),
      otherCost: r["otherCost"] === undefined ? undefined : money(r["otherCost"]),
      notes: r["notes"] === undefined ? undefined : text(r["notes"], 2000),
      saleValue: r["saleValue"] === undefined ? undefined : optMoney(r["saleValue"]),
      saleDate: r["saleDate"] === undefined ? undefined : text(r["saleDate"], 10),
      saleNotes: r["saleNotes"] === undefined ? undefined : text(r["saleNotes"], 1000),
    };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }): Promise<UserDeal> => {
    const patch: Record<string, unknown> = {};
    const set = (key: string, value: unknown) => {
      if (value !== undefined) patch[key] = value;
    };
    set("status", data.status);
    set("vehicle_name", data.vehicleName ?? undefined);
    set("year_model", data.yearModel);
    set("acquisition_value", data.acquisitionValue);
    set("fipe_value", data.fipeValue);
    set("transport_cost", data.transportCost);
    set("documentation_cost", data.documentationCost);
    set("repair_cost", data.repairCost);
    set("other_cost", data.otherCost);
    set("notes", data.notes);
    set("sale_value", data.saleValue);
    set("sale_date", data.saleDate);
    set("sale_notes", data.saleNotes);

    if (data.status && data.status !== "SOLD") {
      patch["sale_value"] = null;
      patch["sale_date"] = null;
      patch["sale_notes"] = null;
    }
    if (data.status === "SOLD" && patch["sale_date"] === undefined) {
      patch["sale_date"] = new Date().toISOString().slice(0, 10);
    }

    const { data: row, error } = await context.supabase
      .from("user_deals")
      .update(patch as never)
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .select(DEAL_COLUMNS)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Registro não encontrado.");
    return mapDealRow(row as Record<string, unknown>);
  });

export const deleteMyDeal = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const id = uuid((raw as { id?: unknown })?.id);
    if (!id) throw new Error("Registro inválido.");
    return { id };
  })
  .middleware([requirePrime])
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("user_deals")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
