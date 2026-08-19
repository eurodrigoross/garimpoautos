export type TeaserRow = Record<string, unknown> & {
  status?: string | null;
};

/**
 * Mascara os números sensíveis dos garimpos PRIME que ainda não foram encerrados.
 * Mesma regra que a antiga view `garimpos_teaser`, agora aplicada no servidor.
 */
export const maskTeaserRow = (row: TeaserRow): TeaserRow => {
  if (row.status === "CLOSED") return row;
  return {
    ...row,
    garimpo_value: null,
    market_difference: null,
    garimpo_note: null,
  };
};
