import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { formatBRL } from "@/lib/garimpo-finance";
import { usePrimeGarimpos } from "@/lib/prime.data";

export const Route = createFileRoute("/prime/_shell/calculadora")({
  head: () => ({ meta: [{ title: "Calculadora Prime — Garimpo Auto" }, { name: "robots", content: "noindex" }] }),
  component: Calculadora,
});

type Fields = {
  lance: string;
  comissaoPct: string;
  taxas: string;
  transferencia: string;
  logistica: string;
  reparos: string;
  reserva: string;
  vendaEstimada: string;
};

const EMPTY: Fields = {
  lance: "",
  comissaoPct: "5",
  taxas: "",
  transferencia: "",
  logistica: "",
  reparos: "",
  reserva: "",
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
    const lance = n(f.lance);
    const comissao = (lance * n(f.comissaoPct)) / 100;
    const custoTotal =
      lance +
      comissao +
      n(f.taxas) +
      n(f.transferencia) +
      n(f.logistica) +
      n(f.reparos) +
      n(f.reserva);
    const venda = n(f.vendaEstimada);
    const resultado = venda - custoTotal;
    const margem = custoTotal > 0 ? (resultado / custoTotal) * 100 : 0;
    return { comissao, custoTotal, resultado, margem };
  }, [f]);

  function preencherComGarimpo(id: string) {
    const g = (garimpos ?? []).find((item) => item.id === id);
    if (!g) return;
    setF((prev) => ({
      ...prev,
      lance: g.garimpo ? String(g.garimpo) : prev.lance,
      vendaEstimada: g.market ? String(g.market) : prev.vendaEstimada,
    }));
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Calculadora de custo total</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Simule o custo real do arremate e o resultado bruto estimado antes de dar o lance. Os
          valores são uma estimativa e não substituem a análise da mesa.
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
          <Field label="LANCE / VALOR DO GARIMPO (R$)" value={f.lance} onChange={set("lance")} />
          <Field label="COMISSÃO DO LEILOEIRO (%)" value={f.comissaoPct} onChange={set("comissaoPct")} />
          <Field label="TAXAS E DESPESAS DO LEILÃO (R$)" value={f.taxas} onChange={set("taxas")} />
          <Field label="TRANSFERÊNCIA / DOCUMENTAÇÃO (R$)" value={f.transferencia} onChange={set("transferencia")} />
          <Field label="LOGÍSTICA / PÁTIO (R$)" value={f.logistica} onChange={set("logistica")} />
          <Field label="REPAROS ESTIMADOS (R$)" value={f.reparos} onChange={set("reparos")} />
          <Field label="RESERVA DE IMPREVISTOS (R$)" value={f.reserva} onChange={set("reserva")} />
          <Field label="VENDA ESTIMADA (R$)" value={f.vendaEstimada} onChange={set("vendaEstimada")} />
          <button
            type="button"
            onClick={() => setF(EMPTY)}
            className="sm:col-span-2 justify-self-start rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            LIMPAR
          </button>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-border/50 p-5">
          <Row label="Comissão calculada" value={formatBRL(result.comissao)} />
          <Row label="Custo total estimado" value={formatBRL(result.custoTotal)} strong />
          <div className="border-t border-border/40 pt-4">
            <Row label="Resultado bruto estimado" value={formatBRL(result.resultado)} strong />
            <Row
              label="Margem sobre o custo"
              value={`${result.margem.toFixed(1).replace(".", ",")}%`}
            />
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Estimativa sem impostos sobre a venda e sem custos de anúncio. Use como referência de
            decisão, não como garantia de resultado.
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
