import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Field, Panel, SectionTitle, SolidButton, inputClass } from "@/components/admin/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/_shell/conta")({
  ssr: false,
  component: AdminAccount,
  head: () => ({
    meta: [
      { title: "Conta do administrador | Garimpo Auto" },
      { name: "description", content: "Alterar a senha de acesso ao painel administrativo do Garimpo Auto." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminAccount() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      const raw = error.message.toLowerCase();
      if (raw.includes("known") || raw.includes("pwned") || raw.includes("breach") || raw.includes("weak")) {
        toast.error(
          "Essa senha aparece em vazamentos públicos e foi bloqueada. Use uma senha única (ex.: 3 palavras + números e símbolos).",
        );
      } else if (raw.includes("should be different")) {
        toast.error("A nova senha precisa ser diferente da atual.");
      } else if (raw.includes("at least")) {
        toast.error("Senha muito curta para a política de segurança.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    setPassword("");
    setConfirm("");
    toast.success("Senha atualizada.");
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-[0.2em]">CONTA</h1>
        <p className="mt-2 text-sm text-muted-foreground">Altere a senha de acesso ao painel.</p>
      </div>

      <Panel className="space-y-5 p-6">
        <SectionTitle>TROCAR SENHA</SectionTitle>
        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <Field label="NOVA SENHA">
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="CONFIRMAR NOVA SENHA">
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </Field>
          <SolidButton type="submit" disabled={saving}>
            {saving ? "SALVANDO..." : "SALVAR SENHA"}
          </SolidButton>
        </form>
      </Panel>
    </div>
  );
}
