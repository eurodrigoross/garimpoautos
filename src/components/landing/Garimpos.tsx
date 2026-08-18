import { Reveal } from "./Reveal";
import { brl } from "@/lib/site";
import { GARIMPOS, STATUS_LABEL, type Garimpo } from "@/lib/garimpos";

export function GarimpoCard({ g }: { g: Garimpo }) {
  return (
    <article className="edge-light hover-lift h-full overflow-hidden rounded-2xl border border-border/80 bg-surface/50 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
          GARIMPO {g.id.toUpperCase()}
        </span>
        <span className="rounded-full border border-foreground/25 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-muted-foreground">
          {STATUS_LABEL[g.status]}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
          {g.vehicle}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {g.year} · {g.km} · {g.location}
        </p>

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
            <p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">
              {brl(g.garimpo)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold tracking-[0.14em]">
          <span className="rounded-lg border border-foreground/30 px-3 py-2 text-foreground">
            {g.belowFipePct.toString().replace(".", ",")}% ABAIXO DA FIPE
          </span>
          <span className="rounded-lg border border-border px-3 py-2 text-muted-foreground">
            {brl(g.marketDiff)} DE DIFERENÇA PARA A MÉDIA DE MERCADO
          </span>
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
          Média de mercado é referência de comparação, não garantia de venda. Condições, documentação
          e custos externos variam conforme cada operação.
        </p>
      </div>
    </article>
  );
}

export function UltimosGarimpos() {
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
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal>
          <GarimpoCard g={GARIMPOS[0]!} />
        </Reveal>

        <Reveal delay={120}>
          <div className="grid h-full gap-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex h-full min-h-32 flex-col justify-center rounded-2xl border border-dashed border-border-strong/60 bg-surface/20 p-6"
              >
                <p className="text-[11px] font-bold tracking-[0.18em] text-foreground/50">
                  NOVOS GARIMPOS EM BREVE
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  O radar segue rodando. As próximas oportunidades aparecem aqui.
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
