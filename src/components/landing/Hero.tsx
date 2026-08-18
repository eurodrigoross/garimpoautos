import { ArrowRight, Radar } from "lucide-react";
import { WHATSAPP_FREE, brl } from "@/lib/site";
import { STATUS_LABEL } from "@/lib/garimpos";
import { useGarimpos } from "@/lib/garimpos.data";

export function Hero() {
  const { data } = useGarimpos();
  const g = data?.[0];

  return (
    <section id="topo" className="ambient-glow relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong/70 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">
            <Radar className="size-3.5" /> RADAR DE OPORTUNIDADES DE LEILÃO
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-[1.03] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            VOCÊ PROCURA CARROS.
            <br />
            <span className="text-muted-foreground">NÓS PROCURAMOS OPORTUNIDADES.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Um grupo de especialistas monitora leilões, filtra lotes e encontra oportunidades para
            você não precisar fazer isso sozinho.
          </p>

          <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-foreground">
            DO LEILÃO PARA VOCÊ.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_FREE}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-[12px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              QUERO RECEBER AS OPORTUNIDADES <ArrowRight className="size-4" />
            </a>
            <a
              href="#oportunidade"
              className="flex items-center justify-center rounded-xl border border-border px-6 py-4 text-[12px] font-bold tracking-wide text-foreground transition-all duration-300 hover:border-foreground/35 hover:bg-surface/60"
            >
              VER ÚLTIMOS GARIMPOS
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Comece gratuitamente.</p>
        </div>

        <div className="edge-light relative rounded-2xl border border-border/80 bg-surface/50 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-6">
          <div className="scanline pointer-events-none absolute inset-0 rounded-2xl" />
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
            <span>RADAR GARIMPO</span>
            {g && (
              <span className="rounded-full border border-foreground/25 px-3 py-1 text-[9px] font-bold text-muted-foreground">
                {STATUS_LABEL[g.status]}
              </span>
            )}
          </div>

          {g && (
          <div className="card-in mt-5 rounded-xl border border-border bg-background/50 p-5">
            <p className="text-sm font-bold leading-snug text-foreground">{g.vehicle}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {[g.year, g.km].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{g.location}</p>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-[10px] tracking-[0.16em] text-muted-foreground">FIPE</span>
                <span className="text-sm font-semibold text-muted-foreground line-through decoration-border-strong">
                  {brl(g.fipe)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <span className="text-[10px] tracking-[0.16em] text-muted-foreground">
                  MÉDIA DE MERCADO
                </span>
                <span className="text-sm font-semibold text-muted-foreground line-through decoration-border-strong">
                  {brl(g.market)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-foreground/30 bg-surface/60 px-4 py-3">
                <span className="text-[10px] font-bold tracking-[0.16em] text-foreground">
                  VALOR GARIMPO
                </span>
                <span className="text-lg font-extrabold tracking-tight text-foreground">
                  {brl(g.garimpo)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold tracking-[0.14em]">
              <span className="rounded-lg border border-foreground/30 px-3 py-2 text-foreground">
                {(g.belowFipePct ?? 0).toString().replace(".", ",")}% ABAIXO DA FIPE
              </span>
              <span className="rounded-lg border border-border px-3 py-2 text-muted-foreground">
                {brl(g.marketDiff)} DE DIFERENÇA PARA A MÉDIA
              </span>
            </div>
          </div>
          )}

          <div className="mt-3 rounded-xl border border-dashed border-border-strong/60 p-4 text-center">
            <p className="text-[10px] font-bold tracking-[0.18em] text-foreground/50">
              NOVOS GARIMPOS EM BREVE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
