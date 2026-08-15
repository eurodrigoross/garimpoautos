import { useState } from "react";
import { ArrowRight, Car, Check, Lock } from "lucide-react";
import { brl, deals, marginOf, marginPct, WHATSAPP_URL, type Deal } from "@/lib/deals";

const tabs = [
  { id: "todos", label: `Todos (${deals.length})` },
  { id: "margem", label: "Maior Margem (%)" },
  { id: "ate30", label: "Até R$ 30.000" },
  { id: "sedan", label: "Sedãs Premium" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const bullets = [
  "Documentação 100% baixada e sem débitos",
  "Laudo cautelar aprovado com vistoria",
  "Cotação de frete cegonha integrada para todo Brasil",
];

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="group hover-lift sheen edge-light flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-xl hover:border-foreground/25">
      <div className="relative flex h-44 items-center justify-center bg-[linear-gradient(140deg,var(--surface-elevated),var(--background))]">
        <Car className="size-16 text-border-strong transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:text-foreground/35" />
        <span className="absolute left-3 top-3 rounded-full border border-border-strong/70 bg-background/70 px-3 py-1 text-[10px] font-semibold tracking-wide text-foreground backdrop-blur-md">
          {deal.scarcity}
        </span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg border border-gold/30 bg-background/80 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-gold backdrop-blur-md">
          <Lock className="mr-1 inline size-3" />
          PLACA OCULTA — ASSESSORIA
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-bold tracking-wide text-foreground">{deal.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{deal.specs}</p>

        <dl className="mt-4 rounded-xl border border-border bg-background/50 p-4 text-xs">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-muted-foreground">Tabela FIPE oficial</dt>
            <dd className="font-semibold text-foreground/80 line-through decoration-border-strong">
              {brl(deal.fipe)}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-border py-1.5">
            <dt className="text-muted-foreground">Valor de repasse titular</dt>
            <dd className="text-sm font-bold text-gold">{brl(deal.repasse)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border py-1.5">
            <dt className="text-muted-foreground">Sugestão de venda rápida</dt>
            <dd className="font-semibold text-foreground">{brl(deal.vendaRapida)}</dd>
          </div>
          <div className="mt-3 rounded-lg border border-emerald/30 bg-emerald-deep/40 px-3 py-2 text-center text-[12px] font-bold text-emerald">
            Lucro / Margem est.: {brl(marginOf(deal))} ({marginPct(deal)}%)
          </div>
        </dl>

        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[11px] leading-snug text-muted-foreground">
              <Check className="mt-px size-3.5 shrink-0 text-emerald" strokeWidth={3} />
              {b}
            </li>
          ))}
        </ul>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sheen mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-3 text-[12px] font-bold tracking-wide text-emerald-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-16px_oklch(1_0_0/0.35)] active:translate-y-0"
        >
          SOLICITAR RESERVA DO LOTE <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}

export function DealsGrid() {
  const [tab, setTab] = useState<TabId>("todos");

  const list =
    tab === "todos"
      ? deals
      : tab === "margem"
        ? [...deals].sort((a, b) => marginPct(b) - marginPct(a))
        : tab === "ate30"
          ? deals.filter((d) => d.repasse <= 30000)
          : deals.filter((d) => d.category.includes("sedan"));

  return (
    <section id="mesa-de-deals" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.22em] text-gold">MURAL DE LOTES</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Lotes ativos na mesa de repasse
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                tab === t.id
                  ? "border-foreground/45 bg-foreground/10 text-foreground shadow-[0_10px_24px_-16px_oklch(1_0_0/0.5)]"
                  : "border-border bg-surface/60 text-muted-foreground hover:border-foreground/25 hover:bg-surface-elevated/70 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </section>
  );
}
