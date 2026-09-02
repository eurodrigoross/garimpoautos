/**
 * Server-only: agrega o SQL de schema do projeto a partir das migrações versionadas.
 * O conteúdo é embutido em build time e nunca contém segredos.
 */
const files = import.meta.glob("/supabase/migrations/*.sql", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export function buildSchemaSql(): { sql: string; files: string[] } {
  const names = Object.keys(files).sort();
  const parts = names.map((name) => {
    const short = name.split("/").pop() ?? name;
    return `-- ============================================================\n-- ${short}\n-- ============================================================\n${files[name]?.trim() ?? ""}\n`;
  });
  const header = [
    "-- GARIMPO AUTO — SCHEMA COMPLETO",
    "-- Gerado a partir das migrações versionadas do projeto.",
    "-- Execute este arquivo INTEIRO no SQL Editor do novo projeto, na ordem apresentada.",
    "-- Nenhuma chave, senha ou segredo está incluída aqui.",
    "",
  ].join("\n");
  return { sql: `${header}\n${parts.join("\n")}`, files: names.map((n) => n.split("/").pop() ?? n) };
}
