import { createFileRoute, Link } from "@tanstack/react-router";

import { useAdminGarimpos } from "@/lib/admin.data";
import { formatBRL, formatDate } from "@/lib/garimpo-finance";
import { AccessChip, Panel, PublishChip, SectionTitle, StatusChip } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_shell/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Admin Garimpo Auto" },
      { name: "description", content: "Painel operacional dos garimpos publicados pelo Radar." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Visão geral — Admin Garimpo Auto" },
      { property: "og:description", content: "Painel operacional dos garimpos do Radar." },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data, isLoading } = useAdminGarimpos();
  const rows = data ?? [];

  const count = (fn: (g: (typeof rows)[number]) => boolean) => rows.filter(fn).length;

  const cards = [
    { label: "GARIMPOS DISPONÍVEIS", value: count((g) => g.status === "AVAILABLE") },
    { label: "GARIMPOS RESERVADOS", value: count((g) => g.status === "RESERVED") },
    { label: "GARIMPOS ENCERRADOS", value: count((g) => g.status === "CLOSED") },
    { label: "GARIMPOS PRIME", value: count((g) => g.access_type === "PRIME") },
    { label: "GARIMPOS ABERTOS", value: count((g) => g.access_type === "OPEN") },
    { label: "PUBLICADOS", value: count((g) => g.published) },
    { label: "RASCUNHOS", value: count((g) => !g.published) },
  ];

  const latest = [...rows]
    .filter((g) => g.published_at)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Operação do Radar em tempo real. Dados reais do banco, sem estimativas.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {cards.map((card) => (
          <Panel key={card.label} className="p-4">
            <p className="text-[9px] leading-tight tracking-[0.18em] text-muted-foreground">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {isLoading ? <span className="inline-block h-6 w-8 animate-pulse rounded bg-muted/40" /> : card.value}
            </p>
          </Panel>
        ))}
      </section>

      <section className="space-y-4">
        <SectionTitle>ÚLTIMOS GARIMPOS PUBLICADOS</SectionTitle>
        <Panel className="divide-y divide-border/40">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/20" />
              ))}
            </div>
          ) : latest.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">Nenhum garimpo publicado ainda.</p>
          ) : (
            latest.map((g) => (
              <Link
                key={g.id}
                to="/admin/garimpos/$id"
                params={{ id: g.id }}
                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-muted/20"
              >
                <div className="h-10 w-14 shrink-0 overflow-hidden rounded border border-border/50 bg-muted/20">
                  {g.main_image_url ? (
                    <img src={g.main_image_url} alt={g.vehicle_name} className="h-full w-full object-cover" loading="lazy" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{g.vehicle_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.code} · {formatDate(g.published_at)}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatBRL(g.garimpo_value)}</p>
                <div className="flex gap-1.5">
                  <StatusChip status={g.status} />
                  <AccessChip access={g.access_type} />
                  <PublishChip published={g.published} />
                </div>
              </Link>
            ))
          )}
        </Panel>
      </section>
    </div>
  );
}
