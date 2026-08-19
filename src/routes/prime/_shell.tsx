import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { usePrimeSession } from "@/lib/prime.data";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/Brand";
import { PrimeBadge } from "@/components/PrimeBadge";
import { WHATSAPP_PRIME } from "@/lib/site";

export const Route = createFileRoute("/prime/_shell")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/prime/login" });
    return { user: data.user };
  },
  component: PrimeShell,
});

const NAV = [
  { to: "/prime", label: "INÍCIO", exact: true },
  { to: "/prime/garimpos", label: "GARIMPOS", exact: false },
  { to: "/prime/calculadora", label: "CALCULADORA", exact: false },
  { to: "/prime/conteudos", label: "CONTEÚDOS", exact: false },
  { to: "/prime/conta", label: "MINHA CONTA", exact: false },
] as const;

const SOON = ["MEUS ARREMATES", "COMUNIDADE VIP", "MENTORIAS", "FERRAMENTAS AVANÇADAS"];

function PrimeShell() {
  const { user } = Route.useRouteContext();
  const session = usePrimeSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/prime/login", replace: true });
  }

  const allowed = session.data?.isPrime || session.data?.isAdmin;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:flex">
        <aside className="border-b border-border/60 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between px-5 py-5">
            <Link to="/prime" className="flex items-center gap-2.5">
              <BrandMark className="size-7" />
              <div>
                <p className="text-xs font-semibold tracking-[0.3em]">GARIMPO AUTO</p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.28em] text-muted-foreground">
                  ÁREA <PrimeBadge size="sm" />
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-md border border-border/60 px-3 py-1 text-[10px] tracking-[0.2em] text-muted-foreground lg:hidden"
            >
              MENU
            </button>
          </div>

          <div
            className={cn(
              "px-3 pb-5 lg:flex lg:h-[calc(100vh-92px)] lg:flex-col",
              !menuOpen && "hidden lg:flex",
            )}
          >
            <nav className="space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  onClick={() => setMenuOpen(false)}
                  activeProps={{ className: "border-foreground/40 bg-muted/40 text-foreground" }}
                  inactiveProps={{ className: "border-transparent text-muted-foreground" }}
                  className="block rounded-md border px-3 py-2 text-[11px] tracking-[0.2em] transition-colors hover:bg-muted/30"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-1 border-t border-border/40 pt-4">
              <p className="px-3 pb-1 text-[9px] tracking-[0.24em] text-muted-foreground/60">
                EM DESENVOLVIMENTO
              </p>
              {SOON.map((label) => (
                <p key={label} className="px-3 py-1.5 text-[11px] tracking-[0.2em] text-muted-foreground/40">
                  {label}
                </p>
              ))}
            </div>

            <div className="mt-6 border-t border-border/40 pt-4 lg:mt-auto">
              <p className="truncate px-3 text-[11px] text-muted-foreground">{user.email}</p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-2 w-full rounded-md border border-border/60 px-3 py-2 text-[10px] tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                SAIR
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
          {session.isLoading ? (
            <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
          ) : allowed ? (
            <Outlet />
          ) : (
            <div className="mx-auto max-w-md pt-16 text-center">
              <PrimeBadge size="lg" />
              <h1 className="mt-5 text-lg font-semibold tracking-[0.16em]">ACESSO PRIME PENDENTE</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sua conta está criada, mas ainda não há uma assinatura Prime ativa. Fale com a mesa
                da Garimpo Auto para liberar a área exclusiva.
              </p>
              <a
                href={WHATSAPP_PRIME}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-md bg-prime px-5 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-prime-foreground transition-opacity hover:opacity-90"
              >
                QUERO ATIVAR MEU ACESSO
              </a>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-6 block w-full text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                SAIR
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
