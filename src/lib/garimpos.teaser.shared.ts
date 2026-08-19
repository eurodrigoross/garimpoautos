export type TeaserValue = string | number | boolean | string[] | null;

export type TeaserRow = {
  [key: string]: TeaserValue;
  status: string | null;
};

/**
 * Mascara os números sensíveis dos garimpos PRIME ainda ativos.
 * Encerrados e vendidos viram histórico público — números liberados.
 */
export const maskTeaserRow = (row: TeaserRow): TeaserRow => {
  if (row.status === "CLOSED" || row.status === "SOLD") return row;
  return {
    ...row,
    garimpo_value: null,
    market_difference: null,
    garimpo_note: null,
  };
};
