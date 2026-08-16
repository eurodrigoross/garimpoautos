import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WHATSAPP_FREE } from "@/lib/site";

const links = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Oportunidades", href: "#oportunidade" },
  { label: "Prime", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass edge-light">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#topo" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-border-strong/70 text-[11px] font-black tracking-tight text-foreground">
            GA
          </span>
          <span className="text-[13px] font-extrabold tracking-[0.28em] text-foreground">
            GARIMPO <span className="text-muted-foreground">AUTO</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-[13px] font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-foreground/60 after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_FREE}
            target="_blank"
            rel="noopener noreferrer"
            className="sheen hidden rounded-xl bg-primary px-4 py-2 text-[11px] font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 sm:block"
          >
            ENTRAR NO GARIMPO
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-border/60 px-5 py-3 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
