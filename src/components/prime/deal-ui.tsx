import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/garimpo-finance";
import { formatPct, DEAL_STATUS_LABEL, DEAL_SOURCE_LABEL } from "@/lib/deals.shared";
import type { DealSource, DealStatus } from "@/lib/deals.shared";

export const parseMoney = (v: string): number => {
  const parsed = Number(String(v).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export function MoneyField({
  label,
  value,
  onChange,
  hint,
  placeholder = "0",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-3 text-base tabular-nums outline-none transition-colors focus:border-foreground/40 sm:py-2 sm:text-sm"
      />
      {hint ? <span className="mt-1 block text-[10px] text-muted-foreground/70">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-border/50 bg-background px-3 py-3 text-base outline-none transition-colors focus:border-foreground/40 sm:py-2 sm:text-sm"
      />
    </label>
  );
}

/** Card informativo read-only para dados oficiais vindos do Garimpo Auto. */
export function OfficialCard({
  label,
  value,
  caption,
  title,
}: {
  label: string;
  value: string;
  caption?: string | undefined;
  title?: string | undefined;
}) {
  return (
    <div
      title={title}
      className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
      aria-readonly="true"
    >
      <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tabular-nums">{value}</p>
      {caption ? (
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  strong,
  sub,
}: {
  label: string;
  value: string;
  strong?: boolean | undefined;
  sub?: string | undefined;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={cn("text-[11px]", strong ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span className="text-right">
        <span className={strong ? "text-lg font-semibold tabular-nums" : "text-sm tabular-nums"}>
          {value}
        </span>
        {sub ? <span className="block text-[10px] text-muted-foreground">{sub}</span> : null}
      </span>
    </div>
  );
}

export function StatusChip({ status }: { status: DealStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-[9px] font-medium tracking-[0.18em]",
        status === "SOLD"
          ? "border-foreground/40 bg-foreground text-background"
          : "border-border/60 text-muted-foreground",
      )}
    >
      {DEAL_STATUS_LABEL[status]}
    </span>
  );
}

export function SourceChip({ source }: { source: DealSource }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border/50 px-2 py-1 text-[9px] tracking-[0.18em] text-muted-foreground/80">
      {DEAL_SOURCE_LABEL[source]}
    </span>
  );
}

export function ResultSummary({
  acquisitionLabel,
  acquisitionValue,
  costs,
  totalCost,
  fipe,
  fipeMargin,
  belowFipePct,
}: {
  acquisitionLabel: string;
  acquisitionValue: number;
  costs: number;
  totalCost: number;
  fipe: number | null;
  fipeMargin: number | null;
  belowFipePct: number | null;
}) {
  return (
    <div className="space-y-4">
      <SummaryRow label={acquisitionLabel} value={formatBRL(acquisitionValue)} />
      <SummaryRow label="Seus custos estimados" value={formatBRL(costs)} />
      <div className="border-t border-border/40 pt-4">
        <SummaryRow label="Custo total estimado" value={formatBRL(totalCost)} strong />
      </div>
      <div className="space-y-3 border-t border-border/40 pt-4">
        <SummaryRow label="FIPE" value={fipe && fipe > 0 ? formatBRL(fipe) : "—"} />
        <SummaryRow
          label="Margem até a FIPE"
          value={fipeMargin === null ? "—" : formatBRL(fipeMargin)}
          strong
          sub={
            belowFipePct === null ? undefined : `${formatPct(belowFipePct)} abaixo da FIPE após custos`
          }
        />
      </div>
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        A FIPE é utilizada apenas como referência. A margem apresentada não representa preço
        garantido de venda, lucro ou resultado financeiro.
      </p>
    </div>
  );
}
