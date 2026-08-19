/**
 * Tipos e helpers compartilhados da Área Prime.
 * Mantido fora de *.functions.ts para não quebrar o code-splitting das server functions.
 */
import type { Garimpo, GarimpoAccess, GarimpoStatus } from "@/lib/garimpos";

/** Colunas liberadas ao membro Prime. internal_base_cost / internal_agio JAMAIS entram aqui. */
export const PRIME_GARIMPO_COLUMNS =
  "id, code, vehicle_name, year, mileage_km, transmission, fuel, location, fipe_value, market_value, garimpo_value, discount_fipe_percent, market_difference, main_image_url, positives, attention_points, garimpo_note, access_type, status, published_at, closed_at, sold_at";

/** Limite de encerrados/vendidos recentes carregados na Área Prime. */
export const PRIME_CLOSED_LIMIT = 20;

export type PrimeContent = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  created_at: string;
};

export type PrimeMembership = {
  plan: string;
  status: "active" | "inactive" | "expired" | "cancelled";
  starts_at: string | null;
  expires_at: string | null;
} | null;

export type PrimeSession = {
  userId: string;
  email: string | null;
  createdAt: string | null;
  isPrime: boolean;
  isAdmin: boolean;
  membership: PrimeMembership;
};

export type PrimeMember = {
  userId: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  isAdmin: boolean;
  isPrime: boolean;
  status: string;
  expiresAt: string | null;
};

const num = (v: unknown): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);
const str = (v: unknown): string | undefined => (v === null || v === undefined ? undefined : String(v));

/** Converte a linha do banco no modelo `Garimpo` já usado pela landing. */
export function mapGarimpoRow(row: Record<string, unknown>): Garimpo {
  return {
    id: row["id"] as string,
    code: row["code"] as string,
    vehicle: row["vehicle_name"] as string,
    year: str(row["year"]),
    km: str(row["mileage_km"]),
    transmission: str(row["transmission"]),
    fuel: str(row["fuel"]),
    location: str(row["location"]),
    imageUrl: str(row["main_image_url"]),
    fipe: num(row["fipe_value"]),
    market: num(row["market_value"]),
    garimpo: num(row["garimpo_value"]),
    belowFipePct: num(row["discount_fipe_percent"]),
    marketDiff: num(row["market_difference"]),
    status: ((row["status"] as string) ?? "AVAILABLE") as GarimpoStatus,
    access: ((row["access_type"] as string) ?? "OPEN") as GarimpoAccess,
    positives: (row["positives"] as string[]) ?? [],
    attentionPoints: (row["attention_points"] as string[]) ?? [],
    note: str(row["garimpo_note"]),
    publishedAt: str(row["published_at"]),
    closedAt: str(row["closed_at"]),
  };
}

/** Ordena e limita: ativos/reservados primeiro, depois encerrados recentes. */
export function organizePrimeGarimpos(all: Garimpo[]): Garimpo[] {
  const openOnes = all.filter((g) => g.status !== "CLOSED");
  const closed = all
    .filter((g) => g.status === "CLOSED")
    .sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""))
    .slice(0, PRIME_CLOSED_LIMIT);
  return [...openOnes, ...closed];
}
