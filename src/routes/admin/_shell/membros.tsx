import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAdminMembers, useSetMembership } from "@/lib/admin.data";
import { formatDate } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_shell/membros")({
  head: () => ({ meta: [{ title: "Membros Prime — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Membros,
});

function Membros() {
  const { data, isLoading } = useAdminMembers();
  const setMembership = useSetMembership();
  const [query, setQuery] = useState("");
  const [expires, setExpires] = useState<Record<string, string>>({});

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((m) => !q || (m.email ?? "").toLowerCase().includes(q));
  }, [data, query]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Membros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ative ou desative manualmente o acesso à área Prime.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por e-mail"
          className="w-full max-w-xs rounded-md border border-border/50 bg-background px-3 py-2 text-xs outline-none focus:border-foreground/40"
        />
      </header>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
      ) : list.length === 0 ? (
        <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
          Nenhum usuário encontrado.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((m) => (
            <div
              key={m.userId}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-xl border p-4",
                m.isPrime ? "border-prime/30" : "border-border/50",
              )}
            >
              <div className="min-w-52 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{m.email ?? "(sem e-mail)"}</p>
                  {m.isPrime ? <PrimeBadge size="sm" /> : null}
                  {m.isAdmin ? (
                    <span className="rounded-md border border-border/60 px-2 py-[3px] text-[9px] tracking-[0.18em] text-muted-foreground">
                      ADMIN
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Criado em {formatDate(m.createdAt)}
                  {m.lastSignInAt ? ` · último acesso ${formatDate(m.lastSignInAt)}` : ""}
                  {m.expiresAt ? ` · vence ${formatDate(m.expiresAt)}` : ""}
                </p>
              </div>

              <label className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-muted-foreground">
                VENCIMENTO
                <input
                  type="date"
                  value={expires[m.userId] ?? (m.expiresAt ? m.expiresAt.slice(0, 10) : "")}
                  onChange={(e) => setExpires((p) => ({ ...p, [m.userId]: e.target.value }))}
                  className="rounded-md border border-border/50 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-foreground/40"
                />
              </label>

              <button
                type="button"
                disabled={setMembership.isPending}
                onClick={() =>
                  setMembership.mutate({
                    user_id: m.userId,
                    active: !m.isPrime,
                    expires_at: expires[m.userId] || m.expiresAt || null,
                  })
                }
                className={cn(
                  "rounded-md px-4 py-2 text-[10px] font-semibold tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-40",
                  m.isPrime
                    ? "border border-border/60 text-muted-foreground"
                    : "bg-prime text-prime-foreground",
                )}
              >
                {m.isPrime ? "DESATIVAR" : "ATIVAR PRIME"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
