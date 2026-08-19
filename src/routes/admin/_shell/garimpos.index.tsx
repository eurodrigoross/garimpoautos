import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  useAdminGarimpos,
  useDeleteGarimpo,
  useUpdateGarimpo,
  type AdminGarimpo,
} from "@/lib/admin.data";
import { formatBRL, formatDate, formatPct } from "@/lib/garimpo-finance";
import {
  AccessChip,
  GhostButton,
  Panel,
  PublishChip,
  StatusChip,
  inputClass,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_shell/garimpos/")({
  head: () => ({
    meta: [
      { title: "Garimpos — Admin Garimpo Auto" },
      { name: "description", content: "Gerencie status, acesso e publicação dos garimpos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Garimpos — Admin Garimpo Auto" },
      { property: "og:description", content: "Gerencie status, acesso e publicação dos garimpos." },
    ],
  }),
  component: AdminGarimposPage,
});

const FILTERS = [
  "TODOS",
  "DISPONÍVEIS",
  "RESERVADOS",
  "VENDIDOS",
  "ENCERRADOS",
  "ABERTOS",
  "PRIME",
  "PUBLICADOS",
  "RASCUNHOS",
] as const;
type Filter = (typeof FILTERS)[number];

const matchFilter = (g: AdminGarimpo, f: Filter) => {
  switch (f) {
    case "DISPONÍVEIS":
      return g.status === "AVAILABLE";
    case "RESERVADOS":
      return g.status === "RESERVED";
    case "VENDIDOS":
      return g.status === "SOLD";
    case "ENCERRADOS":
      return g.status === "CLOSED";
    case "ABERTOS":
      return g.access_type === "OPEN";
    case "PRIME":
      return g.access_type === "PRIME";
    case "PUBLICADOS":
      return g.published;
    case "RASCUNHOS":
      return !g.published;
    default:
      return true;
  }
};

function AdminGarimposPage() {
  const { data, isLoading, isError, error } = useAdminGarimpos();
  const [filter, setFilter] = useState<Filter>("TODOS");
  const [term, setTerm] = useState("");

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data ?? []).filter(
      (g) =>
        matchFilter(g, filter) &&
        (!q || g.vehicle_name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q)),
    );
  }, [data, filter, term]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Garimpos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tudo que a extensão publica chega aqui para revisão e liberação no Radar.
          </p>
        </div>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar por veículo ou código"
          className={`${inputClass} max-w-xs`}
        />
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-[10px] tracking-[0.16em] transition-colors ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border/60 text-muted-foreground hover:border-foreground/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
          ))}
        </div>
      ) : isError ? (
        <Panel className="p-6 text-sm text-destructive">
          {(error as Error)?.message ?? "Erro ao carregar garimpos."}
        </Panel>
      ) : rows.length === 0 ? (
        <Panel className="p-6 text-sm text-muted-foreground">Nenhum garimpo encontrado para este filtro.</Panel>
      ) : (
        <div className="space-y-3">
          {rows.map((g) => (
            <GarimpoRow key={g.id} g={g} />
          ))}
        </div>
      )}
    </div>
  );
}

function GarimpoRow({ g }: { g: AdminGarimpo }) {
  const update = useUpdateGarimpo();
  const remove = useDeleteGarimpo();
  const [confirming, setConfirming] = useState<null | { label: string; run: () => void }>(null);

  const ask = (label: string, run: () => void) => setConfirming({ label, run });

  const radarUrl = "/#garimpos";

  return (
    <Panel className="p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/20">
          {g.main_image_url ? (
            <img src={g.main_image_url} alt={g.vehicle_name} className="h-full w-full object-contain p-0.5" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] tracking-[0.2em] text-muted-foreground/60">
              SEM FOTO
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{g.vehicle_name}</p>
            <StatusChip status={g.status} />
            <AccessChip access={g.access_type} />
            <PublishChip published={g.published} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {g.code} · {g.year ?? "—"} · publicado em {formatDate(g.published_at)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
            <span>
              Garimpo <span className="text-foreground tabular-nums">{formatBRL(g.garimpo_value)}</span>
            </span>
            <span>
              FIPE <span className="text-foreground tabular-nums">{formatBRL(g.fipe_value)}</span>
            </span>
            <span>
              Abaixo FIPE{" "}
              <span className="text-foreground tabular-nums">{formatPct(g.discount_fipe_percent)}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
          <Link
            to="/admin/garimpos/$id"
            params={{ id: g.id }}
            className="rounded-md border border-border/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] transition-colors hover:border-foreground/50 hover:bg-muted/40"
          >
            EDITAR
          </Link>

          {g.status !== "AVAILABLE" ? (
            <GhostButton
              disabled={update.isPending}
              onClick={() =>
                ask("Reabrir este Garimpo como DISPONÍVEL?", () =>
                  update.mutate(
                    { id: g.id, status: "AVAILABLE" },
                    { onSettled: () => setConfirming(null) },
                  ),
                )
              }
            >
              {g.status === "CLOSED" ? "REABRIR" : "MARCAR DISPONÍVEL"}
            </GhostButton>
          ) : null}

          {g.status !== "RESERVED" ? (
            <GhostButton
              disabled={update.isPending}
              onClick={() =>
                ask("Marcar este Garimpo como RESERVADO?", () =>
                  update.mutate(
                    { id: g.id, status: "RESERVED" },
                    { onSettled: () => setConfirming(null) },
                  ),
                )
              }
            >
              RESERVAR
            </GhostButton>
          ) : null}

          {g.status !== "SOLD" ? (
            <GhostButton
              disabled={update.isPending}
              onClick={() =>
                ask("Marcar este Garimpo como VENDIDO?", () =>
                  update.mutate({ id: g.id, status: "SOLD" }, { onSettled: () => setConfirming(null) }),
                )
              }
            >
              MARCAR VENDIDO
            </GhostButton>
          ) : null}

          {g.status !== "CLOSED" ? (
            <GhostButton
              disabled={update.isPending}
              onClick={() =>
                ask("Tem certeza que deseja encerrar este Garimpo?", () =>
                  update.mutate({ id: g.id, status: "CLOSED" }, { onSettled: () => setConfirming(null) }),
                )
              }
            >
              ENCERRAR
            </GhostButton>
          ) : null}

          <GhostButton
            disabled={update.isPending}
            onClick={() =>
              ask(g.published ? "Despublicar este Garimpo do Radar?" : "Publicar este Garimpo no Radar?", () =>
                update.mutate(
                  { id: g.id, published: !g.published },
                  { onSettled: () => setConfirming(null) },
                ),
              )
            }
          >
            {g.published ? "DESPUBLICAR" : "PUBLICAR"}
          </GhostButton>

          <GhostButton
            disabled={remove.isPending}
            className="border-destructive/50 text-destructive hover:border-destructive"
            onClick={() =>
              ask("Excluir este Garimpo definitivamente? Esta ação não pode ser desfeita.", () =>
                remove.mutate(g.id, { onSettled: () => setConfirming(null) }),
              )
            }
          >
            EXCLUIR
          </GhostButton>

          <a
            href={radarUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
          >
            VER NO RADAR
          </a>
        </div>
      </div>

      {confirming ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-foreground">{confirming.label}</p>
          <div className="flex gap-2">
            <GhostButton onClick={() => setConfirming(null)}>CANCELAR</GhostButton>
            <GhostButton
              disabled={update.isPending || remove.isPending}
              className="border-foreground/60"
              onClick={() => confirming.run()}
            >
              CONFIRMAR
            </GhostButton>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
