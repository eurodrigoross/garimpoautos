import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/Brand";
import { PrimeBadge } from "@/components/PrimeBadge";
import { PasswordStrength } from "@/components/admin/password-strength";
import { signUpPrimeAccount } from "@/lib/auth.functions";
import { PASSWORD_RULES } from "@/lib/password-policy";

export const Route = createFileRoute("/prime/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso Garimpo Prime — Área de membros" },
      {
        name: "description",
        content: "Entre na área exclusiva do Garimpo Prime e veja a ficha completa dos garimpos.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso Garimpo Prime — Área de membros" },
      {
        property: "og:description",
        content: "Entre na área exclusiva do Garimpo Prime e veja a ficha completa dos garimpos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrimeLogin,
});

type Mode = "login" | "signup" | "forgot";

function PrimeLogin() {
  const navigate = useNavigate();
  const signUp = useServerFn(signUpPrimeAccount);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allRulesMet = useMemo(
    () => PASSWORD_RULES.every((rule) => rule.test(password)),
    [password],
  );

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/prime", replace: true });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === "signup") {
      if (!allRulesMet) {
        setLoading(false);
        setError("A senha não atende a todos os requisitos de segurança.");
        return;
      }
      try {
        await signUp({
          data: { email, password, redirectTo: `${window.location.origin}/prime` },
        });
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : "Não foi possível criar o acesso.");
        return;
      }
      setLoading(false);
      setInfo("Cadastro criado. Se pedirmos confirmação por e-mail, confirme e volte para entrar.");
      setMode("login");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    void navigate({ to: "/prime", replace: true });
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

        <form
          onSubmit={(e) => void onSubmit(e)}
          className="space-y-5 rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur"
        >
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
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              aria-describedby={mode === "signup" ? "password-requirements" : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>

          {mode === "signup" ? (
            <PasswordStrength password={password} id="password-requirements" />
          ) : null}

          <div aria-live="assertive" role="alert">
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>
          <div aria-live="polite">
            {info ? <p className="text-xs text-muted-foreground">{info}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loading || (mode === "signup" && !allRulesMet)}
            className="w-full rounded-md bg-foreground px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "AGUARDE..." : mode === "login" ? "ENTRAR" : "CRIAR ACESSO"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setInfo(null);
            }}
            className="w-full text-center text-[11px] tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "login" ? "AINDA NÃO TENHO ACESSO" : "JÁ TENHO ACESSO"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          O acesso Prime é liberado pela mesa da Garimpo Auto após a confirmação da assinatura.
        </p>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          <Link to="/" className="underline underline-offset-4 hover:text-foreground">
            Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
