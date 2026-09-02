import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  getDataSql,
  getMigrationOverview,
  getSchemaSql,
} from "@/lib/migration.functions";

export const Route = createFileRoute("/admin/_shell/migracao")({
  component: MigracaoPage,
});

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border/60 p-5">
      <p className="text-[10px] tracking-[0.28em] text-muted-foreground">PASSO {step}</p>
      <h2 className="mt-2 text-sm font-semibold tracking-[0.18em]">{title}</h2>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Btn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border/70 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] transition hover:bg-foreground hover:text-background disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function MigracaoPage() {
  const overviewFn = useServerFn(getMigrationOverview);
  const schemaFn = useServerFn(getSchemaSql);
  const dataFn = useServerFn(getDataSql);
  const [copied, setCopied] = useState<string | null>(null);

  const overview = useQuery({
    queryKey: ["admin", "migracao", "overview"],
    queryFn: () => overviewFn({}),
  });

  const schema = useMutation({ mutationFn: () => schemaFn({}) });
  const dados = useMutation({ mutationFn: () => dataFn({}) });

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1800);
  }

  const o = overview.data;

  return (
    <div className="space-y-6 p-5 lg:p-8">
      <header>
        <h1 className="text-lg font-semibold tracking-[0.18em]">PAINEL DE MIGRAÇÃO</h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Área privada, acessível apenas com login de administrador. Siga os passos na ordem para
          migrar o backend para outro projeto. Por segurança, chaves secretas (service role) e a
          senha do banco NUNCA são exibidas aqui — elas devem ser obtidas apenas no painel do
          provedor e usadas localmente.
        </p>
      </header>

      {overview.isError ? (
        <p className="rounded-md border border-destructive/40 p-4 text-xs text-destructive">
          Acesso negado ou falha ao carregar. Confirme que sua conta possui papel de administrador.
        </p>
      ) : null}

      <Section
        step="1"
        title="SCHEMA (ESTRUTURA DO BANCO)"
        description="SQL completo com tabelas, tipos, funções, triggers, GRANTs e políticas de segurança, montado a partir das migrações versionadas. Execute o arquivo inteiro no SQL Editor do novo projeto antes de qualquer outra coisa."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Btn onClick={() => schema.mutate()} disabled={schema.isPending}>
            {schema.isPending ? "GERANDO..." : "GERAR SQL DO SCHEMA"}
          </Btn>
          {schema.data ? (
            <>
              <Btn onClick={() => download("01-schema.sql", schema.data.sql)}>BAIXAR .SQL</Btn>
              <Btn onClick={() => void copy("schema", schema.data.sql)}>
                {copied === "schema" ? "COPIADO" : "COPIAR"}
              </Btn>
            </>
          ) : null}
        </div>
        {o?.migrationFiles?.length ? (
          <p className="mt-3 text-[11px] text-muted-foreground">
            {o.migrationFiles.length} migração(ões) incluída(s).
          </p>
        ) : null}
        {schema.data ? (
          <pre className="mt-4 max-h-72 overflow-auto rounded-md border border-border/60 bg-muted/30 p-3 text-[11px] leading-relaxed">
            {schema.data.sql.slice(0, 4000)}
            {schema.data.sql.length > 4000 ? "\n… (baixe o arquivo para ver tudo)" : ""}
          </pre>
        ) : null}
      </Section>

      <Section
        step="2"
        title="DADOS (LINHAS DAS TABELAS)"
        description="INSERTs de garimpos, assinaturas, conteúdos Prime, arremates dos membros e papéis. Execute somente após o schema. Usuários do Auth não são exportados aqui — recrie/importe as contas antes de inserir linhas com user_id."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Btn onClick={() => dados.mutate()} disabled={dados.isPending}>
            {dados.isPending ? "GERANDO..." : "GERAR SQL DE DADOS"}
          </Btn>
          {dados.data ? (
            <>
              <Btn onClick={() => download("02-dados.sql", dados.data.sql)}>BAIXAR .SQL</Btn>
              <Btn onClick={() => void copy("dados", dados.data.sql)}>
                {copied === "dados" ? "COPIADO" : "COPIAR"}
              </Btn>
              <span className="text-[11px] text-muted-foreground">
                {dados.data.total} linha(s) exportada(s)
              </span>
            </>
          ) : null}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(o?.tables ?? []).map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-[11px]"
            >
              <span className="tracking-[0.12em]">{t.name}</span>
              <span className="text-muted-foreground">{t.rows ?? "—"}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        step="3"
        title="STORAGE (ARQUIVOS)"
        description="Recrie os buckets abaixo com a mesma visibilidade no novo projeto e copie os arquivos. Imagens dos garimpos usam URLs assinadas; após migrar, republique/regenere os links."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {(o?.buckets ?? []).map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-[11px]"
            >
              <span className="tracking-[0.12em]">{b.name}</span>
              <span className="text-muted-foreground">{b.public ? "público" : "privado"}</span>
            </div>
          ))}
          {o && o.buckets.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">Nenhum bucket encontrado.</p>
          ) : null}
        </div>
      </Section>

      <Section
        step="4"
        title="CONFIGURAÇÃO PÚBLICA"
        description="Valores seguros de exibir, usados pelo frontend. Após migrar, substitua-os pelos do novo projeto nas variáveis de ambiente."
      >
        <div className="space-y-3">
          {[
            { label: "URL DO PROJETO", value: o?.projectUrl ?? "" },
            { label: "CHAVE PÚBLICA (ANON/PUBLISHABLE)", value: o?.publishableKey ?? "" },
          ].map((item) => (
            <div key={item.label} className="rounded-md border border-border/60 p-3">
              <p className="text-[10px] tracking-[0.24em] text-muted-foreground">{item.label}</p>
              <div className="mt-2 flex items-center gap-3">
                <code className="min-w-0 flex-1 truncate text-[11px]">{item.value || "—"}</code>
                <Btn onClick={() => void copy(item.label, item.value)}>
                  {copied === item.label ? "COPIADO" : "COPIAR"}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        step="5"
        title="SEGREDOS (SOMENTE NOMES)"
        description="Estes segredos precisam existir no novo ambiente com os MESMOS NOMES. Os valores não são e não podem ser exibidos aqui — configure-os diretamente nas variáveis de ambiente do novo projeto."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {(o?.secrets ?? []).map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-[11px]"
            >
              <span className="tracking-[0.12em]">{s.name}</span>
              <span className="text-muted-foreground">
                {s.configured ? "configurado" : "ausente"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        step="6"
        title="CHECKLIST FINAL"
        description="Ordem recomendada para concluir a migração sem perder acesso."
      >
        <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>Criar o novo projeto de backend e executar o SQL do passo 1.</li>
          <li>Recriar/importar os usuários de autenticação (admins e membros Prime).</li>
          <li>Executar o SQL do passo 2 (dados).</li>
          <li>Recriar buckets e copiar os arquivos do storage (passo 3).</li>
          <li>Atualizar URL e chave pública do frontend (passo 4).</li>
          <li>Reconfigurar os segredos por nome no novo ambiente (passo 5).</li>
          <li>Conferir papéis de administrador e assinaturas Prime, e testar login, radar e área Prime.</li>
        </ol>
      </Section>
    </div>
  );
}
