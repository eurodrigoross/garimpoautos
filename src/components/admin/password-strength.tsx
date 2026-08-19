import { Check, Minus } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

const rules = [
  { key: "length", label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { key: "upper", label: "Letra maiúscula (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower", label: "Letra minúscula (a-z)", test: (v: string) => /[a-z]/.test(v) },
  { key: "number", label: "Número (0-9)", test: (v: string) => /\d/.test(v) },
  { key: "special", label: "Caractere especial (!@#$% etc.)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function strengthLabel(score: number): { label: string; color: string; width: string } {
  if (score <= 2) return { label: "Fraca", color: "bg-red-500", width: "w-1/5" };
  if (score <= 3) return { label: "Média", color: "bg-amber-500", width: "w-2/5" };
  if (score <= 5) return { label: "Forte", color: "bg-emerald-500", width: "w-4/5" };
  return { label: "Muito forte", color: "bg-emerald-400", width: "w-full" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const score = scorePassword(password);
  const { label, color, width } = strengthLabel(score);

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Força da senha
        </span>
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            score <= 2 ? "text-red-400" : score <= 3 ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {password.length > 0 ? label : "—"}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all duration-300 ease-out ${color} ${password.length > 0 ? width : "w-0"}`}
        />
      </div>

      <ul className="space-y-2 pt-1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.key} className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                  password.length === 0
                    ? "bg-white/10 text-white/30"
                    : passed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/10 text-white/40"
                }`}
              >
                {passed ? <Check className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
              </span>
              <span
                className={`transition-colors ${
                  password.length === 0
                    ? "text-white/40"
                    : passed
                      ? "text-emerald-300"
                      : "text-white/60"
                }`}
              >
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
