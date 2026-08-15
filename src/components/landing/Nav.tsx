import { Gem } from "lucide-react";

const links = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Mesa de Deals", href: "#mesa-de-deals" },
  { label: "Nossa Assessoria", href: "#assessoria" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass edge-light">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#topo" className="group flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold transition-all duration-300 group-hover:border-gold/70 group-hover:bg-gold/15 group-hover:shadow-[0_0_18px_-4px_oklch(1_0_0/0.35)]">
            <Gem className="size-4" />
          </span>
          <span className="text-sm font-extrabold tracking-[0.22em] text-foreground">
            REPASSE <span className="text-gold">VIP</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground relative transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-foreground/60 after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#mesa-de-deals"
          className="rounded-xl border border-gold/45 px-3 py-2 text-[11px] font-semibold tracking-wide text-gold transition-all duration-300 hover:border-gold/70 hover:bg-gold/10 hover:shadow-[0_10px_26px_-14px_oklch(1_0_0/0.45)] sm:px-4 sm:text-xs"
        >
          Área Restrita / Investidores
        </a>
      </nav>
    </header>
  );
}
