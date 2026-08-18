export type GarimpoStatus = "DISPONIVEL" | "RESERVADO" | "ENCERRADO";
export type GarimpoAccess = "ABERTO" | "PRIME";

export const STATUS_LABEL: Record<GarimpoStatus, string> = {
  DISPONIVEL: "GARIMPO DISPONÍVEL",
  RESERVADO: "GARIMPO RESERVADO",
  ENCERRADO: "GARIMPO ENCERRADO",
};

export const ACCESS_LABEL: Record<GarimpoAccess, string> = {
  ABERTO: "GARIMPO ABERTO",
  PRIME: "GARIMPO PRIME",
};

export type Garimpo = {
  id: string;
  vehicle: string;
  year: string;
  km: string;
  transmission?: string;
  fuel?: string;
  location: string;
  /** Foto principal real. Vazio/ausente => placeholder neutro no card. */
  imageUrl?: string;
  fipe: number;
  market: number;
  garimpo: number;
  belowFipePct: number;
  marketDiff: number;
  status: GarimpoStatus;
  access: GarimpoAccess;
  /** Preenchidos manualmente pela operação/extensão/admin. Nunca gerados automaticamente. */
  positives: string[];
  attentionPoints: string[];
  note?: string;
  /** ISO date strings — prontos para ordenação/consulta futura no banco. */
  publishedAt?: string;
  closedAt?: string;
};

/**
 * Fonte única dos garimpos exibidos na landing.
 * Futuramente virá de API/banco (ex.: select ... where status='ENCERRADO'
 * order by closed_at desc limit PUBLIC_CLOSED_LIMIT).
 */
export const GARIMPOS: Garimpo[] = [
  {
    id: "argo-2024",
    vehicle: "FIAT ARGO 1.0 FIREFLY FLEX DRIVE MANUAL",
    year: "2024/2025",
    km: "40.451 km",
    transmission: "MANUAL",
    fuel: "FLEX",
    location: "VILA ÁGUA FUNDA — SÃO PAULO / SP",
    fipe: 71232,
    market: 80990,
    garimpo: 48275,
    belowFipePct: 32.2,
    marketDiff: 32715,
    status: "ENCERRADO",
    access: "ABERTO",
    positives: [],
    attentionPoints: [],
  },
];

/** Limite de garimpos ENCERRADOS exibidos publicamente. Prova de operação, não arquivo. */
export const PUBLIC_CLOSED_LIMIT = 6;

const byRecency = (a: Garimpo, b: Garimpo) =>
  (b.closedAt ?? b.publishedAt ?? "").localeCompare(a.closedAt ?? a.publishedAt ?? "");

export const openGarimpos = (list: Garimpo[] = GARIMPOS) =>
  list.filter((g) => g.access === "ABERTO" && g.status !== "ENCERRADO").sort(byRecency);

export const primeGarimpos = (list: Garimpo[] = GARIMPOS) =>
  list.filter((g) => g.access === "PRIME" && g.status !== "ENCERRADO").sort(byRecency);

export const recentClosedGarimpos = (list: Garimpo[] = GARIMPOS) =>
  list
    .filter((g) => g.status === "ENCERRADO")
    .sort(byRecency)
    .slice(0, PUBLIC_CLOSED_LIMIT);
