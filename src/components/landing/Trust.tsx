import { FileCheck2, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Zero golpes de leilão",
    text: "Cada lote passa por checagem de origem, laudo cautelar e validação jurídica antes de entrar na mesa. Nenhum leilão falso, nenhum intermediário desconhecido.",
  },
  {
    icon: FileCheck2,
    title: "Transferência gerenciada",
    text: "Cuidamos de toda a titularidade: baixa de gravame, débitos, despachante credenciado e emissão da placa Mercosul no seu nome.",
  },
  {
    icon: Truck,
    title: "Logística de frete integrada",
    text: "Cotação de cegonha e guincho para todo o Brasil, com rastreio e seguro de transporte até o endereço do investidor.",
  },
];

const steps = [
  ["01", "Perfil", "Você define objetivo, ticket e região de interesse."],
  ["02", "Curadoria", "A mesa seleciona lotes com margem validada."],
  ["03", "Reserva", "Assessor confirma documentação e trava o lote."],
  ["04", "Entrega", "Transferência e frete concluídos porta a porta."],
];

export function Trust() {
  return (
    <>
      <section id="assessoria" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-gold">NOSSA ASSESSORIA</span>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Uma mesa privada que blinda cada etapa da sua operação
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="hover-lift edge-light rounded-2xl border border-border/80 bg-surface/60 p-7 backdrop-blur-xl hover:border-foreground/25"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-gold/35 bg-gold/10 text-gold">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-24 sm:px-8">
        <div className="rounded-2xl border border-border-strong/60 bg-surface/60 p-8 backdrop-blur-md sm:p-12">
          <span className="text-[11px] font-semibold tracking-[0.22em] text-gold">COMO FUNCIONA</span>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([n, t, d]) => (
              <div key={n} className="border-l border-border-strong pl-5">
                <span className="text-xs font-bold tracking-widest text-gold">{n}</span>
                <h3 className="mt-2 text-sm font-bold text-foreground">{t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
