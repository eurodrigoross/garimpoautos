export type GarimpoStatus = "DISPONIVEL" | "RESERVADO" | "ENCERRADO";

export const STATUS_LABEL: Record<GarimpoStatus, string> = {
  DISPONIVEL: "GARIMPO DISPONÍVEL",
  RESERVADO: "GARIMPO RESERVADO",
  ENCERRADO: "GARIMPO ENCERRADO",
};

export type Garimpo = {
  id: string;
  vehicle: string;
  year: string;
  km: string;
  location: string;
  fipe: number;
  market: number;
  garimpo: number;
  belowFipePct: number;
  marketDiff: number;
  status: GarimpoStatus;
};

/** Fonte única dos garimpos exibidos na landing. Futuramente virá de API/banco. */
export const GARIMPOS: Garimpo[] = [
  {
    id: "argo-2024",
    vehicle: "FIAT ARGO 1.0 FIREFLY FLEX DRIVE MANUAL",
    year: "2024/2025",
    km: "40.451 km",
    location: "VILA ÁGUA FUNDA — SÃO PAULO / SP",
    fipe: 71232,
    market: 80990,
    garimpo: 48275,
    belowFipePct: 32.2,
    marketDiff: 32715,
    status: "ENCERRADO",
  },
];
