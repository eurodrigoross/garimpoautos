import { Gem } from "lucide-react";

const links = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Mesa de Deals", href: "#mesa-de-deals" },
  { label: "Nossa Assessoria", href: "#assessoria" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#topo" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
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
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#mesa-de-deals"
          className="rounded-xl border border-gold/45 px-3 py-2 text-[11px] font-semibold tracking-wide text-gold transition-all hover:bg-gold/10 sm:px-4 sm:text-xs"
        >
          Área Restrita / Investidores
        </a>
      </nav>
    </header>
  );
}
