import { useState } from "react";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/deals";

const options = [
  "Busco veículos para revenda rápida com margem/lucro estimado acima de R$ 10.000",
  "Quero comprar para uso próprio economizando até 50% em relação à Tabela FIPE",
  "Exijo garantia de documentação 100% checada, sem risco de leilão falso ou fraudes",
  "Preciso de suporte logístico completo (transporte cegonha/guincho e placa Mercosul)",
];

export function Hero() {
  const [selected, setSelected] = useState<number[]>([]);
  const active = selected.length > 0;

  const toggle = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <section id="topo" className="ambient-glow relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold">
            <Sparkles className="size-3.5" /> MESA DE ASSESSORIA VIP
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Oportunidades de retomados de banco com até{" "}
            <span className="text-gradient-gold">50% abaixo da Tabela FIPE</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curadoria exclusiva, validação jurídica da documentação, transferência de titularidade e
            logística completa.
          </p>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["+1.200", "Lotes assessorados"],
              ["100%", "Documentação checada"],
              ["27", "Estados atendidos"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="group rounded-xl border border-border bg-surface/60 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-surface-elevated/60"
              >
                <dt className="text-lg font-bold text-foreground sm:text-xl">{v}</dt>
                <dd className="mt-1 text-[11px] leading-tight text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="edge-light rounded-2xl border border-border/80 bg-surface/60 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="size-4" />
            <h2 className="text-sm font-bold tracking-wide">
              Filtro Interativo de Perfil de Investimento
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Clique nas opções para filtrar os lotes ideais para o seu objetivo:
          </p>

          <ul className="mt-6 space-y-3">
            {options.map((o, i) => {
              const on = selected.includes(i);
              return (
                <li key={o}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ${
                      on
                        ? "border-emerald/60 bg-emerald/10 shadow-[var(--shadow-emerald)]"
                        : "border-border bg-background/40 hover:border-foreground/25 hover:bg-surface-elevated/60 hover:shadow-[0_12px_28px_-20px_oklch(0_0_0/0.9)]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        on ? "border-emerald bg-emerald text-emerald-foreground" : "border-border-strong"
                      }`}
                    >
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-sm leading-snug ${on ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {o}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <a
            href={active ? "#mesa-de-deals" : undefined}
            aria-disabled={!active}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${
              active
                ? "sheen bg-emerald text-emerald-foreground shadow-[var(--shadow-emerald)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-18px_oklch(1_0_0/0.4)] active:translate-y-0"
                : "cursor-not-allowed border border-border bg-background/40 text-muted-foreground"
            }`}
          >
            VER LOTES RECOMENDADOS PARA SEU PERFIL <ArrowRight className="size-4" />
          </a>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Atendimento consultivo direto pela mesa —{" "}
            <a href={WHATSAPP_URL} className="text-gold underline-offset-4 transition-colors duration-300 hover:underline hover:text-foreground">
              falar com um assessor
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
