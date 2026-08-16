import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { WHATSAPP_FREE, WHATSAPP_PRIME } from "@/lib/site";

const free = [
  "Acesso ao grupo gratuito",
  "Seleção de oportunidades",
  "Avisos",
  "Conteúdos",
  "Acesso à comunidade",
];

const prime = [
  "Tudo do Garimpo Aberto",
  "Maior volume de oportunidades",
  "Oportunidades exclusivas",
  "Alertas de novos arremates",
  "Informações mais completas",
  "Comunidade exclusiva",
  "Maior proximidade com o radar Garimpo",
];

export function Pricing() {
  return (
    <section id="planos" className="mx-auto max-w-6xl scroll-mt-20 border-t border-border px-5 py-20 sm:px-8">
      <Reveal>
        <div className="rounded-2xl border border-border bg-surface/30 p-7 text-center sm:p-9">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            QUANTO VALE O SEU TEMPO?
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold tracking-[0.16em] text-muted-foreground">
            {["HORAS DE PESQUISA", "CENTENAS DE LOTES", "DIVERSOS LEILÕES", "FILTRAGEM", "ANÁLISE"].map(
              (s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && <span className="text-foreground/30">+</span>}
                  <span className="rounded-lg border border-border px-3 py-2">{s}</span>
                </span>
              ),
            )}
            <span className="text-foreground/30">=</span>
            <span className="rounded-lg border border-foreground/30 px-3 py-2 text-foreground">
              SEU TEMPO
            </span>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Ou você pode deixar o nosso radar trabalhando por você —{" "}
            <span className="font-bold text-foreground">R$ 50/mês</span>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            ESCOLHA COMO VOCÊ QUER GARIMPAR.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Comece gratuitamente. Evolua quando quiser receber mais oportunidades.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="hover-lift h-full rounded-2xl border border-border/80 bg-surface/40 p-7">
            <h3 className="text-[12px] font-bold tracking-[0.2em] text-muted-foreground">
              GARIMPO ABERTO
            </h3>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">R$ 0</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Para quem quer conhecer a Garimpo Auto.
            </p>
            <ul className="mt-6 space-y-3">
              {free.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-foreground" strokeWidth={3} /> {f}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_FREE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center rounded-xl border border-border px-5 py-3.5 text-[12px] font-bold tracking-wide text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-surface-elevated/50"
            >
              ENTRAR GRATUITAMENTE
            </a>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Sem cartão. Sem compromisso.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="edge-light hover-lift relative h-full rounded-2xl border border-foreground/25 bg-surface/70 p-7 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-primary-foreground">
              MAIS ACESSADO
            </span>
            <h3 className="text-[12px] font-bold tracking-[0.2em] text-foreground">GARIMPO PRIME</h3>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              R$ 50<span className="text-base font-semibold text-muted-foreground">/mês</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Para quem quer estar mais perto das oportunidades.
            </p>
            <ul className="mt-6 space-y-3">
              {prime.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={3} /> {f}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_PRIME}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen mt-8 flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-[12px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              QUERO SER PRIME
            </a>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Cancele quando quiser.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
