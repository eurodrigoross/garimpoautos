import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/lib/admin.data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_shell")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    return { user: data.user };
  },
  component: AdminShell,
});

const NAV = [
  { to: "/admin", label: "VISÃO GERAL", exact: true },
  { to: "/admin/garimpos", label: "GARIMPOS", exact: false },
] as const;

const SOON = ["CLIENTES", "PRIME", "ARREMATES", "MÉTRICAS", "CONFIGURAÇÕES"];

function AdminShell() {
  const { user } = Route.useRouteContext();
  const session = useAdminSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  }

  const denied = session.isError || (session.data && !session.data.isAdmin);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-b border-border/60 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0",
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em]">GARIMPO AUTO</p>
              <p className="mt-1 text-[10px] tracking-[0.28em] text-muted-foreground">ADMIN</p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-md border border-border/60 px-3 py-1 text-[10px] tracking-[0.2em] text-muted-foreground lg:hidden"
            >
              MENU
            </button>
          </div>

          <div className={cn("px-3 pb-5 lg:block lg:h-[calc(100vh-92px)] lg:flex lg:flex-col", !menuOpen && "hidden")}>
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
              <p className="px-3 pb-1 text-[9px] tracking-[0.24em] text-muted-foreground/60">EM BREVE</p>
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
          ) : denied ? (
            <div className="mx-auto max-w-md pt-20 text-center">
              <p className="text-sm font-semibold tracking-[0.2em]">ACESSO NEGADO</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Sua conta está autenticada, mas não possui permissão de administrador.
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-6 rounded-md border border-border/60 px-4 py-2 text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                SAIR
              </button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
