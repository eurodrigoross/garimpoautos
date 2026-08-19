import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { formatBRL } from "@/lib/garimpo-finance";
import { usePrimeGarimpos } from "@/lib/prime.data";

export const Route = createFileRoute("/prime/_shell/calculadora")({
  head: () => ({ meta: [{ title: "Calculadora Prime — Garimpo Auto" }, { name: "robots", content: "noindex" }] }),
  component: Calculadora,
});

type Fields = {
  garimpo: string;
  transporte: string;
  documentacao: string;
  reparos: string;
  outros: string;
  fipe: string;
  market: string;
  vendaEstimada: string;
};

const EMPTY: Fields = {
  garimpo: "",
  transporte: "",
  documentacao: "",
  reparos: "",
  outros: "",
  fipe: "",
  market: "",
  vendaEstimada: "",
};

const n = (v: string) => {
  const parsed = Number(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

function Calculadora() {
  const [f, setF] = useState<Fields>(EMPTY);
  const { data: garimpos } = usePrimeGarimpos();

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [key]: e.target.value }));

  const result = useMemo(() => {
    const valorGarimpo = n(f.garimpo);
    const custoTotal =
      valorGarimpo + n(f.transporte) + n(f.documentacao) + n(f.reparos) + n(f.outros);
    const venda = n(f.vendaEstimada);
    const resultado = venda - custoTotal;
    const margem = custoTotal > 0 ? (resultado / custoTotal) * 100 : 0;
    const fipe = n(f.fipe);
    const market = n(f.market);
    return {
      custoTotal,
      resultado,
      margem,
      difFipe: fipe > 0 ? fipe - valorGarimpo : null,
      difMarket: market > 0 ? market - valorGarimpo : null,
    };
  }, [f]);

  function preencherComGarimpo(id: string) {
    const g = (garimpos ?? []).find((item) => item.id === id);
    if (!g) return;
    setF((prev) => ({
      ...prev,
      garimpo: g.garimpo ? String(g.garimpo) : prev.garimpo,
      fipe: g.fipe ? String(g.fipe) : prev.fipe,
      market: g.market ? String(g.market) : prev.market,
      vendaEstimada: g.market ? String(g.market) : prev.vendaEstimada,
    }));
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Calculadora de custo total</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Comece pelo Valor Garimpo — o valor final da oportunidade — e acrescente apenas os custos
          externos que se aplicam ao seu caso.
        </p>
      </header>

      {garimpos && garimpos.length > 0 ? (
        <label className="block max-w-sm">
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
            PREENCHER A PARTIR DE UM GARIMPO
          </span>
          <select
            onChange={(e) => preencherComGarimpo(e.target.value)}
            defaultValue=""
            className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          >
            <option value="">Selecionar…</option>
            {garimpos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} — {g.vehicle}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 rounded-xl border border-border/50 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-lg border border-border/50 bg-background/40 p-3">
            <Field label="VALOR GARIMPO (R$)" value={f.garimpo} onChange={set("garimpo")} />
            <p
              title="O Valor Garimpo já inclui valor do veículo, comissão do leiloeiro, taxas administrativas do leilão e ágio Garimpo."
              className="mt-2 text-[10px] leading-relaxed text-muted-foreground"
            >
              O Valor Garimpo já inclui valor do veículo, comissão do leiloeiro, taxas
              administrativas do leilão e ágio Garimpo. Não some esses custos novamente.
            </p>
          </div>
          <Field label="TRANSPORTE / REMOÇÃO (R$)" value={f.transporte} onChange={set("transporte")} />
          <Field label="DOCUMENTAÇÃO / DESPACHANTE (R$)" value={f.documentacao} onChange={set("documentacao")} />
          <Field label="REPAROS PREVISTOS (R$)" value={f.reparos} onChange={set("reparos")} />
          <Field label="OUTROS CUSTOS (R$)" value={f.outros} onChange={set("outros")} />
          <Field label="FIPE (R$)" value={f.fipe} onChange={set("fipe")} />
          <Field label="MÉDIA DE MERCADO (R$)" value={f.market} onChange={set("market")} />
          <Field label="PREÇO ESTIMADO DE VENDA (R$)" value={f.vendaEstimada} onChange={set("vendaEstimada")} />
          <button
            type="button"
            onClick={() => setF(EMPTY)}
            className="sm:col-span-2 justify-self-start rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            LIMPAR
          </button>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-border/50 p-5">
          <Row label="Custo total estimado" value={formatBRL(result.custoTotal)} strong />
          <div className="border-t border-border/40 pt-4">
            <Row
              label="Diferença para a FIPE"
              value={result.difFipe === null ? "—" : formatBRL(result.difFipe)}
            />
            <Row
              label="Diferença para a média de mercado"
              value={result.difMarket === null ? "—" : formatBRL(result.difMarket)}
            />
          </div>
          <div className="border-t border-border/40 pt-4">
            <Row label="Resultado bruto estimado" value={formatBRL(result.resultado)} strong />
            <Row
              label="Percentual sobre o custo"
              value={`${result.margem.toFixed(1).replace(".", ",")}%`}
            />
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Simulação baseada nos valores informados pelo usuário. Não representa garantia de venda,
            lucro ou resultado.
          </p>
        </aside>
      </div>
    </div>
  );
}


function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder="0"
        className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm tabular-nums outline-none focus:border-foreground/40"
      />
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={strong ? "text-base font-semibold tabular-nums" : "text-sm tabular-nums"}>
        {value}
      </span>
    </div>
  );
}
