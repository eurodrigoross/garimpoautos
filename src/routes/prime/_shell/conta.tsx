import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PasswordStrength } from "@/components/admin/password-strength";
import { PrimeBadge } from "@/components/PrimeBadge";
import { usePrimeSession } from "@/lib/prime.data";
import { formatDate } from "@/lib/garimpo-finance";
import { WHATSAPP_PRIME } from "@/lib/site";

export const Route = createFileRoute("/prime/_shell/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Área Prime" }, { name: "robots", content: "noindex" }] }),
  component: PrimeConta,
});

const strongEnough = (v: string) =>
  v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);

function PrimeConta() {
  const session = usePrimeSession();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      const msg = error.message.toLowerCase();
      toast.error(
        msg.includes("pwned") || msg.includes("weak") || msg.includes("compromised")
          ? "Essa senha aparece em vazamentos conhecidos. Escolha outra."
          : error.message,
      );
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Senha atualizada.");
  }

  const m = session.data?.membership;

  return (
    <div className="max-w-lg space-y-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Minha conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">{session.data?.email}</p>
      </header>

      <section className="rounded-xl border border-prime/30 border-t-2 border-t-prime/70 p-5">
        <div className="flex items-center gap-2">
          <PrimeBadge size="sm" />
          <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
            {session.data?.isPrime ? "ATIVO" : session.data?.isAdmin ? "ACESSO ADMIN" : "INATIVO"}
          </span>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          {m?.expires_at
            ? `Assinatura válida até ${formatDate(m.expires_at)}.`
            : "Assinatura ativa por tempo indeterminado, gerenciada pela mesa."}
        </p>
        <a
          href={WHATSAPP_PRIME}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[11px] tracking-[0.16em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          FALAR SOBRE MINHA ASSINATURA
        </a>
      </section>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5 rounded-xl border border-border/50 p-5">
        <h2 className="text-[10px] tracking-[0.22em] text-muted-foreground">ALTERAR SENHA</h2>

        <label className="block">
          <span className="text-[10px] tracking-[0.18em] text-muted-foreground">NOVA SENHA</span>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
        </label>

        <PasswordStrength password={password} />

        <label className="block">
          <span className="text-[10px] tracking-[0.18em] text-muted-foreground">CONFIRMAR SENHA</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
        </label>

        <button
          type="submit"
          disabled={saving || !strongEnough(password) || password !== confirm}
          className="rounded-md bg-foreground px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "SALVANDO..." : "SALVAR SENHA"}
        </button>
      </form>
    </div>
  );
}
