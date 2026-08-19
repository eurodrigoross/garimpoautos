import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

export const FAQ_ITEMS: [string, string][] = [
  [
    "COMO FUNCIONA A GARIMPO AUTO?",
    "Monitoramos leilões, filtramos lotes e analisamos as informações disponíveis. As oportunidades selecionadas são disponibilizadas para a comunidade.",
  ],
  [
    "DE ONDE VÊM AS OPORTUNIDADES?",
    "De operações e plataformas de leilão de veículos, conforme disponibilidade.",
  ],
  [
    "O VEÍCULO FICA NO MEU NOME?",
    "A documentação e a transferência dependem das regras e da estrutura de cada operação. Antes da conclusão, informamos ao comprador como será o processo aplicável àquela oportunidade.",
  ],
  [
    "O VALOR GARIMPO É O VALOR FINAL?",
    "Sim. O Valor Garimpo apresentado na oportunidade já inclui o valor do veículo, comissão do leiloeiro, taxas administrativas do leilão e o ágio do Garimpo Auto. Custos externos, como transporte e documentação/despachante, quando necessários, são de responsabilidade do comprador.",
  ],
  [
    "O QUE É O VALOR GARIMPO?",
    "É o valor final da oportunidade, com taxas do leilão, comissão do leiloeiro e ágio Garimpo já inclusos. FIPE e média de mercado aparecem apenas como referência de comparação.",
  ],

  [
    "A GARIMPO AUTO GARANTE QUE É UM BOM NEGÓCIO?",
    "Não. Analisamos e destacamos pontos de atenção, mas não prometemos lucro, valorização ou ausência de risco. A decisão é sua.",
  ],
  [
    "O QUE EU RECEBO NO GARIMPO PRIME?",
    "Mais oportunidades e acesso antecipado, comunidade VIP e conteúdos exclusivos. As ferramentas (Calculadora Garimpo, Gerenciador de Arremates e área do membro) estão no roadmap e serão liberadas conforme forem concluídas.",
  ],
  [
    "POSSO COMEÇAR GRATUITAMENTE?",
    "Sim. O Garimpo Aberto dá acesso à comunidade e a uma seleção de oportunidades, sem mensalidade.",
  ],

];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 border-t border-border px-5 py-20 sm:px-8">
      <Reveal>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">FAQ</h2>
      </Reveal>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {FAQ_ITEMS.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q}>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[13px] font-bold tracking-wide text-foreground">{q}</span>
                <Plus
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
