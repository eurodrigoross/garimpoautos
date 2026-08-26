import { Check, Minus } from "lucide-react";

import { PASSWORD_RULES, scorePassword } from "@/lib/password-policy";

interface PasswordStrengthProps {
  password: string;
  /** Permite associar o bloco ao input via aria-describedby. */
  id?: string;
}

function strengthLabel(score: number): { label: string; color: string; width: string } {
  if (score <= 2) return { label: "Fraca", color: "bg-muted-foreground/40", width: "w-1/5" };
  if (score <= 3) return { label: "Média", color: "bg-muted-foreground/70", width: "w-2/5" };
  if (score <= 5) return { label: "Forte", color: "bg-foreground/80", width: "w-4/5" };
  return { label: "Muito forte", color: "bg-foreground", width: "w-full" };
}

export function PasswordStrength({ password, id }: PasswordStrengthProps) {
  const score = scorePassword(password);
  const { label, color, width } = strengthLabel(score);
  const empty = password.length === 0;
  const missing = PASSWORD_RULES.filter((r) => !r.test(password));

  return (
    <section
      id={id}
      aria-label="Requisitos e força da senha"
      className="space-y-3 rounded-md border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Força da senha
        </span>
        <span
          aria-hidden="true"
          className={`text-xs font-semibold uppercase tracking-wider ${
            score <= 2 ? "text-muted-foreground" : score <= 3 ? "text-foreground/70" : "text-foreground"
          }`}
        >
          {empty ? "—" : label}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={6}
        aria-valuenow={empty ? 0 : score}
        aria-valuetext={empty ? "Senha vazia" : `Força da senha: ${label}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className={`h-full transition-all duration-300 ease-out ${color} ${empty ? "w-0" : width}`}
        />
      </div>

      <ul className="space-y-2 pt-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.key} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                  empty
                    ? "bg-white/10 text-white/30"
                    : passed
                      ? "bg-foreground text-background"
                      : "bg-white/10 text-white/40"
                }`}
              >
                {passed ? <Check className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
              </span>
              <span
                className={`transition-colors ${
                  empty ? "text-white/40" : passed ? "text-foreground" : "text-white/60"
                }`}
              >
                {rule.label}
              </span>
              <span className="sr-only">
                {empty ? "pendente" : passed ? "requisito atendido" : "requisito pendente"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Resumo anunciado por leitores de tela conforme o usuário digita */}
      <p aria-live="polite" className="sr-only">
        {empty
          ? "Digite uma senha para ver os requisitos."
          : missing.length === 0
            ? `Senha ${label}. Todos os requisitos foram atendidos.`
            : `Senha ${label}. Faltam ${missing.length} requisito(s): ${missing
                .map((r) => r.label)
                .join(", ")}.`}
      </p>
    </section>
  );
}
