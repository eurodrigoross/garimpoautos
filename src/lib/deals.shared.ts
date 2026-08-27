/**
 * Tipos e cálculos do módulo MEUS ARREMATES (registros pessoais do membro Prime).
 * Mantido fora de *.functions.ts para preservar o code-splitting das server functions.
 */

export type DealSource = "GARIMPO_AUTO" | "MANUAL";
export type DealStatus = "ANALYSIS" | "ACQUIRED" | "PREPARING" | "FOR_SALE" | "SOLD";

export const DEAL_STATUS_LABEL: Record<DealStatus, string> = {
  ANALYSIS: "EM ANÁLISE",
  ACQUIRED: "COMPRADO",
  PREPARING: "EM PREPARAÇÃO",
  FOR_SALE: "À VENDA",
  SOLD: "VENDIDO",
};

export const DEAL_STATUS_ORDER: DealStatus[] = [
  "ANALYSIS",
  "ACQUIRED",
  "PREPARING",
  "FOR_SALE",
  "SOLD",
];

export const DEAL_SOURCE_LABEL: Record<DealSource, string> = {
  GARIMPO_AUTO: "GARIMPO AUTO",
  MANUAL: "MANUAL",
};

export type UserDeal = {
  id: string;
  source: DealSource;
  garimpoId: string | null;
  garimpoCode: string | null;
  vehicleName: string;
  yearModel: string | null;
  imageUrl: string | null;
  acquisitionValue: number;
  fipeValue: number | null;
  transportCost: number;
  documentationCost: number;
  repairCost: number;
  otherCost: number;
  status: DealStatus;
  notes: string | null;
  saleValue: number | null;
  saleDate: string | null;
  saleNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const DEAL_COLUMNS =
  "id, source, garimpo_id, garimpo_code, vehicle_name, year_model, image_url, acquisition_value, fipe_value, transport_cost, documentation_cost, repair_cost, other_cost, status, notes, sale_value, sale_date, sale_notes, created_at, updated_at";

const n = (v: unknown) => (v === null || v === undefined ? 0 : Number(v));
const nn = (v: unknown) => (v === null || v === undefined ? null : Number(v));
const s = (v: unknown) => (v === null || v === undefined ? null : String(v));

export function mapDealRow(row: Record<string, unknown>): UserDeal {
  return {
    id: row["id"] as string,
    source: (row["source"] as DealSource) ?? "MANUAL",
    garimpoId: s(row["garimpo_id"]),
    garimpoCode: s(row["garimpo_code"]),
    vehicleName: (row["vehicle_name"] as string) ?? "",
    yearModel: s(row["year_model"]),
    imageUrl: s(row["image_url"]),
    acquisitionValue: n(row["acquisition_value"]),
    fipeValue: nn(row["fipe_value"]),
    transportCost: n(row["transport_cost"]),
    documentationCost: n(row["documentation_cost"]),
    repairCost: n(row["repair_cost"]),
    otherCost: n(row["other_cost"]),
    status: (row["status"] as DealStatus) ?? "ANALYSIS",
    notes: s(row["notes"]),
    saleValue: nn(row["sale_value"]),
    saleDate: s(row["sale_date"]),
    saleNotes: s(row["sale_notes"]),
    createdAt: String(row["created_at"]),
    updatedAt: String(row["updated_at"]),
  };
}

export type DealMath = {
  costs: number;
  totalCost: number;
  fipeMargin: number | null;
  belowFipePct: number | null;
  realizedResult: number | null;
  realizedPct: number | null;
};

/** Cálculo único usado pela Calculadora e por Meus Arremates. */
export function computeDeal(input: {
  acquisitionValue: number;
  fipeValue?: number | null;
  transportCost?: number;
  documentationCost?: number;
  repairCost?: number;
  otherCost?: number;
  saleValue?: number | null;
  status?: DealStatus;
}): DealMath {
  const costs =
    (input.transportCost ?? 0) +
    (input.documentationCost ?? 0) +
    (input.repairCost ?? 0) +
    (input.otherCost ?? 0);
  const totalCost = (input.acquisitionValue ?? 0) + costs;
  const fipe = input.fipeValue ?? 0;
  const fipeMargin = fipe > 0 ? fipe - totalCost : null;
  const belowFipePct = fipe > 0 ? ((fipe - totalCost) / fipe) * 100 : null;

  const sold = input.status === "SOLD" && input.saleValue !== null && input.saleValue !== undefined;
  const realizedResult = sold ? (input.saleValue as number) - totalCost : null;
  const realizedPct =
    sold && totalCost > 0 ? (((input.saleValue as number) - totalCost) / totalCost) * 100 : null;

  return { costs, totalCost, fipeMargin, belowFipePct, realizedResult, realizedPct };
}

export function formatPct(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return "—";
  return `${v.toFixed(1).replace(".", ",")}%`;
}
