import { createFileRoute, Link } from "@tanstack/react-router";

import { usePrimeGarimpos, usePrimeContents, usePrimeSession } from "@/lib/prime.data";
import { formatBRL, formatDate } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { WHATSAPP_PRIME } from "@/lib/site";

export const Route = createFileRoute("/prime/_shell/")({
  head: () => ({ meta: [{ title: "Painel Prime — Garimpo Auto" }, { name: "robots", content: "noindex" }] }),
  component: PrimeHome,
});

function PrimeHome() {
  const session = usePrimeSession();
  const garimpos = usePrimeGarimpos();
  const contents = usePrimeContents();

  const list = garimpos.data ?? [];
  const active = list.filter((g) => g.status === "AVAILABLE");
  const reserved = list.filter((g) => g.status === "RESERVED");
  const closed = list.filter((g) => g.status === "CLOSED");

  return (
    <div className="space-y-10">
      <header>
        <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-muted-foreground">
          ÁREA <PrimeBadge size="sm" />
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Bom garimpo.</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Aqui estão os garimpos com ficha completa, a calculadora de custo total e os conteúdos da
          mesa. Novos garimpos entram no radar assim que passam pela nossa análise.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="GARIMPOS ATIVOS" value={String(active.length)} />
        <Stat label="RESERVADOS" value={String(reserved.length)} />
        <Stat label="ENCERRADOS" value={String(closed.length)} />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs tracking-[0.24em] text-muted-foreground">GARIMPOS RECENTES</h2>
          <Link to="/prime/garimpos" className="text-[11px] tracking-[0.16em] hover:underline">
            VER TODOS
          </Link>
        </div>

        {garimpos.isLoading ? (
          <div className="h-32 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
        ) : list.length === 0 ? (
          <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
            Nenhum garimpo publicado no momento. Assim que a mesa liberar um novo, ele aparece aqui.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {list.slice(0, 4).map((g) => (
              <Link
                key={g.id}
                to="/prime/garimpos/$id"
                params={{ id: g.id }}
                className="group rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{g.code}</p>
                  {g.access === "PRIME" ? <PrimeBadge size="sm" /> : null}
                </div>
                <p className="mt-2 text-sm font-medium">{g.vehicle}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {[g.year, g.km, g.location].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 text-sm">{formatBRL(g.garimpo ?? null)}</p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-muted-foreground">
                  {g.status === "CLOSED" ? `ENCERRADO ${formatDate(g.closedAt)}` : g.status}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs tracking-[0.24em] text-muted-foreground">CONTEÚDOS DA MESA</h2>
          <Link to="/prime/conteudos" className="text-[11px] tracking-[0.16em] hover:underline">
            VER TODOS
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {(contents.data ?? []).slice(0, 2).map((c) => (
            <Link
              key={c.id}
              to="/prime/conteudos/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl border border-border/50 p-4 transition-colors hover:border-foreground/30"
            >
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{c.category}</p>
              <p className="mt-2 text-sm font-medium">{c.title}</p>
              {c.excerpt ? (
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{c.excerpt}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-prime/30 border-t-2 border-t-prime/70 p-5">
        <p className="text-sm font-medium">Precisa de uma análise sob medida?</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Fale direto com a mesa {session.data?.isAdmin ? "(você está logado como admin)" : ""}.
        </p>
        <a
          href={WHATSAPP_PRIME}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-prime px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90"
        >
          FALAR COM A MESA
        </a>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 p-4">
      <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
