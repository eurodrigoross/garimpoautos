/** Política de senha compartilhada entre cliente e servidor. */
export const PASSWORD_RULES = [
  { key: "length", label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { key: "upper", label: "Letra maiúscula (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower", label: "Letra minúscula (a-z)", test: (v: string) => /[a-z]/.test(v) },
  { key: "number", label: "Número (0-9)", test: (v: string) => /\d/.test(v) },
  {
    key: "special",
    label: "Caractere especial (!@#$% etc.)",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const;

export const MAX_PASSWORD_LENGTH = 72;

export function failedPasswordRules(password: string): string[] {
  const failed: string[] = PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.label);
  if (password.length > MAX_PASSWORD_LENGTH) failed.push("No máximo 72 caracteres");
  return failed;
}

export function isStrongPassword(password: string): boolean {
  return failedPasswordRules(password).length === 0;
}

export function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 255;
}
