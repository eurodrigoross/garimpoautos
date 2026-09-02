/**
 * Painel de Migração — server functions.
 *
 * Regras de segurança (não relaxar):
 *  - Todas as funções exigem sessão autenticada + papel `admin` (mesmo guard do painel).
 *  - NENHUM segredo é retornado: service role key, senha do banco e valores de secrets
 *    jamais trafegam para o navegador. Apenas NOMES de secrets são listados.
 *  - Exportação de dados usa service role somente dentro do handler, após a checagem de papel.
 */
import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error("Unauthorized: role check failed");
    if (!data) throw new Error("Forbidden: admin role required");
    return next({ context: { userId: context.userId } });
  });

/** Tabelas públicas exportáveis, em ordem segura de inserção (dependências primeiro). */
const TABLES = ["garimpos", "memberships", "prime_contents", "user_deals", "user_roles"] as const;
type TableName = (typeof TABLES)[number];

/** Nomes de secrets relevantes (apenas nomes — nunca valores). */
const SECRET_NAMES = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
  "RADAR_PUBLISH_TOKEN",
  "LOVABLE_API_KEY",
] as const;

export type MigrationOverview = {
  projectUrl: string;
  publishableKey: string;
  tables: { name: TableName; rows: number | null }[];
  buckets: { name: string; public: boolean }[];
  secrets: { name: string; configured: boolean }[];
  migrationFiles: string[];
};

export const getMigrationOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<MigrationOverview> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildSchemaSql } = await import("@/lib/migration-schema.server");

    const tables: { name: TableName; rows: number | null }[] = [];
    for (const name of TABLES) {
      const { count, error } = await supabaseAdmin
        .from(name)
        .select("*", { count: "exact", head: true });
      tables.push({ name, rows: error ? null : (count ?? 0) });
    }

    let buckets: { name: string; public: boolean }[] = [];
    const bucketRes = await supabaseAdmin.storage.listBuckets();
    if (!bucketRes.error && bucketRes.data) {
      buckets = bucketRes.data.map((b) => ({ name: b.name, public: Boolean(b.public) }));
    }

    return {
      projectUrl: process.env["SUPABASE_URL"] ?? "",
      publishableKey:
        process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"] ?? "",
      tables,
      buckets,
      secrets: SECRET_NAMES.map((name) => ({
        name,
        configured: Boolean(process.env[name]),
      })),
      migrationFiles: buildSchemaSql().files,
    };
  });

export const getSchemaSql = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<{ sql: string }> => {
    const { buildSchemaSql } = await import("@/lib/migration-schema.server");
    return { sql: buildSchemaSql().sql };
  });

/* ----------------------------- export de dados ----------------------------- */

function literal(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `'${text.replace(/'/g, "''")}'`;
}

function inserts(table: string, rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return `-- ${table}: nenhuma linha\n`;
  const cols = Object.keys(rows[0] as Record<string, unknown>);
  const values = rows
    .map((row) => `  (${cols.map((c) => literal(row[c])).join(", ")})`)
    .join(",\n");
  return (
    `-- ${table}: ${rows.length} linha(s)\n` +
    `INSERT INTO public.${table} (${cols.map((c) => `"${c}"`).join(", ")}) VALUES\n${values}\nON CONFLICT DO NOTHING;\n`
  );
}

export const getDataSql = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<{ sql: string; total: number }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const blocks: string[] = [
      "-- GARIMPO AUTO — DADOS",
      "-- Execute SOMENTE depois de aplicar o schema completo no novo projeto.",
      "-- Atenção: linhas com user_id referenciam usuários do Auth; recrie/importe os usuários antes.",
      "",
    ];
    let total = 0;
    for (const table of TABLES) {
      const { data, error } = await supabaseAdmin.from(table).select("*");
      if (error) {
        blocks.push(`-- ${table}: erro ao exportar (${error.message})\n`);
        continue;
      }
      const rows = (data ?? []) as Record<string, unknown>[];
      total += rows.length;
      blocks.push(inserts(table, rows));
    }
    return { sql: blocks.join("\n"), total };
  });
