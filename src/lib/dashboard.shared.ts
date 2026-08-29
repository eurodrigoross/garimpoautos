/**
 * Camada de inteligência do Dashboard Prime.
 * Deriva TODOS os indicadores dos registros de user_deals do próprio membro.
 * Não persiste métricas, não cria fonte financeira paralela.
 */

import { computeDeal, type DealStatus, type UserDeal } from "@/lib/deals.shared";

export type PeriodKey = "MONTH" | "M3" | "M6" | "YEAR" | "ALL";

export const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "MONTH", label: "ESTE MÊS" },
  { key: "M3", label: "3 MESES" },
  { key: "M6", label: "6 MESES" },
  { key: "YEAR", label: "ESTE ANO" },
  { key: "ALL", label: "TODO O PERÍODO" },
];

/** Status considerados "capital em operação" (adquirido e ainda não vendido). */
export const IN_OPERATION: DealStatus[] = ["ACQUIRED", "PREPARING", "FOR_SALE"];

export function periodStart(key: PeriodKey, now = new Date()): Date | null {
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (key) {
    case "MONTH":
      return new Date(y, m, 1);
    case "M3":
      return new Date(y, m - 2, 1);
    case "M6":
      return new Date(y, m - 5, 1);
    case "YEAR":
      return new Date(y, 0, 1);
    case "ALL":
    default:
      return null;
  }
}

/** sale_date vem como 'YYYY-MM-DD' — parse local para não deslocar o mês por fuso. */
export function parseSaleDate(v: string | null): Date | null {
  if (!v) return null;
  const [y, m, d] = v.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export type DashboardMetrics = {
  hasAnyDeal: boolean;
  /** Posição ATUAL (independe do período). */
  capitalInOperation: number;
  vehiclesInOperation: number;
  /** Métricas do período, por sale_date. */
  soldCount: number;
  revenue: number;
  soldCost: number;
  realizedResult: number | null;
  realizedReturnPct: number | null;
  pipeline: Record<DealStatus, number>;
  monthly: { key: string; label: string; result: number }[];
  lastSales: (UserDeal & { totalCost: number; result: number; returnPct: number | null })[];
  ongoing: (UserDeal & { totalCost: number; fipeMargin: number | null; belowFipePct: number | null })[];
};

const MONTH_LABEL = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export function buildDashboard(
  deals: UserDeal[],
  period: PeriodKey,
  now = new Date(),
): DashboardMetrics {
  const start = periodStart(period, now);

  const pipeline: Record<DealStatus, number> = {
    ANALYSIS: 0,
    ACQUIRED: 0,
    PREPARING: 0,
    FOR_SALE: 0,
    SOLD: 0,
  };
  for (const d of deals) pipeline[d.status] += 1;

  const operating = deals.filter((d) => IN_OPERATION.includes(d.status));
  const capitalInOperation = operating.reduce((acc, d) => acc + computeDeal(d).totalCost, 0);

  const soldAll = deals
    .filter((d) => d.status === "SOLD" && d.saleValue !== null && d.saleDate !== null)
    .map((d) => {
      const m = computeDeal(d);
      const date = parseSaleDate(d.saleDate);
      return { deal: d, totalCost: m.totalCost, saleValue: d.saleValue as number, date };
    })
    .filter((x): x is typeof x & { date: Date } => x.date !== null);

  const soldInPeriod = start ? soldAll.filter((x) => x.date >= start) : soldAll;

  const revenue = soldInPeriod.reduce((a, x) => a + x.saleValue, 0);
  const soldCost = soldInPeriod.reduce((a, x) => a + x.totalCost, 0);
  const hasSales = soldInPeriod.length > 0;
  const realizedResult = hasSales ? revenue - soldCost : null;
  const realizedReturnPct =
    hasSales && soldCost > 0 ? ((revenue - soldCost) / soldCost) * 100 : null;

  // Gráfico mensal (resultado realizado por mês) dentro do período selecionado.
  const buckets = new Map<string, number>();
  for (const x of soldInPeriod) {
    const key = `${x.date.getFullYear()}-${String(x.date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, (buckets.get(key) ?? 0) + (x.saleValue - x.totalCost));
  }
  const monthly = [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, result]) => ({
      key,
      label: MONTH_LABEL[Number(key.slice(5, 7)) - 1] ?? key,
      result,
    }));

  const lastSales = [...soldInPeriod]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map((x) => ({
      ...x.deal,
      totalCost: x.totalCost,
      result: x.saleValue - x.totalCost,
      returnPct: x.totalCost > 0 ? ((x.saleValue - x.totalCost) / x.totalCost) * 100 : null,
    }));

  const ongoing = operating
    .slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 4)
    .map((d) => {
      const m = computeDeal(d);
      return {
        ...d,
        totalCost: m.totalCost,
        fipeMargin: m.fipeMargin,
        belowFipePct: m.belowFipePct,
      };
    });

  return {
    hasAnyDeal: deals.length > 0,
    capitalInOperation,
    vehiclesInOperation: operating.length,
    soldCount: soldInPeriod.length,
    revenue,
    soldCost,
    realizedResult,
    realizedReturnPct,
    pipeline,
    monthly,
    lastSales,
    ongoing,
  };
}
