import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Garimpo, GarimpoAccess, GarimpoStatus } from "@/lib/garimpos";

/** Colunas explícitas da fonte pública segura. Nunca usar SELECT * na tabela administrativa. */
const PUBLIC_COLUMNS =
  "id, code, vehicle_name, year, mileage_km, transmission, fuel, location, fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference, main_image_url, positives, attention_points, garimpo_note, access_type, status, published_at, closed_at";

const num = (v: number | string | null): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);

const str = (v: string | null): string | undefined => v ?? undefined;

export async function fetchPublicGarimpos(): Promise<Garimpo[]> {
  const { data, error } = await supabase
    .from("garimpos_public")
    .select(PUBLIC_COLUMNS)
    .order("closed_at", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    code: row.code as string,
    vehicle: row.vehicle_name as string,
    year: str(row.year),
    km: str(row.mileage_km),
    transmission: str(row.transmission),
    fuel: str(row.fuel),
    location: str(row.location),
    imageUrl: str(row.main_image_url),
    fipe: num(row.fipe_value),
    market: num(row.market_value),
    garimpo: num(row.garimpo_value),
    belowFipePct: num(row.discount_fipe_percent),
    marketDiff: num(row.market_difference),
    status: (row.status ?? "AVAILABLE") as GarimpoStatus,
    access: (row.access_type ?? "OPEN") as GarimpoAccess,
    positives: (row.positives ?? []) as string[],
    attentionPoints: (row.attention_points ?? []) as string[],
    note: str(row.garimpo_note),
    publishedAt: str(row.published_at),
    closedAt: str(row.closed_at),
  }));
}

export const garimposQueryOptions = {
  queryKey: ["garimpos-public"] as const,
  queryFn: fetchPublicGarimpos,
  staleTime: 60_000,
};

export const useGarimpos = () => useQuery(garimposQueryOptions);
