import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { WHATSAPP_FREE, WHATSAPP_PRIME } from "@/lib/site";

const links = [
  ["Como funciona", "#como-funciona"],
  ["Oportunidades", "#oportunidade"],
  ["Garimpo Prime", "#planos"],
  ["FAQ", "#faq"],
];

export function Urgency() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-5 py-16 text-center sm:px-8">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            BOAS OPORTUNIDADES NÃO ESPERAM.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Um bom lote pode aparecer hoje e desaparecer amanhã.
          </p>
          <a
            href={WHATSAPP_FREE}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[12px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
          >
            QUERO ESTAR NO RADAR <ArrowRight className="size-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="ambient-glow relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-25" />
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            VOCÊ PODE CONTINUAR PROCURANDO.
            <br />
            <span className="text-muted-foreground">
              OU PODE DEIXAR O GARIMPO COM QUEM JÁ FAZ ISSO.
            </span>
          </h2>
          <p className="mt-6 text-sm text-muted-foreground">
            Nosso radar procura. Nosso time filtra. Você escolhe.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_PRIME}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-[12px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              ENTRAR NO GARIMPO <ArrowRight className="size-4" />
            </a>
            <a
              href={WHATSAPP_FREE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl border border-border px-7 py-4 text-[12px] font-bold tracking-wide text-foreground transition-all duration-300 hover:border-foreground/35 hover:bg-surface/60"
            >
              CONHECER GRATUITAMENTE
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <BrandLockup />

            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              Oportunidades de leilão, garimpadas por especialistas.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs text-muted-foreground">
            {links.map(([l, h]) => (
              <li key={l}>
                <a href={h} className="transition-colors hover:text-foreground">
                  {l}
                </a>
              </li>
            ))}
            {["Termos de Uso", "Política de Privacidade", "Contato"].map((l) => (
              <li key={l}>
                <a href="#topo" className="transition-colors hover:text-foreground">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-[10px] leading-relaxed text-muted-foreground">
          A Garimpo Auto atua na seleção e intermediação de oportunidades relacionadas a veículos de
          leilão. Cada operação está sujeita às regras, condições, disponibilidade e documentação do
          respectivo leilão. A Garimpo Auto não garante lucro, valorização, estado mecânico ou
          ausência de riscos inerentes à aquisição de veículos em leilão.
        </p>
        <p className="mt-4 text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Garimpo Auto.
        </p>
      </div>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border glass px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-foreground">GARIMPO PRIME</p>
          <p className="text-[11px] text-muted-foreground">R$ 50/mês</p>
        </div>
        <a
          href={WHATSAPP_PRIME}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-primary px-5 py-3 text-[11px] font-bold tracking-wide text-primary-foreground"
        >
          QUERO ENTRAR
        </a>
      </div>
    </div>
  );
}
