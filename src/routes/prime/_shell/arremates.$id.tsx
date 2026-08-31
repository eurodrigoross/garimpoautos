import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useDeleteDeal, useMyDeal, useUpdateDeal } from "@/lib/deals.data";
import {
  computeDeal,
  DEAL_STATUS_LABEL,
  DEAL_STATUS_ORDER,
  formatPct,
  type DealStatus,
} from "@/lib/deals.shared";
import { formatBRL, formatDate } from "@/lib/garimpo-finance";
import {
  MoneyField,
  ResultSummary,
  SourceChip,
  StatusChip,
  SummaryRow,
  parseMoney,
} from "@/components/prime/deal-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prime/_shell/arremates/$id")({
  head: () => ({
    meta: [{ title: "Meu arremate — Garimpo Auto" }, { name: "robots", content: "noindex" }],
  }),
  component: ArremateDetalhe,
});

const toInput = (v: number) => (v ? String(v).replace(".", ",") : "");

function ArremateDetalhe() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, error } = useMyDeal(id);
  const update = useUpdateDeal();
  const remove = useDeleteDeal();

  const [costs, setCosts] = useState({ transporte: "", documentacao: "", reparos: "", outros: "" });
  const [extras, setExtras] = useState<{ id: string; label: string; value: number }[]>([]);
  const [extraDraft, setExtraDraft] = useState("");
  const [notes, setNotes] = useState("");
  const [sale, setSale] = useState({ value: "", date: "", notes: "" });
  const [askSold, setAskSold] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!deal) return;
    setCosts({
      transporte: toInput(deal.transportCost),
      documentacao: toInput(deal.documentationCost),
      reparos: toInput(deal.repairCost),
      outros: toInput(deal.otherCost),
    });
    setExtras([]);
    setExtraDraft("");
    setNotes(deal.notes ?? "");
    setSale({
      value: deal.saleValue ? toInput(deal.saleValue) : "",
      date: deal.saleDate ?? new Date().toISOString().slice(0, 10),
      notes: deal.saleNotes ?? "",
    });
  }, [deal]);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl border border-border/40 bg-muted/20" />;
  }
  if (error || !deal) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Registro não encontrado.</p>
        <Link to="/prime/arremates" className="text-[11px] tracking-[0.18em] hover:underline">
          VOLTAR
        </Link>
      </div>
    );
  }

  const live = computeDeal({
    acquisitionValue: deal.acquisitionValue,
    fipeValue: deal.fipeValue,
    transportCost: parseMoney(costs.transporte),
    documentationCost: parseMoney(costs.documentacao),
    repairCost: parseMoney(costs.reparos),
    otherCost: parseMoney(costs.outros),
    saleValue: deal.saleValue,
    status: deal.status,
  });

  async function saveCosts() {
    setMsg(null);
    try {
      await update.mutateAsync({
        id,
        transportCost: parseMoney(costs.transporte),
        documentationCost: parseMoney(costs.documentacao),
        repairCost: parseMoney(costs.reparos),
        otherCost: parseMoney(costs.outros),
        notes,
      });
      setMsg("Custos atualizados.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao salvar.");
    }
  }

  async function changeStatus(status: DealStatus) {
    setMsg(null);
    if (status === "SOLD") {
      setAskSold(true);
      return;
    }
    try {
      await update.mutateAsync({ id, status });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao atualizar status.");
    }
  }

  async function confirmSold() {
    setMsg(null);
    const value = parseMoney(sale.value);
    if (value <= 0) {
      setMsg("Informe o valor real da venda.");
      return;
    }
    try {
      await update.mutateAsync({
        id,
        status: "SOLD",
        saleValue: value,
        saleDate: sale.date || new Date().toISOString().slice(0, 10),
        saleNotes: sale.notes,
      });
      setAskSold(false);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao registrar venda.");
    }
  }

  async function destroy() {
    if (!window.confirm("Excluir este arremate? Esta ação não pode ser desfeita.")) return;
    await remove.mutateAsync(id);
    void navigate({ to: "/prime/arremates" });
  }

  const acquisitionLabel =
    deal.source === "GARIMPO_AUTO" ? "Valor Garimpo (final)" : "Valor de aquisição";

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/prime/arremates"
          className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          ← MEUS ARREMATES
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.vehicleName}
              className="h-16 w-24 rounded-md border border-border/40 bg-muted/20 object-contain"
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{deal.vehicleName}</h1>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {[deal.yearModel, deal.garimpoCode, formatDate(deal.createdAt)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SourceChip source={deal.source} />
          <StatusChip status={deal.status} />
        </div>
      </header>

      <section className="space-y-3">
        <p className="text-[10px] tracking-[0.24em] text-muted-foreground">STATUS DO SEU ARREMATE</p>
        <div className="flex flex-wrap gap-2">
          {DEAL_STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              disabled={update.isPending}
              onClick={() => void changeStatus(s)}
              className={cn(
                "rounded-md border px-3 py-2 text-[10px] tracking-[0.18em] transition-colors disabled:opacity-50",
                deal.status === s
                  ? "border-foreground/40 bg-foreground text-background"
                  : "border-border/50 text-muted-foreground hover:border-foreground/30",
              )}
            >
              {DEAL_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          Este status é do seu registro pessoal e não altera o status do garimpo na mesa.
        </p>
      </section>

      {askSold ? (
        <section className="grid gap-4 rounded-xl border border-border/50 p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 text-[10px] tracking-[0.24em] text-muted-foreground">
            REGISTRAR VENDA
          </p>
          <MoneyField
            label="VALOR REAL DE VENDA (R$)"
            value={sale.value}
            onChange={(v) => setSale((p) => ({ ...p, value: v }))}
          />
          <label className="block">
            <span className="text-[10px] tracking-[0.18em] text-muted-foreground">DATA DA VENDA</span>
            <input
              type="date"
              value={sale.date}
              onChange={(e) => setSale((p) => ({ ...p, date: e.target.value }))}
              className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-3 text-base outline-none focus:border-foreground/40 sm:py-2 sm:text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] tracking-[0.18em] text-muted-foreground">
              OBSERVAÇÃO (OPCIONAL)
            </span>
            <textarea
              rows={2}
              value={sale.notes}
              onChange={(e) => setSale((p) => ({ ...p, notes: e.target.value }))}
              className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="button"
              disabled={update.isPending}
              onClick={() => void confirmSold()}
              className="rounded-md bg-prime px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-prime-foreground disabled:opacity-50"
            >
              CONFIRMAR VENDA
            </button>
            <button
              type="button"
              onClick={() => setAskSold(false)}
              className="rounded-md border border-border/60 px-4 py-2.5 text-[10px] tracking-[0.18em] text-muted-foreground"
            >
              CANCELAR
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="grid gap-4 rounded-xl border border-border/50 p-5 sm:grid-cols-2">
          <p className="sm:col-span-2 text-[10px] tracking-[0.24em] text-muted-foreground">
            CUSTOS (EDITÁVEIS)
          </p>
          <MoneyField
            label="TRANSPORTE / REMOÇÃO (R$)"
            value={costs.transporte}
            onChange={(v) => setCosts((p) => ({ ...p, transporte: v }))}
          />
          <MoneyField
            label="DOCUMENTAÇÃO / DESPACHANTE (R$)"
            value={costs.documentacao}
            onChange={(v) => setCosts((p) => ({ ...p, documentacao: v }))}
          />
          <MoneyField
            label="REPAROS / MANUTENÇÃO (R$)"
            value={costs.reparos}
            onChange={(v) => setCosts((p) => ({ ...p, reparos: v }))}
          />
          <MoneyField
            label="OUTROS CUSTOS (R$)"
            value={costs.outros}
            onChange={(v) => setCosts((p) => ({ ...p, outros: v }))}
          />
          <label className="block sm:col-span-2">
            <span className="text-[10px] tracking-[0.18em] text-muted-foreground">OBSERVAÇÕES</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={update.isPending}
              onClick={() => void saveCosts()}
              className="rounded-md border border-foreground/40 px-4 py-2.5 text-[10px] tracking-[0.2em] transition-colors hover:bg-muted/40 disabled:opacity-50"
            >
              SALVAR ALTERAÇÕES
            </button>
            <button
              type="button"
              onClick={() => void destroy()}
              className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              EXCLUIR
            </button>
            {msg ? <span className="text-[11px] text-muted-foreground">{msg}</span> : null}
          </div>
        </section>

        <aside className="h-fit space-y-5 rounded-xl border border-border/50 p-5 lg:sticky lg:top-6">
          <ResultSummary
            acquisitionLabel={acquisitionLabel}
            acquisitionValue={deal.acquisitionValue}
            costs={live.costs}
            totalCost={live.totalCost}
            fipe={deal.fipeValue}
            fipeMargin={live.fipeMargin}
            belowFipePct={live.belowFipePct}
          />

          {deal.status === "SOLD" && deal.saleValue ? (
            <div className="space-y-3 border-t border-border/40 pt-4">
              <p className="text-[10px] tracking-[0.24em] text-muted-foreground">VENDA REALIZADA</p>
              <SummaryRow label="Valor real de venda" value={formatBRL(deal.saleValue)} />
              <SummaryRow label="Data da venda" value={formatDate(deal.saleDate)} />
              <SummaryRow
                label="Resultado realizado"
                value={live.realizedResult === null ? "—" : formatBRL(live.realizedResult)}
                strong
                sub={
                  live.realizedPct === null
                    ? undefined
                    : `${formatPct(live.realizedPct)} sobre o custo total`
                }
              />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
