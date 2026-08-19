export type GarimpoStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "CLOSED";
export type GarimpoAccess = "OPEN" | "PRIME";

export const STATUS_LABEL: Record<GarimpoStatus, string> = {
  AVAILABLE: "GARIMPO DISPONÍVEL",
  RESERVED: "GARIMPO RESERVADO",
  SOLD: "GARIMPO VENDIDO",
  CLOSED: "GARIMPO ENCERRADO",
};

/** VENDIDO e ENCERRADO saem do fluxo de interesse — sem CTA de compra. */
export const isInactiveStatus = (s: GarimpoStatus) => s === "CLOSED" || s === "SOLD";

export const ACCESS_LABEL: Record<GarimpoAccess, string> = {
  OPEN: "GARIMPO ABERTO",
  PRIME: "GARIMPO PRIME",
};

/**
 * Modelo público do garimpo — espelha a view segura `public.garimpos_public`.
 * Campos internos (internal_base_cost, internal_agio) NUNCA chegam ao frontend.
 *
 * Campos esperados no futuro POST autenticado da extensão ("PUBLICAR NO RADAR"),
 * gravados em `public.garimpos` via Edge Function/API com service role no servidor:
 *   code (slug público único), vehicle_name, year, mileage_km, transmission, fuel,
 *   location, fipe_value, market_value, internal_base_cost, internal_agio,
 *   garimpo_value, discount_fipe_percent, market_difference, main_image_url,
 *   positives[], attention_points[], garimpo_note, access_type, status, published.
 */
export type Garimpo = {
  id: string;
  /** Código/slug público usado nas mensagens de WhatsApp. */
  code: string;
  vehicle: string;
  year?: string | undefined;
  km?: string | undefined;
  transmission?: string | undefined;
  fuel?: string | undefined;
  location?: string | undefined;
  /** Foto principal real. Nulo => placeholder neutro no card. */
  imageUrl?: string | undefined;
  fipe?: number | undefined;
  market?: number | undefined;
  garimpo?: number | undefined;
  belowFipePct?: number | undefined;
  marketDiff?: number | undefined;
  status: GarimpoStatus;
  access: GarimpoAccess;
  positives: string[];
  attentionPoints: string[];
  note?: string | undefined;
  publishedAt?: string | undefined;
  closedAt?: string | undefined;
  soldAt?: string | undefined;
};

/** Limite de garimpos ENCERRADOS exibidos publicamente. Prova de operação, não arquivo. */
export const PUBLIC_CLOSED_LIMIT = 6;

const byRecency = (a: Garimpo, b: Garimpo) =>
  (b.closedAt ?? b.publishedAt ?? "").localeCompare(a.closedAt ?? a.publishedAt ?? "");

export const openGarimpos = (list: Garimpo[]) =>
  list.filter((g) => g.access === "OPEN" && g.status !== "CLOSED").sort(byRecency);

export const primeGarimpos = (list: Garimpo[]) =>
  list.filter((g) => g.access === "PRIME" && g.status !== "CLOSED").sort(byRecency);

export const recentClosedGarimpos = (list: Garimpo[]) =>
  list
    .filter((g) => g.status === "CLOSED")
    .sort(byRecency)
    .slice(0, PUBLIC_CLOSED_LIMIT);
