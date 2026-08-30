import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { usePrimeGarimpos } from "@/lib/prime.data";
import { useMyDeals } from "@/lib/deals.data";
import { DEAL_STATUS_LABEL, formatPct, type DealStatus } from "@/lib/deals.shared";
import { buildDashboard, PERIODS, type PeriodKey } from "@/lib/dashboard.shared";
import { formatBRL, formatDate } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { StatusChip } from "@/components/prime/deal-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prime/_shell/")({
  head: () => ({
    meta: [{ title: "Painel Prime — Garimpo Auto" }, { name: "robots", content: "noindex" }],
  }),
  component: PrimeHome,
});

const PIPELINE: { status: DealStatus; label: string }[] = [
  { status: "ANALYSIS", label: DEAL_STATUS_LABEL.ANALYSIS },
  { status: "ACQUIRED", label: "COMPRADOS" },
  { status: "PREPARING", label: DEAL_STATUS_LABEL.PREPARING },
  { status: "FOR_SALE", label: DEAL_STATUS_LABEL.FOR_SALE },
  { status: "SOLD", label: "VENDIDOS" },
];

function PrimeHome() {
  const [period, setPeriod] = useState<PeriodKey>("YEAR");
  const deals = useMyDeals();
  const garimpos = usePrimeGarimpos();

  const m = useMemo(() => buildDashboard(deals.data ?? [], period), [deals.data, period]);
  const list = garimpos.data ?? [];

  return (
    <div className="space-y-10">
      <header>
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-muted-foreground">
          GARIMPO <PrimeBadge size="sm" />
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Visão geral das suas operações.
        </h1>
      </header>

      {deals.isLoading ? (
        <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
      ) : !m.hasAnyDeal ? (
        <EmptyState />
      ) : (
        <>
          {/* Seletor de período */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "shrink-0 rounded-md border px-3 py-1.5 text-[10px] tracking-[0.18em] transition-colors",
                  period === p.key
                    ? "border-foreground/40 bg-muted/40 text-foreground"
                    : "border-border/50 text-muted-foreground hover:border-foreground/30",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Cards financeiros */}
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="CAPITAL EM OPERAÇÃO"
              value={formatBRL(m.capitalInOperation)}
              hint="Capital atualmente alocado em veículos ainda não vendidos."
              foot={`${m.vehiclesInOperation} veículo${m.vehiclesInOperation === 1 ? "" : "s"} em operação · posição atual`}
            />
            <Metric
              label="RECEITA EM VENDAS"
              value={m.soldCount ? formatBRL(m.revenue) : "—"}
              hint="Valor total das vendas registradas no período."
              foot={m.soldCount ? undefined : "Sem vendas no período."}
            />
            <Metric
              label="RESULTADO REALIZADO"
              value={m.realizedResult === null ? "—" : formatBRL(m.realizedResult)}
              hint="Resultado das operações vendidas no período."
              negative={(m.realizedResult ?? 0) < 0}
              foot={m.soldCount ? `Custo das vendidas ${formatBRL(m.soldCost)}` : undefined}
            />
            <Metric
              label="RETORNO REALIZADO"
              value={m.realizedReturnPct === null ? "—" : formatPct(m.realizedReturnPct)}
              hint="Resultado sobre o custo das operações vendidas."
              negative={(m.realizedReturnPct ?? 0) < 0}
            />
          </section>

          {/* Pipeline */}
          <section className="space-y-3">
            <h2 className="text-xs tracking-[0.24em] text-muted-foreground">PIPELINE</h2>
            <div className="-mx-1 grid grid-cols-2 gap-3 px-1 sm:grid-cols-3 lg:grid-cols-5">
              {PIPELINE.map((p) => (
                <Link
                  key={p.status}
                  to="/prime/arremates"
                  search={{ status: p.status }}
                  className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
                >
                  <p className="text-[9px] tracking-[0.2em] text-muted-foreground">{p.label}</p>
                  <p className="mt-2 text-xl font-semibold tabular-nums">
                    {m.pipeline[p.status]}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Resultado por mês */}
          <section className="space-y-4">
            <h2 className="text-xs tracking-[0.24em] text-muted-foreground">RESULTADO POR MÊS</h2>
            {m.monthly.length === 0 ? (
              <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
                Ainda não há vendas suficientes para gerar este gráfico.
              </p>
            ) : (
              <MonthlyChart data={m.monthly} />
            )}
          </section>

          {/* Operações em andamento */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs tracking-[0.24em] text-muted-foreground">
                OPERAÇÕES EM ANDAMENTO
              </h2>
              <Link to="/prime/arremates" className="text-[11px] tracking-[0.16em] hover:underline">
                VER TODOS
              </Link>
            </div>
            {m.ongoing.length === 0 ? (
              <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
                Nenhum veículo comprado, em preparação ou à venda no momento.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {m.ongoing.map((d) => (
                  <Link
                    key={d.id}
                    to="/prime/arremates/$id"
                    params={{ id: d.id }}
                    className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-medium">{d.vehicleName}</p>
                      <StatusChip status={d.status} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
                      <Cell label="CUSTO TOTAL" value={formatBRL(d.totalCost)} />
                      <Cell label="FIPE" value={d.fipeValue ? formatBRL(d.fipeValue) : "—"} />
                      <Cell
                        label="MARGEM ATÉ A FIPE"
                        value={d.fipeMargin === null ? "—" : formatBRL(d.fipeMargin)}
                        sub={d.belowFipePct === null ? undefined : formatPct(d.belowFipePct)}
                      />
                    </div>
                    <p className="mt-3 text-[10px] tracking-[0.18em] text-muted-foreground">
                      VER OPERAÇÃO
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Últimas vendas */}
          <section className="space-y-4">
            <h2 className="text-xs tracking-[0.24em] text-muted-foreground">ÚLTIMAS VENDAS</h2>
            {m.lastSales.length === 0 ? (
              <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
                Sem vendas no período.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {m.lastSales.map((d) => (
                  <Link
                    key={d.id}
                    to="/prime/arremates/$id"
                    params={{ id: d.id }}
                    className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-medium">{d.vehicleName}</p>
                      <span className="shrink-0 text-[10px] tracking-[0.16em] text-muted-foreground">
                        {formatDate(d.saleDate)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
                      <Cell label="CUSTO TOTAL" value={formatBRL(d.totalCost)} />
                      <Cell label="VENDA" value={formatBRL(d.saleValue ?? 0)} />
                      <Cell
                        label="RESULTADO"
                        value={`${d.result < 0 ? "-" : "+"} ${formatBRL(Math.abs(d.result))}`}
                        muted={d.result < 0}
                      />
                      <Cell label="RETORNO" value={formatPct(d.returnPct)} muted={d.result < 0} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Novos garimpos — descoberta de oportunidades */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs tracking-[0.24em] text-muted-foreground">
            NOVAS OPORTUNIDADES PRIME
          </h2>
          <Link to="/prime/garimpos" className="text-[11px] tracking-[0.16em] hover:underline">
            VER TODOS OS GARIMPOS
          </Link>
        </div>
        {garimpos.isLoading ? (
          <div className="h-32 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
        ) : list.length === 0 ? (
          <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
            Nenhum garimpo publicado no momento. Assim que a mesa liberar um novo, ele aparece aqui.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {list
              .filter((g) => g.status === "AVAILABLE")
              .slice(0, 4)
              .map((g) => (
                <Link
                  key={g.id}
                  to="/prime/garimpos/$id"
                  params={{ id: g.id }}
                  className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{g.code}</p>
                    {g.access === "PRIME" ? <PrimeBadge size="sm" /> : null}
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">{g.vehicle}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {[g.year, g.km].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-3 text-sm tabular-nums">{formatBRL(g.garimpo ?? null)}</p>
                </Link>
              ))}
          </div>
        )}
      </section>

      <p className="text-[10px] leading-relaxed text-muted-foreground/60">
        Indicadores calculados a partir dos valores registrados pelo próprio usuário. Não substituem
        controle contábil, fiscal ou financeiro profissional.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-xl border border-border/50 p-8">
      <h2 className="text-lg font-semibold tracking-tight">Comece sua primeira análise</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Use um Garimpo Auto ou adicione uma oportunidade manualmente para começar a acompanhar suas
        operações — capital investido, etapas e resultado realizado aparecem aqui automaticamente.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/prime/calculadora"
          search={{ modo: "auto" }}
          className="rounded-md bg-prime px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90"
        >
          ANALISAR UM GARIMPO
        </Link>
        <Link
          to="/prime/calculadora"
          search={{ modo: "manual" }}
          className="rounded-md border border-border/60 px-4 py-2.5 text-[10px] tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          ADICIONAR VEÍCULO MANUALMENTE
        </Link>
      </div>
    </section>
  );
}

function MonthlyChart({ data }: { data: { key: string; label: string; result: number }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.result)), 1);
  return (
    <div className="rounded-xl border border-border/50 p-5">
      <div className="flex items-end gap-3 overflow-x-auto pb-1">
        {data.map((d) => {
          const h = Math.max(6, Math.round((Math.abs(d.result) / max) * 140));
          const negative = d.result < 0;
          return (
            <div key={d.key} className="flex min-w-[52px] flex-1 flex-col items-center gap-2">
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {negative ? "-" : ""}
                {formatBRL(Math.abs(d.result))}
              </span>
              <div
                style={{ height: `${h}px` }}
                className={cn(
                  "w-full rounded-t-sm",
                  negative
                    ? "border border-dashed border-foreground/40 bg-muted/30"
                    : "bg-foreground/80",
                )}
              />
              <span className="text-[10px] tracking-[0.16em] text-muted-foreground">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  foot,
  negative,
}: {
  label: string;
  value: string;
  hint: string;
  foot?: string | undefined;
  negative?: boolean | undefined;
}) {
  return (
    <div className="rounded-xl border border-border/50 p-4">
      <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tabular-nums",
          negative && "text-muted-foreground",
        )}
      >
        {negative ? "-" : ""}
        {negative ? value.replace("-", "") : value}
      </p>
      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/70">{hint}</p>
      {foot ? (
        <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground">{foot}</p>
      ) : null}
    </div>
  );
}

function Cell({
  label,
  value,
  sub,
  muted,
}: {
  label: string;
  value: string;
  sub?: string | undefined;
  muted?: boolean | undefined;
}) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm tabular-nums", muted && "text-muted-foreground")}>{value}</p>
      {sub ? <p className="text-[10px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
