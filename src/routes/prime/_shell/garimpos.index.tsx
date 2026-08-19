import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { usePrimeGarimpos } from "@/lib/prime.data";
import { formatBRL, formatDate, formatPct } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { cn } from "@/lib/utils";
import type { GarimpoStatus } from "@/lib/garimpos";

export const Route = createFileRoute("/prime/_shell/garimpos/")({
  head: () => ({ meta: [{ title: "Garimpos — Área Prime" }, { name: "robots", content: "noindex" }] }),
  component: PrimeGarimpos,
});

const TABS: { key: "ALL" | GarimpoStatus; label: string }[] = [
  { key: "ALL", label: "TODOS" },
  { key: "AVAILABLE", label: "DISPONÍVEIS" },
  { key: "RESERVED", label: "RESERVADOS" },
  { key: "CLOSED", label: "ENCERRADOS" },
];

function PrimeGarimpos() {
  const { data, isLoading } = usePrimeGarimpos();
  const [tab, setTab] = useState<"ALL" | GarimpoStatus>("ALL");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((g) => {
      if (tab !== "ALL" && g.status !== tab) return false;
      if (!q) return true;
      return `${g.vehicle} ${g.code} ${g.location ?? ""}`.toLowerCase().includes(q);
    });
  }, [data, tab, query]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Garimpos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ficha completa, números da mesa e contato direto para reservar.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-[10px] tracking-[0.2em] transition-colors",
              tab === t.key
                ? "border-foreground/40 bg-muted/40 text-foreground"
                : "border-border/50 text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar veículo, código ou cidade"
          className="ml-auto w-full max-w-xs rounded-md border border-border/50 bg-background px-3 py-1.5 text-xs outline-none focus:border-foreground/40 sm:w-auto"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
          Nenhum garimpo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((g) => (
            <Link
              key={g.id}
              to="/prime/garimpos/$id"
              params={{ id: g.id }}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors hover:border-foreground/30",
                g.access === "PRIME" ? "border-prime/30 border-t-2 border-t-prime/70" : "border-border/50",
                g.status === "CLOSED" && "opacity-70",
              )}
            >
              <div className="flex h-40 items-center justify-center bg-muted/20">
                {g.imageUrl ? (
                  <img
                    src={g.imageUrl}
                    alt={`Foto do ${g.vehicle}`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground">SEM FOTO</span>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{g.code}</p>
                  {g.access === "PRIME" ? <PrimeBadge size="sm" /> : null}
                </div>
                <div>
                  <p className="text-sm font-medium">{g.vehicle}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {[g.year, g.km, g.transmission, g.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <dl className="grid grid-cols-3 gap-2 border-t border-border/40 pt-3 text-[11px]">
                  <Cell label="FIPE" value={formatBRL(g.fipe ?? null)} />
                  <Cell label="GARIMPO" value={formatBRL(g.garimpo ?? null)} />
                  <Cell label="ABAIXO FIPE" value={formatPct(g.belowFipePct ?? null)} />
                </dl>
                <p className="text-[10px] tracking-[0.18em] text-muted-foreground">
                  {g.status === "CLOSED"
                    ? `ENCERRADO ${formatDate(g.closedAt)}`
                    : g.status === "RESERVED"
                      ? "RESERVADO"
                      : "DISPONÍVEL"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 tabular-nums">{value}</dd>
    </div>
  );
}
