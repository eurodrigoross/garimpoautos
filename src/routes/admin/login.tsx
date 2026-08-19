import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/Brand";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Garimpo Auto" },
      { name: "description", content: "Acesso restrito à mesa de operação do Garimpo Auto." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel Administrativo — Garimpo Auto" },
      { property: "og:description", content: "Acesso restrito à mesa de operação do Garimpo Auto." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <BrandMark className="mb-4 size-12" />
          <p className="text-sm font-semibold tracking-[0.35em] text-foreground">GARIMPO AUTO</p>
          <p className="mt-2 text-[11px] tracking-[0.3em] text-muted-foreground">
            PAINEL ADMINISTRATIVO
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[11px] tracking-[0.2em] text-muted-foreground">
              E-MAIL
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[11px] tracking-[0.2em] text-muted-foreground">
              SENHA
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Acesso restrito. Contas são criadas internamente.
        </p>
      </div>
    </main>
  );
}
