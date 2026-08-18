export type GarimpoStatus = "AVAILABLE" | "RESERVED" | "CLOSED";
export type GarimpoAccess = "OPEN" | "PRIME";

export const STATUS_LABEL: Record<GarimpoStatus, string> = {
  AVAILABLE: "GARIMPO DISPONÍVEL",
  RESERVED: "GARIMPO RESERVADO",
  CLOSED: "GARIMPO ENCERRADO",
};

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
  year?: string;
  km?: string;
  transmission?: string;
  fuel?: string;
  location?: string;
  /** Foto principal real. Nulo => placeholder neutro no card. */
  imageUrl?: string;
  fipe?: number;
  market?: number;
  garimpo?: number;
  belowFipePct?: number;
  marketDiff?: number;
  status: GarimpoStatus;
  access: GarimpoAccess;
  positives: string[];
  attentionPoints: string[];
  note?: string;
  publishedAt?: string;
  closedAt?: string;
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
