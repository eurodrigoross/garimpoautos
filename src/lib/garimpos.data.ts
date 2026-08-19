import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Garimpo, GarimpoAccess, GarimpoStatus } from "@/lib/garimpos";
import { getPrimeTeasers } from "@/lib/garimpos.teaser.functions";

/** Colunas explícitas da fonte pública segura. Nunca usar SELECT * na tabela administrativa. */
const PUBLIC_COLUMNS =
  "id, code, vehicle_name, year, mileage_km, transmission, fuel, location, fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference, main_image_url, positives, attention_points, garimpo_note, access_type, status, published_at, closed_at";

const num = (v: number | string | null): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);

const str = (v: string | null): string | undefined => v ?? undefined;

type Row = Record<string, unknown>;

const mapRow = (row: Row): Garimpo => ({
  id: row["id"] as string,
  code: row["code"] as string,
  vehicle: row["vehicle_name"] as string,
  year: str(row["year"] as string | null),
  km: str(row["mileage_km"] as string | null),
  transmission: str(row["transmission"] as string | null),
  fuel: str(row["fuel"] as string | null),
  location: str(row["location"] as string | null),
  imageUrl: str(row["main_image_url"] as string | null),
  fipe: num(row["fipe_value"] as number | null),
  market: num(row["market_value"] as number | null),
  garimpo: num(row["garimpo_value"] as number | null),
  belowFipePct: num(row["discount_fipe_percent"] as number | null),
  marketDiff: num(row["market_difference"] as number | null),
  status: ((row["status"] as string) ?? "AVAILABLE") as GarimpoStatus,
  access: ((row["access_type"] as string) ?? "OPEN") as GarimpoAccess,
  positives: (row["positives"] as string[]) ?? [],
  attentionPoints: (row["attention_points"] as string[]) ?? [],
  note: str(row["garimpo_note"] as string | null),
  publishedAt: str(row["published_at"] as string | null),
  closedAt: str(row["closed_at"] as string | null),
});

const sortGarimpos = (list: Garimpo[]) =>
  [...list].sort((a, b) =>
    (b.closedAt ?? b.publishedAt ?? "").localeCompare(a.closedAt ?? a.publishedAt ?? ""),
  );

/**
 * Fonte pública do radar.
 * - `garimpos_public`: dados completos dos garimpos abertos (e do que o usuário pode ver).
 * - `getPrimeTeasers`: versão mascarada dos garimpos PRIME, calculada no servidor,
 *   sem números sensíveis enquanto não estiverem encerrados.
 * Quando a linha existe nas duas fontes, a versão completa prevalece.
 */
export async function fetchPublicGarimpos(): Promise<Garimpo[]> {
  const [full, teaser] = await Promise.all([
    supabase.from("garimpos_public").select(PUBLIC_COLUMNS),
    getPrimeTeasers().catch(() => [] as Row[]),
  ]);

  if (full.error && teaser.length === 0) throw full.error;

  const byId = new Map<string, Garimpo>();
  for (const row of teaser as Row[]) {
    const g = mapRow(row);
    byId.set(g.id, g);
  }
  for (const row of (full.data ?? []) as Row[]) {
    const g = mapRow(row);
    byId.set(g.id, g);
  }

  return sortGarimpos([...byId.values()]);
}

export const garimposQueryOptions = {
  queryKey: ["garimpos-public"] as const,
  queryFn: fetchPublicGarimpos,
  staleTime: 60_000,
};

export const useGarimpos = () => useQuery(garimposQueryOptions);
