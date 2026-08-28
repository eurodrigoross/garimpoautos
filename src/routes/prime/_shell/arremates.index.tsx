import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { useMyDeals } from "@/lib/deals.data";
import { computeDeal, DEAL_STATUS_LABEL, formatPct, type DealStatus } from "@/lib/deals.shared";
import { formatBRL, formatDate } from "@/lib/garimpo-finance";
import { SourceChip, StatusChip } from "@/components/prime/deal-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prime/_shell/arremates/")({
  head: () => ({
    meta: [{ title: "Meus Arremates — Garimpo Auto" }, { name: "robots", content: "noindex" }],
  }),
  component: Arremates,
});

const FILTERS: { key: "ALL" | DealStatus; label: string }[] = [
  { key: "ALL", label: "TODOS" },
  { key: "ANALYSIS", label: DEAL_STATUS_LABEL.ANALYSIS },
  { key: "ACQUIRED", label: "COMPRADOS" },
  { key: "PREPARING", label: DEAL_STATUS_LABEL.PREPARING },
  { key: "FOR_SALE", label: DEAL_STATUS_LABEL.FOR_SALE },
  { key: "SOLD", label: "VENDIDOS" },
];

function Arremates() {
  const [filter, setFilter] = useState<"ALL" | DealStatus>("ALL");
  const { data, isLoading } = useMyDeals();

  const deals = data ?? [];
  const list = filter === "ALL" ? deals : deals.filter((d) => d.status === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Meus arremates</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Seus veículos em análise, comprados e vendidos. Registros privados — só você tem acesso.
          </p>
        </div>
        <Link
          to="/prime/calculadora"
          className="rounded-md bg-prime px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90"
        >
          ANALISAR UMA OPORTUNIDADE
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[10px] tracking-[0.18em] transition-colors",
              filter === f.key
                ? "border-foreground/40 bg-muted/40 text-foreground"
                : "border-border/50 text-muted-foreground hover:border-foreground/30",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
      ) : deals.length === 0 ? (
        <div className="rounded-xl border border-border/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">Você ainda não possui arremates salvos.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/prime/calculadora"
              className="rounded-md bg-prime px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-prime-foreground"
            >
              ANALISAR UMA OPORTUNIDADE
            </Link>
            <Link
              to="/prime/calculadora"
              className="rounded-md border border-border/60 px-4 py-2.5 text-[10px] tracking-[0.18em] text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            >
              ADICIONAR VEÍCULO MANUALMENTE
            </Link>
          </div>
        </div>
      ) : list.length === 0 ? (
        <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
          Nenhum registro neste filtro.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((d) => {
            const m = computeDeal(d);
            return (
              <Link
                key={d.id}
                to="/prime/arremates/$id"
                params={{ id: d.id }}
                className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {d.imageUrl ? (
                      <img
                        src={d.imageUrl}
                        alt={d.vehicleName}
                        className="h-12 w-16 shrink-0 rounded-md border border-border/40 bg-muted/20 object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.vehicleName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {[d.yearModel, d.garimpoCode].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                  </div>
                  <StatusChip status={d.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                  <Cell
                    label={d.source === "GARIMPO_AUTO" ? "VALOR GARIMPO" : "AQUISIÇÃO"}
                    value={formatBRL(d.acquisitionValue)}
                  />
                  <Cell label="CUSTO TOTAL" value={formatBRL(m.totalCost)} />
                  <Cell label="FIPE" value={d.fipeValue ? formatBRL(d.fipeValue) : "—"} />
                  {d.status === "SOLD" ? (
                    <Cell
                      label="RESULTADO REALIZADO"
                      value={m.realizedResult === null ? "—" : formatBRL(m.realizedResult)}
                      sub={formatPct(m.realizedPct)}
                    />
                  ) : (
                    <Cell
                      label="MARGEM ATÉ A FIPE"
                      value={m.fipeMargin === null ? "—" : formatBRL(m.fipeMargin)}
                      sub={
                        m.belowFipePct === null
                          ? undefined
                          : `${formatPct(m.belowFipePct)} abaixo da FIPE`
                      }
                    />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                  <SourceChip source={d.source} />
                  <span className="text-[10px] tracking-[0.16em] text-muted-foreground">
                    {formatDate(d.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, sub }: { label: string; value: string; sub?: string | undefined }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm tabular-nums">{value}</p>
      {sub ? <p className="text-[10px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
