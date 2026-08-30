import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { formatBRL } from "@/lib/garimpo-finance";
import { usePrimeGarimpos } from "@/lib/prime.data";
import { useCreateDeal } from "@/lib/deals.data";
import { computeDeal } from "@/lib/deals.shared";
import {
  MoneyField,
  OfficialCard,
  ResultSummary,
  TextField,
  parseMoney,
} from "@/components/prime/deal-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prime/_shell/calculadora")({
  validateSearch: (search: Record<string, unknown>): { modo?: "manual" | "auto" } => {
    const m = String(search["modo"] ?? "");
    return m === "manual" || m === "auto" ? { modo: m } : {};
  },
  head: () => ({
    meta: [{ title: "Calculadora Prime — Garimpo Auto" }, { name: "robots", content: "noindex" }],
  }),
  component: Calculadora,
});

type Mode = "GARIMPO_AUTO" | "MANUAL";

const EMPTY_COSTS = { transporte: "", documentacao: "", reparos: "", outros: "" };

const VALOR_GARIMPO_HINT =
  "Comissão do leiloeiro, taxas administrativas do leilão e ágio Garimpo já inclusos.";

function Calculadora() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<Mode>(search.modo === "manual" ? "MANUAL" : "GARIMPO_AUTO");
  const [selectedId, setSelectedId] = useState("");
  const [costs, setCosts] = useState(EMPTY_COSTS);
  const [extras, setExtras] = useState<{ id: string; label: string; value: number }[]>([]);
  const [extraDraft, setExtraDraft] = useState("");
  const [manual, setManual] = useState({ vehicle: "", year: "", acquisition: "", fipe: "" });
  const [notes, setNotes] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: garimpos } = usePrimeGarimpos();
  const create = useCreateDeal();

  const selected = useMemo(
    () => (garimpos ?? []).find((g) => g.id === selectedId) ?? null,
    [garimpos, selectedId],
  );

  const setCost = (key: keyof typeof EMPTY_COSTS) => (v: string) =>
    setCosts((prev) => ({ ...prev, [key]: v }));

  const acquisition =
    mode === "GARIMPO_AUTO" ? (selected?.garimpo ?? 0) : parseMoney(manual.acquisition);
  const fipe = mode === "GARIMPO_AUTO" ? (selected?.fipe ?? 0) : parseMoney(manual.fipe);

  const extrasTotal = extras.reduce((acc, e) => acc + e.value, 0);
  const outrosTotal = parseMoney(costs.outros) + extrasTotal;

  const result = computeDeal({
    acquisitionValue: acquisition,
    fipeValue: fipe,
    transportCost: parseMoney(costs.transporte),
    documentationCost: parseMoney(costs.documentacao),
    repairCost: parseMoney(costs.reparos),
    otherCost: outrosTotal,
  });

  const vehicleName = mode === "GARIMPO_AUTO" ? (selected?.vehicle ?? "") : manual.vehicle.trim();
  const canSave = vehicleName.length > 0 && acquisition > 0;

  function reset() {
    setCosts(EMPTY_COSTS);
    setExtras([]);
    setExtraDraft("");
    setManual({ vehicle: "", year: "", acquisition: "", fipe: "" });
    setSelectedId("");
    setNotes("");
  }

  function addExtra() {
    const value = parseMoney(extraDraft);
    if (value <= 0) return;
    setExtras((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, label: `Extra ${prev.length + 1}`, value },
    ]);
    setExtraDraft("");
  }

  async function save(status: "ANALYSIS" | "ACQUIRED") {
    setError(null);
    try {
      const deal = await create.mutateAsync({
        source: mode,
        status,
        garimpoId: mode === "GARIMPO_AUTO" ? (selected?.id ?? null) : null,
        garimpoCode: mode === "GARIMPO_AUTO" ? (selected?.code ?? null) : null,
        imageUrl: mode === "GARIMPO_AUTO" ? (selected?.imageUrl ?? null) : null,
        vehicleName,
        yearModel: mode === "GARIMPO_AUTO" ? (selected?.year ?? null) : manual.year,
        acquisitionValue: acquisition,
        fipeValue: fipe > 0 ? fipe : null,
        transportCost: parseMoney(costs.transporte),
        documentationCost: parseMoney(costs.documentacao),
        repairCost: parseMoney(costs.reparos),
        otherCost: parseMoney(costs.outros),
        notes,
      });
      setAsking(false);
      reset();
      void navigate({ to: "/prime/arremates/$id", params: { id: (deal as { id: string }).id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Calculadora de custo total</h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Analise uma oportunidade do Garimpo Auto ou um veículo que você mesmo encontrou. Some seus
          custos e compare o custo total com a FIPE.
        </p>
      </header>

      <section>
        <p className="text-[10px] tracking-[0.24em] text-muted-foreground">COMO DESEJA COMEÇAR?</p>
        <div className="mt-3 inline-flex rounded-lg border border-border/60 p-1">
          {(
            [
              ["GARIMPO_AUTO", "GARIMPO AUTO"],
              ["MANUAL", "ADICIONAR MANUALMENTE"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "rounded-md px-4 py-2 text-[10px] tracking-[0.18em] transition-colors",
                mode === value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {mode === "GARIMPO_AUTO" ? (
            <section className="space-y-4 rounded-xl border border-border/50 p-5">
              <label className="block max-w-sm">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                  SELECIONE UM GARIMPO
                </span>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-3 text-base outline-none focus:border-foreground/40 sm:py-2 sm:text-sm"
                >
                  <option value="">Selecionar…</option>
                  {(garimpos ?? []).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} — {g.vehicle}
                    </option>
                  ))}
                </select>
              </label>

              {selected ? (
                <>
                  <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                    {selected.imageUrl ? (
                      <img
                        src={selected.imageUrl}
                        alt={selected.vehicle}
                        className="h-14 w-20 rounded-md border border-border/40 bg-muted/20 object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground">
                        {selected.code}
                      </p>
                      <p className="truncate text-sm font-medium">{selected.vehicle}</p>
                      <p className="text-[11px] text-muted-foreground">{selected.year ?? "—"}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <OfficialCard
                      label="VALOR GARIMPO"
                      value={formatBRL(selected.garimpo ?? null)}
                      caption={`Valor final da oportunidade. ${VALOR_GARIMPO_HINT}`}
                      title={VALOR_GARIMPO_HINT}
                    />
                    <OfficialCard
                      label="FIPE"
                      value={formatBRL(selected.fipe ?? null)}
                      caption="Referência de mercado."
                    />
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Escolha um garimpo para carregar veículo, ano, Valor Garimpo e FIPE.
                </p>
              )}
            </section>
          ) : (
            <section className="grid gap-4 rounded-xl border border-border/50 p-5 sm:grid-cols-2">
              <p className="sm:col-span-2 text-[10px] tracking-[0.24em] text-muted-foreground">
                DADOS DO VEÍCULO
              </p>
              <TextField
                label="NOME / MODELO DO VEÍCULO"
                value={manual.vehicle}
                onChange={(v) => setManual((p) => ({ ...p, vehicle: v }))}
                placeholder="Ex.: Fiat Argo Drive 1.0"
              />
              <TextField
                label="ANO / MODELO"
                value={manual.year}
                onChange={(v) => setManual((p) => ({ ...p, year: v }))}
                placeholder="2020/2021"
              />
              <MoneyField
                label="VALOR DE AQUISIÇÃO (R$)"
                value={manual.acquisition}
                onChange={(v) => setManual((p) => ({ ...p, acquisition: v }))}
                hint="Quanto você pagou (ou pretende pagar) pelo veículo."
              />
              <MoneyField
                label="FIPE (R$)"
                value={manual.fipe}
                onChange={(v) => setManual((p) => ({ ...p, fipe: v }))}
              />
            </section>
          )}

          <section className="grid gap-4 rounded-xl border border-border/50 p-5 sm:grid-cols-2">
            <p className="sm:col-span-2 text-[10px] tracking-[0.24em] text-muted-foreground">
              SEUS CUSTOS ESTIMADOS
            </p>
            <MoneyField
              label="TRANSPORTE / REMOÇÃO (R$)"
              value={costs.transporte}
              onChange={setCost("transporte")}
            />
            <MoneyField
              label="DOCUMENTAÇÃO / DESPACHANTE (R$)"
              value={costs.documentacao}
              onChange={setCost("documentacao")}
            />
            <MoneyField
              label="REPAROS / MANUTENÇÃO (R$)"
              value={costs.reparos}
              onChange={setCost("reparos")}
            />
            <MoneyField label="OUTROS CUSTOS (R$)" value={costs.outros} onChange={setCost("outros")} />
            <label className="block sm:col-span-2">
              <span className="text-[10px] tracking-[0.18em] text-muted-foreground">
                OBSERVAÇÕES (OPCIONAL)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
              />
            </label>
            <button
              type="button"
              onClick={reset}
              className="sm:col-span-2 justify-self-start rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              LIMPAR
            </button>
          </section>
        </div>

        <aside className="h-fit space-y-5 rounded-xl border border-border/50 p-5 lg:sticky lg:top-6">
          <ResultSummary
            acquisitionLabel={mode === "GARIMPO_AUTO" ? "Valor Garimpo (final)" : "Valor de aquisição"}
            acquisitionValue={acquisition}
            costs={result.costs}
            totalCost={result.totalCost}
            fipe={fipe}
            fipeMargin={result.fipeMargin}
            belowFipePct={result.belowFipePct}
          />

          {asking ? (
            <div className="space-y-2 border-t border-border/40 pt-4">
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground">COMO DESEJA SALVAR?</p>
              <button
                type="button"
                disabled={create.isPending}
                onClick={() => void save("ANALYSIS")}
                className="w-full rounded-md border border-border/60 px-3 py-2.5 text-[10px] tracking-[0.2em] transition-colors hover:border-foreground/40 disabled:opacity-50"
              >
                EM ANÁLISE
              </button>
              <button
                type="button"
                disabled={create.isPending}
                onClick={() => void save("ACQUIRED")}
                className="w-full rounded-md border border-border/60 px-3 py-2.5 text-[10px] tracking-[0.2em] transition-colors hover:border-foreground/40 disabled:opacity-50"
              >
                {mode === "GARIMPO_AUTO" ? "ARREMATADO / COMPRADO" : "COMPRADO"}
              </button>
              <button
                type="button"
                onClick={() => setAsking(false)}
                className="w-full py-1 text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                CANCELAR
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canSave}
              onClick={() => setAsking(true)}
              className="w-full rounded-md bg-prime px-4 py-3 text-[11px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              SALVAR EM MEUS ARREMATES
            </button>
          )}
          {error ? <p className="text-[11px] text-muted-foreground">{error}</p> : null}
        </aside>
      </div>
    </div>
  );
}
