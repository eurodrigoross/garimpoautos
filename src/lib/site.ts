import type { Garimpo } from "@/lib/garimpos";

const WHATSAPP_NUMBER = "5521967718285";

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_FREE = waLink(
  "Olá, quero entrar no grupo gratuito da Garimpo Auto",
);

export const WHATSAPP_PRIME = waLink(
  "Olá, quero assinar o Garimpo Prime (R$50/mês)",
);

export const brl = (v?: number | null) =>
  typeof v === "number"
    ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
    : "—";

/** Mensagem contextualizada por garimpo — sempre com código, veículo e Valor Garimpo. */
export const waGarimpoLink = (g: Garimpo) =>
  waLink(
    [
      "Olá, quero esse garimpo.",
      `Código: ${g.code}`,
      `Veículo: ${g.vehicle}`,
      typeof g.garimpo === "number" ? `Valor Garimpo: ${brl(g.garimpo)}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );

export const waGarimpoPrimeLink = (g?: Garimpo) =>
  waLink(
    g
      ? `Olá, quero desbloquear um Garimpo Prime.\nCódigo: ${g.code}\nVeículo: ${g.vehicle}`
      : "Olá, quero ser Garimpo Prime e desbloquear as oportunidades exclusivas",
  );
