/**
 * Regras financeiras centralizadas do GARIMPO AUTO.
 * Mesmas fórmulas usadas pelo endpoint da extensão (radar-contract) e pelo Admin.
 * Não duplicar cálculo em componentes.
 */

export type FinanceInput = {
  fipe?: number | null | undefined;
  market?: number | null | undefined;
  garimpo?: number | null | undefined;
  internalCost?: number | null | undefined;
  agio?: number | null | undefined;
};

export type FinanceDerived = {
  /** % abaixo da FIPE: (fipe - garimpo) / fipe */
  discountFipePercent: number | null;
  /** Diferença para a média de mercado: market - garimpo */
  marketDifference: number | null;
  /** Diferença para a FIPE: fipe - garimpo */
  fipeDifference: number | null;
  /** Lucro bruto interno: garimpo - custo interno (ágio já compõe o custo do lote) */
  grossProfit: number | null;
};

const n = (v: number | null | undefined): number | null =>
  v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

const money = (v: number) => Math.round(v * 100) / 100;

export function computeFinance(input: FinanceInput): FinanceDerived {
  const fipe = n(input.fipe);
  const market = n(input.market);
  const garimpo = n(input.garimpo);
  const cost = n(input.internalCost);

  return {
    discountFipePercent:
      fipe !== null && fipe > 0 && garimpo !== null
        ? Math.round(((fipe - garimpo) / fipe) * 1000) / 10
        : null,
    marketDifference: market !== null && garimpo !== null ? money(market - garimpo) : null,
    fipeDifference: fipe !== null && garimpo !== null ? money(fipe - garimpo) : null,
    grossProfit: garimpo !== null && cost !== null ? money(garimpo - cost) : null,
  };
}

export const formatBRL = (v: number | null | undefined): string =>
  v === null || v === undefined
    ? "—"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(Number(v));

export const formatPct = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : `${Number(v).toLocaleString("pt-BR")}%`;

export const formatDate = (v: string | null | undefined): string =>
  !v ? "—" : new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
