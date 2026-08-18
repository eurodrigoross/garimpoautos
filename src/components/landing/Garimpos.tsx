import { useState } from "react";
import { ArrowRight, ImageIcon, Lock } from "lucide-react";
import { Reveal } from "./Reveal";
import { GarimpoPoints } from "./GarimpoPoints";
import { brl, waGarimpoLink, waGarimpoPrimeLink, WHATSAPP_FREE } from "@/lib/site";
import {
  ACCESS_LABEL,
  GARIMPOS,
  PUBLIC_CLOSED_LIMIT,
  STATUS_LABEL,
  openGarimpos,
  primeGarimpos,
  recentClosedGarimpos,
  type Garimpo,
} from "@/lib/garimpos";

function GarimpoMedia({ g }: { g: Garimpo }) {
  if (g.imageUrl) {
    return (
      <img
        src={g.imageUrl}
        alt={`Foto do ${g.vehicle}`}
        loading="lazy"
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }
  return (
    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 border-b border-border bg-surface/30">
      <ImageIcon className="size-5 text-foreground/30" />
      <p className="text-[10px] font-bold tracking-[0.18em] text-foreground/40">
        FOTO EM BREVE
      </p>
    </div>
  );
}

function Metrics({ g, locked = false }: { g: Garimpo; locked?: boolean }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      <div className="bg-background p-4">
        <p className="text-[10px] tracking-[0.14em] text-muted-foreground">FIPE</p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground line-through decoration-border-strong">
          {brl(g.fipe)}
        </p>
      </div>
      <div className="bg-background p-4">
        <p className="text-[10px] tracking-[0.14em] text-muted-foreground">MÉDIA DE MERCADO</p>
        <p className="mt-1 text-sm font-semibold text-muted-foreground line-through decoration-border-strong">
          {brl(g.market)}
        </p>
      </div>
      <div className="bg-background p-4">
        <p className="text-[10px] tracking-[0.14em] text-foreground">VALOR GARIMPO</p>
        {locked ? (
          <p className="mt-1 inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-foreground/60">
            <Lock className="size-3.5" /> BLOQUEADO
          </p>
        ) : (
          <p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">
            {brl(g.garimpo)}
          </p>
        )}
      </div>
    </div>
  );
}

