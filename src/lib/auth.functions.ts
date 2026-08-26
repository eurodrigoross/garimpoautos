/**
 * Criação de acesso da Área Prime com validação de senha no SERVIDOR.
 * Impede que requisitos incompletos passem por chamadas diretas à API.
 */
import { createServerFn } from "@tanstack/react-start";

import { failedPasswordRules, isValidEmail } from "@/lib/password-policy";

export const signUpPrimeAccount = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const o = (raw ?? {}) as Record<string, unknown>;
    const email = String(o["email"] ?? "").trim().toLowerCase();
    const password = String(o["password"] ?? "");
    const redirectTo = String(o["redirectTo"] ?? "");
    if (!isValidEmail(email)) throw new Error("E-mail inválido.");
    const failed = failedPasswordRules(password);
    if (failed.length > 0) {
      throw new Error(`A senha não atende aos requisitos: ${failed.join(", ")}.`);
    }
    return { email, password, redirectTo };
  })
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const origin = /^https?:\/\//.test(data.redirectTo) ? data.redirectTo : undefined;
    const { error } = await client.auth.signUp(
      origin
        ? { email: data.email, password: data.password, options: { emailRedirectTo: origin } }
        : { email: data.email, password: data.password },
    );

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("registered") || msg.includes("already")) {
        throw new Error("Esse e-mail já possui cadastro. Faça login.");
      }
      if (msg.includes("pwned") || msg.includes("weak") || msg.includes("compromised")) {
        throw new Error("Essa senha aparece em vazamentos conhecidos. Escolha outra.");
      }
      throw new Error(error.message);
    }

    return { ok: true as const };
  });
