import { ArrowRight, Radar } from "lucide-react";
import { WHATSAPP_FREE } from "@/lib/site";

const found = [
  { id: "#0247", car: "TOYOTA COROLLA XEI 2021", bid: "R$ 58.400", market: "R$ 82.000" },
  { id: "#0251", car: "JEEP COMPASS LONGITUDE 2020", bid: "R$ 89.400", market: "R$ 121.500" },
  { id: "#0258", car: "HONDA CIVIC EXL 2019", bid: "R$ 71.200", market: "R$ 96.800" },
];

export function Hero() {
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
              href="#como-funciona"
              className="flex items-center justify-center rounded-xl border border-border px-6 py-4 text-[12px] font-bold tracking-wide text-foreground transition-all duration-300 hover:border-foreground/35 hover:bg-surface/60"
            >
              COMO FUNCIONA
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Comece gratuitamente.</p>
        </div>

        <div className="edge-light relative rounded-2xl border border-border/80 bg-surface/50 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-6">
          <div className="scanline pointer-events-none absolute inset-0 rounded-2xl" />
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">
            <span>RADAR GARIMPO</span>
            <span className="flex items-center gap-1.5 text-foreground">
              <span className="pulse-dot size-1.5 rounded-full bg-foreground" /> AO VIVO
            </span>
          </div>

          <ul className="mt-5 space-y-3">
            {found.map((f, i) => (
              <li
                key={f.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="card-in hover-lift rounded-xl border border-border bg-background/50 p-4"
              >
                <div className="flex items-center justify-between text-[10px] tracking-[0.18em] text-muted-foreground">
                  <span>GARIMPO {f.id}</span>
                  <span className="text-foreground">OPORTUNIDADE ENCONTRADA</span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">{f.car}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Arremate</p>
                    <p className="font-bold text-foreground">{f.bid}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Referência de mercado</p>
                    <p className="font-semibold text-muted-foreground line-through decoration-border-strong">
                      {f.market}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
            Exemplo ilustrativo de como as oportunidades são apresentadas na comunidade. Valores e
            condições variam conforme cada leilão.
          </p>
        </div>
      </div>
    </section>
  );
}
