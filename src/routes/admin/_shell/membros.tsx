import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  useAdminMembers,
  useSetMembership,
  useUpdateMember,
  useSetMemberBlocked,
  useDeleteMember,
} from "@/lib/admin.data";
import { formatDate } from "@/lib/garimpo-finance";
import { PrimeBadge } from "@/components/PrimeBadge";
import { PasswordStrength } from "@/components/admin/password-strength";
import { isStrongPassword } from "@/lib/password-policy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_shell/membros")({
  head: () => ({ meta: [{ title: "Membros Prime — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Membros,
});

function Membros() {
  const { data, isLoading } = useAdminMembers();
  const setMembership = useSetMembership();
  const updateMember = useUpdateMember();
  const setBlocked = useSetMemberBlocked();
  const deleteMember = useDeleteMember();

  const [query, setQuery] = useState("");
  const [expires, setExpires] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{ email: string; full_name: string; password: string }>({
    email: "",
    full_name: "",
    password: "",
  });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (m) =>
        !q ||
        (m.email ?? "").toLowerCase().includes(q) ||
        (m.fullName ?? "").toLowerCase().includes(q),
    );
  }, [data, query]);

  const busy = updateMember.isPending || setBlocked.isPending || deleteMember.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Membros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ative, inative, edite ou exclua o acesso dos membros.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por e-mail ou nome"
          aria-label="Buscar membro"
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
                "rounded-xl border p-4",
                m.blocked ? "border-destructive/40" : m.isPrime ? "border-prime/30" : "border-border/50",
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-52 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {m.fullName || m.email || "(sem e-mail)"}
                    </p>
                    {m.isPrime ? <PrimeBadge size="sm" /> : null}
                    {m.isAdmin ? (
                      <span className="rounded-md border border-border/60 px-2 py-[3px] text-[9px] tracking-[0.18em] text-muted-foreground">
                        ADMIN
                      </span>
                    ) : null}
                    {m.blocked ? (
                      <span className="rounded-md border border-destructive/50 px-2 py-[3px] text-[9px] tracking-[0.18em] text-destructive">
                        INATIVO
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {m.fullName ? `${m.email ?? ""} · ` : ""}
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
                  {m.isPrime ? "DESATIVAR PRIME" : "ATIVAR PRIME"}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-border/40 pt-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    const open = editing === m.userId;
                    setEditing(open ? null : m.userId);
                    if (!open) {
                      setForm({ email: m.email ?? "", full_name: m.fullName ?? "", password: "" });
                    }
                  }}
                  aria-expanded={editing === m.userId}
                  className="rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.18em] text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  {editing === m.userId ? "FECHAR EDIÇÃO" : "EDITAR PERFIL"}
                </button>

                <button
                  type="button"
                  disabled={busy || m.isAdmin}
                  onClick={() => setBlocked.mutate({ user_id: m.userId, blocked: !m.blocked })}
                  className="rounded-md border border-border/60 px-3 py-1.5 text-[10px] tracking-[0.18em] text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  {m.blocked ? "REATIVAR ACESSO" : "DEIXAR INATIVO"}
                </button>

                <button
                  type="button"
                  disabled={busy || m.isAdmin}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Excluir definitivamente ${m.email ?? "este usuário"}? Esta ação não pode ser desfeita.`,
                      )
                    ) {
                      deleteMember.mutate({ user_id: m.userId });
                    }
                  }}
                  className="rounded-md border border-destructive/50 px-3 py-1.5 text-[10px] tracking-[0.18em] text-destructive hover:opacity-80 disabled:opacity-40"
                >
                  EXCLUIR
                </button>
              </div>

              {editing === m.userId ? (
                <form
                  className="mt-4 space-y-4 rounded-lg border border-border/50 p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateMember.mutate(
                      {
                        user_id: m.userId,
                        email: form.email.trim() || null,
                        full_name: form.full_name.trim() || null,
                        password: form.password,
                      },
                      { onSuccess: () => setEditing(null) },
                    );
                  }}
                >
                  <label className="block">
                    <span className="text-[10px] tracking-[0.18em] text-muted-foreground">NOME</span>
                    <input
                      value={form.full_name}
                      onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.18em] text-muted-foreground">E-MAIL</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.18em] text-muted-foreground">
                      NOVA SENHA (OPCIONAL)
                    </span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={form.password}
                      aria-describedby={form.password ? `pwd-${m.userId}` : undefined}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
                    />
                  </label>
                  {form.password ? (
                    <PasswordStrength password={form.password} id={`pwd-${m.userId}`} />
                  ) : null}

                  <button
                    type="submit"
                    disabled={
                      updateMember.isPending ||
                      (form.password.length > 0 && !isStrongPassword(form.password))
                    }
                    className="rounded-md bg-foreground px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {updateMember.isPending ? "SALVANDO..." : "SALVAR PERFIL"}
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
