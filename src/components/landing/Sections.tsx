import { AlertTriangle, Check, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { WHATSAPP_FREE } from "@/lib/site";

const problems = [
  ["01", "CENTENAS DE LOTES"],
  ["02", "HORAS DE PESQUISA"],
  ["03", "MUITAS VARIÁVEIS"],
  ["04", "OPORTUNIDADES QUE PASSAM"],
];

const steps = [
  ["01", "GARIMPAMOS", "Encontramos oportunidades."],
  ["02", "ANALISAMOS", "Filtramos os lotes."],
  ["03", "ARREMATAMOS", "Buscamos boas condições."],
  ["04", "REPASSAMOS", "A oportunidade chega até você."],
];

const yes = [
  "Quer encontrar oportunidades em leilões.",
  "Não tem tempo para acompanhar centenas de lotes.",
  "Quer receber oportunidades já filtradas.",
  "Quer comprar buscando condições mais atrativas.",
  "Quer acesso a uma comunidade especializada.",
];

const no = [
  "Procura garantia de lucro.",
  'Acredita em "risco zero".',
  "Quer uma concessionária tradicional.",
  "Não aceita as condições próprias de um leilão.",
  "Procura apenas um carro novo convencional.",
];

const testimonials = [
  "Depoimento em breve — espaço reservado para membros da comunidade.",
  "Depoimento em breve — espaço reservado para membros da comunidade.",
  "Depoimento em breve — espaço reservado para membros da comunidade.",
];

export function Brand() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
      <Reveal>
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          O LEILÃO É PARA QUEM SABE GARIMPAR.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Existem centenas de lotes disponíveis. O desafio não é encontrar um carro. É encontrar uma
          oportunidade que realmente faça sentido.
        </p>
      </Reveal>
    </section>
  );
}

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-5 py-20 sm:px-8">
      <Reveal>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          O problema não é encontrar um carro.
          <br />
          <span className="text-muted-foreground">É encontrar um bom negócio.</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Centenas de lotes. Dezenas de oportunidades. Pouco tempo para pesquisar.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {problems.map(([n, t], i) => (
          <Reveal key={n} delay={i * 80} className="bg-background">
            <div className="hover-lift h-full bg-background p-6 hover:bg-surface/60">
              <span className="text-xs font-bold tracking-widest text-muted-foreground">{n}</span>
              <p className="mt-3 text-[13px] font-bold leading-snug tracking-wide text-foreground">
                {t}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-8 text-sm font-semibold text-foreground">
          É exatamente aí que entra a Garimpo Auto.
        </p>
      </Reveal>
    </section>
  );
}

export function Solution() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 border-t border-border px-5 py-20 sm:px-8">
      <Reveal>
        <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          NÓS FAZEMOS O GARIMPO.
          <br />
          <span className="text-muted-foreground">VOCÊ ESCOLHE A OPORTUNIDADE.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Monitoramos leilões, filtramos oportunidades e analisamos as informações disponíveis para
          colocar diante de você aquilo que merece sua atenção.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([n, t, d], i) => (
          <Reveal key={n} delay={i * 120}>
            <div className="hover-lift edge-light h-full rounded-2xl border border-border/80 bg-surface/40 p-6 backdrop-blur-md hover:border-foreground/25">
              <span className="text-2xl font-extrabold tracking-tight text-foreground/25">{n}</span>
              <h3 className="mt-4 text-[13px] font-bold tracking-[0.16em] text-foreground">{t}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProductMockup() {
  return (
    <section id="oportunidade" className="mx-auto max-w-6xl scroll-mt-20 border-t border-border px-5 py-20 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground">
            O PRODUTO
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            É assim que a oportunidade chega até você.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Cada oportunidade publicada vem com números, contexto e a nossa análise — pontos
            positivos e pontos de atenção.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <article className="edge-light overflow-hidden rounded-2xl border border-border/80 bg-surface/50 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
                GARIMPO #0247
              </span>
              <span className="rounded-full border border-foreground/30 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-foreground">
                OPORTUNIDADE SELECIONADA
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                TOYOTA COROLLA XEI 2021
              </h3>

              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border text-xs sm:grid-cols-3">
                {[
                  ["Valor do arremate", "R$ 58.400"],
                  ["Referência de mercado", "R$ 82.000"],
                  ["Taxas estimadas", "R$ 4.900"],
                  ["Localização", "Rio de Janeiro / RJ"],
                  ["Tipo", "Leilão"],
                  ["Documentação", "Conforme edital"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-background p-4">
                    <dt className="text-[10px] text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-bold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground">
                    PONTOS POSITIVOS
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-foreground">
                    {["Valor de arremate abaixo da referência", "Baixa quilometragem informada"].map(
                      (p) => (
                        <li key={p} className="flex gap-2">
                          <Check className="mt-px size-3.5 shrink-0" strokeWidth={3} /> {p}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground">
                    PONTOS DE ATENÇÃO
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {["Avarias descritas no laudo do leilão", "Retirada e frete por conta do comprador"].map(
                      (p) => (
                        <li key={p} className="flex gap-2">
                          <AlertTriangle className="mt-px size-3.5 shrink-0" /> {p}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <a
                href={WHATSAPP_FREE}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen mt-6 flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-[12px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                VER OPORTUNIDADE
              </a>
              <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                Exemplo ilustrativo. As informações são baseadas nos dados disponíveis da operação e
                devem ser conferidas no edital do respectivo leilão.
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function TimeSaved() {
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            O NOSSO TRABALHO ACONTECE ANTES DE VOCÊ CHEGAR.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Enquanto você trabalha, dirige ou cuida da sua rotina, nosso radar continua procurando.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
            {["PESQUISA", "FILTRAGEM", "ANÁLISE", "OPORTUNIDADE"].map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                {i > 0 && <span className="text-foreground/30">+</span>}
                <span className="rounded-lg border border-border px-4 py-2.5 text-foreground">
                  {s}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm font-semibold text-foreground">
            Você recebe o resultado do nosso garimpo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function ForWho() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-border/80 bg-surface/40 p-7">
            <h3 className="text-[12px] font-bold tracking-[0.18em] text-foreground">
              É PARA VOCÊ SE:
            </h3>
            <ul className="mt-5 space-y-3">
              {yes.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-foreground" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="h-full rounded-2xl border border-border/60 p-7">
            <h3 className="text-[12px] font-bold tracking-[0.18em] text-muted-foreground">
              NÃO É PARA VOCÊ SE:
            </h3>
            <ul className="mt-5 space-y-3">
              {no.map((t) => (
                <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-foreground/40" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section className="mx-auto max-w-6xl border-t border-border px-5 py-20 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            NÃO PROMETEMOS MÁGICA.
            <br />
            <span className="text-muted-foreground">PROMETEMOS PROCESSO.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Leilão envolve riscos. Um preço baixo não transforma automaticamente um veículo em uma
              oportunidade.
            </p>
            <p>A nossa função é procurar, filtrar e analisar as oportunidades disponíveis.</p>
            <p className="font-semibold text-foreground">Você decide.</p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14">
        <Reveal>
          <h3 className="text-[12px] font-bold tracking-[0.18em] text-muted-foreground">
            QUEM JÁ ENTROU NO GARIMPO.
          </h3>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <figure className="hover-lift h-full rounded-2xl border border-dashed border-border-strong/60 bg-surface/30 p-6">
                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  “{t}”
                </blockquote>
                <figcaption className="mt-5 text-[11px] tracking-[0.16em] text-foreground/40">
                  NOME / CIDADE
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
