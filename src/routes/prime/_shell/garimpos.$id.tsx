import { createFileRoute, Link } from "@tanstack/react-router";

import { usePrimeGarimpo } from "@/lib/prime.data";
import { formatBRL, formatDate, formatPct } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { waGarimpoPrimeLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prime/_shell/garimpos/$id")({
  head: () => ({ meta: [{ title: "Ficha do garimpo — Área Prime" }, { name: "robots", content: "noindex" }] }),
  component: PrimeGarimpoDetail,
});

function PrimeGarimpoDetail() {
  const { id } = Route.useParams();
  const { data: g, isLoading, error } = usePrimeGarimpo(id);

  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-xl border border-border/40 bg-muted/20" />;
  }

  if (error || !g) {
    return (
      <div className="rounded-xl border border-border/40 p-6">
        <p className="text-sm text-muted-foreground">
          {(error as Error | null)?.message ?? "Garimpo não encontrado."}
        </p>
        <Link to="/prime/garimpos" className="mt-4 inline-block text-[11px] tracking-[0.18em] hover:underline">
          VOLTAR PARA OS GARIMPOS
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/prime/garimpos" className="text-[10px] tracking-[0.22em] text-muted-foreground hover:text-foreground">
        ← GARIMPOS
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{g.code}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{g.vehicle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {[g.year, g.km, g.transmission, g.fuel, g.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {g.access === "PRIME" ? <PrimeBadge /> : null}
          <span className="rounded-md border border-border/60 px-2.5 py-1 text-[10px] tracking-[0.2em] text-muted-foreground">
            {g.status === "CLOSED" ? "ENCERRADO" : g.status === "RESERVED" ? "RESERVADO" : "DISPONÍVEL"}
          </span>
        </div>
      </header>

      <div
        className={cn(
          "flex h-72 items-center justify-center overflow-hidden rounded-xl border bg-muted/20",
          g.access === "PRIME" ? "border-prime/30" : "border-border/50",
        )}
      >
        {g.imageUrl ? (
          <img src={g.imageUrl} alt={`Foto do ${g.vehicle}`} className="h-full w-full object-contain" />
        ) : (
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground">SEM FOTO</span>
        )}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="FIPE" value={formatBRL(g.fipe ?? null)} />
        <Metric label="MERCADO" value={formatBRL(g.market ?? null)} />
        <Metric label="GARIMPO" value={formatBRL(g.garimpo ?? null)} highlight />
        <Metric label="ABAIXO DA FIPE" value={formatPct(g.belowFipePct ?? null)} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Panel title="PONTOS POSITIVOS" items={g.positives} />
        <Panel title="PONTOS DE ATENÇÃO" items={g.attentionPoints} />
      </section>

      {g.note ? (
        <section className="rounded-xl border border-border/50 p-5">
          <h2 className="text-[10px] tracking-[0.22em] text-muted-foreground">LEITURA DA MESA</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{g.note}</p>
        </section>
      ) : null}

      <section className="grid gap-3 text-[11px] text-muted-foreground sm:grid-cols-2">
        <p>Diferença para o mercado: {formatBRL(g.marketDiff ?? null)}</p>
        <p>
          {g.status === "CLOSED"
            ? `Encerrado em ${formatDate(g.closedAt)}`
            : `Publicado em ${formatDate(g.publishedAt)}`}
        </p>
      </section>

      <section className="rounded-xl border border-prime/30 border-t-2 border-t-prime/70 p-5">
        <p className="text-sm font-medium">
          {g.status === "CLOSED" ? "Este garimpo já foi encerrado" : "Quer reservar este garimpo?"}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          {g.status === "CLOSED"
            ? "Fale com a mesa para receber oportunidades parecidas assim que entrarem no radar."
            : "A mesa confirma disponibilidade, documentação e próximos passos com você pelo WhatsApp."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={waGarimpoPrimeLink(g)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-prime px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90"
          >
            {g.status === "CLOSED" ? "QUERO OPORTUNIDADES ASSIM" : "FALAR COM A MESA"}
          </a>
          <Link
            to="/prime/calculadora"
            className="rounded-md border border-border/60 px-4 py-2 text-[11px] tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            SIMULAR CUSTO TOTAL
          </Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4", highlight ? "border-foreground/30" : "border-border/50")}>
      <p className="text-[9px] tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/50 p-5">
      <h2 className="text-[10px] tracking-[0.22em] text-muted-foreground">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Sem apontamentos.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item} className="flex gap-2 leading-relaxed">
              <span className="text-muted-foreground">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