export function GarimpoCard({ g }: { g: Garimpo }) {
  const isPrime = g.access === "PRIME";
  const isClosed = g.status === "ENCERRADO";
  const locked = isPrime && !isClosed;

  return (
    <article className="edge-light hover-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface/50 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
          {isPrime && <Lock className="size-3" />}
          {ACCESS_LABEL[g.access]}
        </span>
        <span className="rounded-full border border-foreground/25 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-muted-foreground">
          {STATUS_LABEL[g.status]}
        </span>
      </div>

      <GarimpoMedia g={g} />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
          {g.vehicle}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {[g.year, g.km, g.transmission, g.fuel].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{g.location}</p>

        {locked ? (
          <>
            <div className="mt-5 rounded-xl border border-dashed border-border-strong/60 bg-background/40 p-4">
              <p className="text-[10px] font-bold tracking-[0.16em] text-foreground">
                MAIS DE {Math.floor(g.belowFipePct)}% ABAIXO DA FIPE
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Valor Garimpo, análise completa e pontos de atenção liberados apenas para membros
                Prime.
              </p>
            </div>
            <Metrics g={g} locked />
          </>
        ) : (
          <>
            <Metrics g={g} />
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold tracking-[0.14em]">
              <span className="rounded-lg border border-foreground/30 px-3 py-2 text-foreground">
                {g.belowFipePct.toString().replace(".", ",")}% ABAIXO DA FIPE
              </span>
              <span className="rounded-lg border border-border px-3 py-2 text-muted-foreground">
                {brl(g.marketDiff)} DE DIFERENÇA PARA A MÉDIA DE MERCADO
              </span>
            </div>
          </>
        )}

        <GarimpoPoints
          positives={g.positives}
          attentionPoints={g.attentionPoints}
          maxPositives={2}
        />

        {g.note && (
          <p className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-xs leading-relaxed text-muted-foreground">
            {g.note}
          </p>
        )}

        <div className="mt-6 flex-1" />

        {isClosed ? (
          <a
            href={WHATSAPP_FREE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-foreground transition-all duration-300 hover:border-foreground/35 hover:bg-surface/60"
          >
            QUERO RECEBER OS PRÓXIMOS <ArrowRight className="size-4" />
          </a>
        ) : locked ? (
          <a
            href={waGarimpoPrimeLink(g)}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
          >
            DESBLOQUEAR GARIMPO <Lock className="size-3.5" />
          </a>
        ) : (
          <a
            href={waGarimpoLink(g)}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
          >
            QUERO ESSE GARIMPO <ArrowRight className="size-4" />
          </a>
        )}

        <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
          Média de mercado é referência de comparação, não garantia de venda. Condições,
          documentação e custos externos variam conforme cada operação.
        </p>
      </div>
    </article>
  );
}

function PlaceholderCard({
  kind,
  ctaHref,
  ctaLabel,
}: {
  kind: "ABERTO" | "PRIME";
  ctaHref: string;
  ctaLabel: string;
}) {
  const prime = kind === "PRIME";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-dashed border-border-strong/60 bg-surface/20 p-6">
      <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-foreground/60">
        {prime && <Lock className="size-3" />}
        PRÓXIMO GARIMPO {kind}
      </span>
      <p className="mt-3 text-sm font-semibold leading-snug text-foreground/70">
        {prime
          ? "Oportunidades exclusivas dos membros Prime aparecem aqui, com análise completa e Valor Garimpo liberado."
          : "O radar segue rodando. O próximo garimpo aberto ao público aparece aqui, com números completos."}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Sem veículo, FIPE ou preço fictício: só publicamos oportunidade real e analisada.
      </p>
      <div className="mt-6 flex-1" />
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-foreground transition-all duration-300 hover:border-foreground/35 hover:bg-surface/60"
      >
        {ctaLabel} <ArrowRight className="size-4" />
      </a>
    </article>
  );
}

type Tab = "TODOS" | "ABERTOS" | "PRIME" | "ENCERRADOS";

const TABS: { id: Tab; label: string }[] = [
  { id: "TODOS", label: "TODOS" },
  { id: "ABERTOS", label: "ABERTOS" },
  { id: "PRIME", label: "PRIME" },
  { id: "ENCERRADOS", label: "ENCERRADOS RECENTES" },
];

export function UltimosGarimpos() {
  const [tab, setTab] = useState<Tab>("TODOS");

  const abertos = openGarimpos(GARIMPOS);
  const primes = primeGarimpos(GARIMPOS);
  const encerrados = recentClosedGarimpos(GARIMPOS);

  const showAbertos = tab === "TODOS" || tab === "ABERTOS";
  const showPrime = tab === "TODOS" || tab === "PRIME";
  const showEncerrados = tab === "TODOS" || tab === "ENCERRADOS";

  const counters = [
    { n: abertos.length, label: "ABERTOS" },
    { n: primes.length, label: "EXCLUSIVOS PRIME" },
    { n: encerrados.length, label: "ENCERRADOS RECENTES" },
  ];

  return (
    <section
      id="oportunidade"
      className="mx-auto max-w-6xl scroll-mt-20 border-t border-border px-5 py-20 sm:px-8"
    >
      <Reveal>
        <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">
          PROVA CONCRETA
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          ÚLTIMOS GARIMPOS
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cada garimpo é apresentado com números, contexto e status. FIPE e média de mercado servem
          como referência. O preço que importa é o Valor Garimpo.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {counters.map((c) => (
            <span
              key={c.label}
              className="rounded-full border border-border px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-muted-foreground"
            >
              <span className="text-foreground">{c.n}</span> {c.label}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-xl border px-4 py-2.5 text-[10px] font-bold tracking-[0.16em] transition-all duration-300 ${
                tab === t.id
                  ? "border-foreground/40 bg-surface/70 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showAbertos &&
          abertos.map((g, i) => (
            <Reveal key={g.id} delay={i * 80}>
              <GarimpoCard g={g} />
            </Reveal>
          ))}

        {showPrime &&
          primes.map((g, i) => (
            <Reveal key={g.id} delay={i * 80}>
              <GarimpoCard g={g} />
            </Reveal>
          ))}

        {showEncerrados &&
          encerrados.map((g, i) => (
            <Reveal key={g.id} delay={i * 80}>
              <GarimpoCard g={g} />
            </Reveal>
          ))}

        {showAbertos && abertos.length === 0 && (
          <Reveal delay={100}>
            <PlaceholderCard
              kind="ABERTO"
              ctaHref={WHATSAPP_FREE}
              ctaLabel="AVISE-ME NO PRÓXIMO"
            />
          </Reveal>
        )}

        {showPrime && primes.length === 0 && (
          <Reveal delay={160}>
            <PlaceholderCard
              kind="PRIME"
              ctaHref={waGarimpoPrimeLink()}
              ctaLabel="QUERO SER PRIME"
            />
          </Reveal>
        )}
      </div>

      <p className="mt-8 text-[10px] tracking-[0.14em] text-muted-foreground">
        HISTÓRICO PÚBLICO LIMITADO AOS {PUBLIC_CLOSED_LIMIT} GARIMPOS ENCERRADOS MAIS RECENTES.
      </p>
    </section>
  );
}
