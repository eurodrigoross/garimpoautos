import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/Brand";
import { PrimeBadge } from "@/components/PrimeBadge";
import { PasswordStrength } from "@/components/admin/password-strength";
import { PASSWORD_RULES } from "@/lib/password-policy";

export const Route = createFileRoute("/prime/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — Área Prime" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PrimeResetPassword,
});

const strongEnough = (v: string) => PASSWORD_RULES.every((r) => r.test(v));

function PrimeResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // A recovery link arrives with a hash fragment containing the recovery session.
    // Detect it so we only show the form when there is a valid recovery context.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const isRecovery = /type=recovery/.test(hash) || /access_token=/.test(hash);
    if (!isRecovery) {
      setReady(false);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (!strongEnough(password)) {
      toast.error("A senha não atende a todos os requisitos de segurança.");
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
          : msg.includes("session") || msg.includes("token")
            ? "O link expirou ou é inválido. Solicite um novo link de recuperação."
            : error.message,
      );
      return;
    }
    setDone(true);
    toast.success("Senha redefinida com sucesso.");
    // Encerra a sessão de recuperação antes de voltar ao login.
    void supabase.auth.signOut().finally(() => {
      void navigate({ to: "/prime/login", replace: true });
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <BrandMark className="mb-4 size-12" />
          <p className="text-sm font-semibold tracking-[0.35em] text-foreground">GARIMPO AUTO</p>
          <p className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-muted-foreground">
            ÁREA <PrimeBadge size="sm" />
          </p>
        </div>

        {ready === false ? (
          <div className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 text-center">
            <h1 className="text-sm font-semibold tracking-[0.16em]">LINK INVÁLIDO OU EXPIRADO</h1>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Este link de recuperação não é mais válido. Solicite um novo link na página de acesso.
            </p>
            <Link
              to="/prime/login"
              className="inline-block rounded-md bg-foreground px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-background transition-opacity hover:opacity-90"
            >
              IR PARA O ACESSO
            </Link>
          </div>
        ) : done ? (
          <div className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 text-center">
            <h1 className="text-sm font-semibold tracking-[0.16em]">SENHA ATUALIZADA</h1>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sua senha foi redefinida. Você já pode entrar na área Prime com a nova senha.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => void onSubmit(e)}
            className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur"
          >
            <div className="text-center">
              <h1 className="text-sm font-semibold tracking-[0.18em]">REDEFINIR SENHA</h1>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Defina uma nova senha para o seu acesso Prime.
              </p>
            </div>

            <label className="block">
              <span className="text-[11px] tracking-[0.2em] text-muted-foreground">NOVA SENHA</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-describedby="reset-password-requirements"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
              />
            </label>

            <PasswordStrength password={password} id="reset-password-requirements" />

            <label className="block">
              <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                CONFIRMAR SENHA
              </span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
              />
            </label>

            <button
              type="submit"
              disabled={saving || !strongEnough(password) || password !== confirm}
              className="w-full rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "SALVANDO..." : "REDEFINIR SENHA"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          <Link to="/prime/login" className="underline underline-offset-4 hover:text-foreground">
            Voltar para o acesso
          </Link>
        </p>
      </div>
    </main>
  );
}
