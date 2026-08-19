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
};

const EMPTY: Fields = {
  garimpo: "",
  transporte: "",
  documentacao: "",
  reparos: "",
  outros: "",
  fipe: "",
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
    const custosExternos = n(f.transporte) + n(f.documentacao) + n(f.reparos) + n(f.outros);
    const custoTotal = valorGarimpo + custosExternos;
    const fipe = n(f.fipe);
    const margemFipe = fipe > 0 ? fipe - custoTotal : null;
    const margemPercent = fipe > 0 && custoTotal > 0 ? ((fipe - custoTotal) / custoTotal) * 100 : null;
    return { valorGarimpo, custosExternos, custoTotal, margemFipe, margemPercent };
  }, [f]);

  function preencherComGarimpo(id: string) {
    const g = (garimpos ?? []).find((item) => item.id === id);
    if (!g) return;
    setF((prev) => ({
      ...prev,
      garimpo: g.garimpo ? String(g.garimpo) : prev.garimpo,
      fipe: g.fipe ? String(g.fipe) : prev.fipe,
    }));
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Calculadora de custo total</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          O Valor Garimpo já é o valor final da oportunidade. Aqui você soma apenas os custos
          externos do seu caso e compara o custo total com a FIPE.
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
          <button
            type="button"
            onClick={() => setF(EMPTY)}
            className="sm:col-span-2 justify-self-start rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            LIMPAR
          </button>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-border/50 p-5">
          <Row label="Valor Garimpo (final)" value={formatBRL(result.valorGarimpo)} />
          <Row label="Custos externos" value={formatBRL(result.custosExternos)} />
          <div className="border-t border-border/40 pt-4">
            <Row label="Custo total estimado" value={formatBRL(result.custoTotal)} strong />
          </div>
          <div className="border-t border-border/40 pt-4">
            <Row
              label="Margem até a FIPE"
              value={result.margemFipe === null ? "—" : formatBRL(result.margemFipe)}
              strong
            />
            <Row
              label="Percentual sobre o custo total"
              value={
                result.margemPercent === null
                  ? "—"
                  : `${result.margemPercent.toFixed(1).replace(".", ",")}%`
              }
            />
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            A FIPE é referência de mercado, não preço de venda garantido. Simulação baseada nos
            valores informados por você — não representa garantia de venda, lucro ou resultado.
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
