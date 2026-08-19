import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  useAdminGarimpo,
  useUpdateGarimpo,
  useDeleteGarimpo,
  useUploadGarimpoImage,
  type AdminGarimpo,
} from "@/lib/admin.data";
import { computeFinance, formatBRL, formatDate, formatPct } from "@/lib/garimpo-finance";
import type { GarimpoPatch } from "@/lib/admin.functions";
import {
  Field,
  GhostButton,
  Panel,
  STATUS_TEXT,
  SectionTitle,
  SolidButton,
  inputClass,
} from "@/components/admin/ui";

export const Route = createFileRoute("/admin/_shell/garimpos/$id")({
  head: () => ({
    meta: [
      { title: "Editar garimpo — Admin Garimpo Auto" },
      { name: "description", content: "Edição completa do garimpo, incluindo dados internos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Editar garimpo — Admin Garimpo Auto" },
      { property: "og:description", content: "Edição completa do garimpo." },
    ],
  }),
  component: EditGarimpoPage,
});

type FormState = {
  vehicle_name: string;
  year: string;
  mileage_km: string;
  transmission: string;
  fuel: string;
  location: string;
  fipe_value: string;
  market_value: string;
  internal_base_cost: string;
  internal_agio: string;
  garimpo_value: string;
  garimpo_note: string;
  positives: string[];
  attention_points: string[];
  access_type: "OPEN" | "PRIME";
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "CLOSED";
  published: boolean;
  main_image_url: string | null;
};

const toForm = (g: AdminGarimpo): FormState => ({
  vehicle_name: g.vehicle_name,
  year: g.year ?? "",
  mileage_km: g.mileage_km ?? "",
  transmission: g.transmission ?? "",
  fuel: g.fuel ?? "",
  location: g.location ?? "",
  fipe_value: g.fipe_value?.toString() ?? "",
  market_value: g.market_value?.toString() ?? "",
  internal_base_cost: g.internal_base_cost?.toString() ?? "",
  internal_agio: g.internal_agio?.toString() ?? "",
  garimpo_value: g.garimpo_value?.toString() ?? "",
  garimpo_note: g.garimpo_note ?? "",
  positives: [...g.positives],
  attention_points: [...g.attention_points],
  access_type: g.access_type,
  status: g.status,
  published: g.published,
  main_image_url: g.main_image_url,
});

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));

function EditGarimpoPage() {
  const { id } = useParams({ from: "/admin/_shell/garimpos/$id" });
  const { data, isLoading, isError, error } = useAdminGarimpo(id);
  const update = useUpdateGarimpo("Garimpo atualizado.");
  const upload = useUploadGarimpoImage();
  const remove = useDeleteGarimpo();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [confirming, setConfirming] = useState<null | { label: string; run: () => void }>(null);

  useEffect(() => {
    if (data) setForm(toForm(data));
  }, [data]);

  if (isLoading || !form) {
    return <div className="h-64 animate-pulse rounded-xl border border-border/40 bg-muted/20" />;
  }
  if (isError || !data) {
    return (
      <Panel className="p-6 text-sm text-destructive">
        {(error as Error)?.message ?? "Garimpo não encontrado."}
      </Panel>
    );
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const finance = computeFinance({
    fipe: numOrNull(form.fipe_value),
    market: numOrNull(form.market_value),
    garimpo: numOrNull(form.garimpo_value),
    internalCost: numOrNull(form.internal_base_cost),
    agio: numOrNull(form.internal_agio),
  });

  const save = () => {
    const patch: GarimpoPatch = {
      id,
      vehicle_name: form.vehicle_name.trim(),
      year: form.year.trim() || null,
      mileage_km: form.mileage_km.trim() || null,
      transmission: form.transmission.trim() || null,
      fuel: form.fuel.trim() || null,
      location: form.location.trim() || null,
      fipe_value: numOrNull(form.fipe_value),
      market_value: numOrNull(form.market_value),
      internal_base_cost: numOrNull(form.internal_base_cost),
      internal_agio: numOrNull(form.internal_agio),
      garimpo_value: numOrNull(form.garimpo_value),
      positives: form.positives.filter(Boolean),
      attention_points: form.attention_points.filter(Boolean),
      garimpo_note: form.garimpo_note.trim() || null,
      access_type: form.access_type,
      status: form.status,
      published: form.published,
      main_image_url: form.main_image_url,
    };
    if (!patch.vehicle_name) {
      toast.error("Informe o nome do veículo.");
      return;
    }
    update.mutate(patch);
  };

  const onPickFile = async (file: File) => {
    const result = await upload.mutateAsync({ file, code: data.code });
    set("main_image_url", result.main_image_url);
    update.mutate(
      { id, main_image_url: result.main_image_url },
      { onSuccess: () => toast.success("Foto atualizada.") },
    );
  };

  return (
    <div className="space-y-8 pb-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/admin/garimpos" className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground">
            ← GARIMPOS
          </Link>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">{data.vehicle_name}</h1>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {data.code} · criado em {formatDate(data.created_at)} · encerrado em {formatDate(data.closed_at)}
          </p>
        </div>
        <SolidButton onClick={save} disabled={update.isPending}>
          {update.isPending ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
        </SolidButton>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-6 xl:col-span-2">
          <Panel className="space-y-5 p-5">
            <SectionTitle>DADOS DO VEÍCULO</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="NOME DO VEÍCULO">
                <input className={inputClass} value={form.vehicle_name} onChange={(e) => set("vehicle_name", e.target.value)} />
              </Field>
              <Field label="ANO/MODELO">
                <input className={inputClass} value={form.year} onChange={(e) => set("year", e.target.value)} />
              </Field>
              <Field label="KM">
                <input className={inputClass} value={form.mileage_km} onChange={(e) => set("mileage_km", e.target.value)} />
              </Field>
              <Field label="CÂMBIO">
                <input className={inputClass} value={form.transmission} onChange={(e) => set("transmission", e.target.value)} />
              </Field>
              <Field label="COMBUSTÍVEL">
                <input className={inputClass} value={form.fuel} onChange={(e) => set("fuel", e.target.value)} />
              </Field>
              <Field label="LOCALIZAÇÃO">
                <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
              </Field>
            </div>
          </Panel>

          <Panel className="space-y-5 p-5">
            <SectionTitle>VALORES</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="FIPE">
                <input className={inputClass} inputMode="decimal" value={form.fipe_value} onChange={(e) => set("fipe_value", e.target.value)} />
              </Field>
              <Field label="MÉDIA DE MERCADO">
                <input className={inputClass} inputMode="decimal" value={form.market_value} onChange={(e) => set("market_value", e.target.value)} />
              </Field>
              <Field label="VALOR GARIMPO">
                <input className={inputClass} inputMode="decimal" value={form.garimpo_value} onChange={(e) => set("garimpo_value", e.target.value)} />
              </Field>
              <Field label="CUSTO INTERNO DO LOTE">
                <input className={inputClass} inputMode="decimal" value={form.internal_base_cost} onChange={(e) => set("internal_base_cost", e.target.value)} />
              </Field>
              <Field label="ÁGIO">
                <input className={inputClass} inputMode="decimal" value={form.internal_agio} onChange={(e) => set("internal_agio", e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-3 border-t border-border/40 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="LUCRO BRUTO" value={formatBRL(finance.grossProfit)} />
              <Metric label="DIFERENÇA P/ FIPE" value={formatBRL(finance.fipeDifference)} />
              <Metric label="DIFERENÇA P/ MERCADO" value={formatBRL(finance.marketDifference)} />
              <Metric label="% ABAIXO DA FIPE" value={formatPct(finance.discountFipePercent)} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Dados internos visíveis somente no painel. Nunca são expostos no Radar público.
            </p>
          </Panel>

          <Panel className="space-y-5 p-5">
            <SectionTitle>PONTOS POSITIVOS</SectionTitle>
            <ListEditor
              items={form.positives}
              onChange={(items) => set("positives", items)}
              placeholder="Ex.: MOTOR FUNCIONANDO"
            />
            <div className="border-t border-border/40 pt-5">
              <SectionTitle>PONTOS DE ATENÇÃO</SectionTitle>
              <div className="mt-4">
                <ListEditor
                  items={form.attention_points}
                  onChange={(items) => set("attention_points", items)}
                  placeholder="Ex.: PEQUENO REPARO DE FUNILARIA"
                />
              </div>
            </div>
          </Panel>

          <Panel className="space-y-4 p-5">
            <SectionTitle>OBSERVAÇÃO DO GARIMPO</SectionTitle>
            <textarea
              rows={4}
              className={inputClass}
              value={form.garimpo_note}
              onChange={(e) => set("garimpo_note", e.target.value)}
            />
          </Panel>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          <Panel className="space-y-4 p-5">
            <SectionTitle>FOTO PRINCIPAL</SectionTitle>
            <div className="aspect-video overflow-hidden rounded-md border border-border/50 bg-muted/20">
              {form.main_image_url ? (
                <img src={form.main_image_url} alt={form.vehicle_name} className="h-full w-full object-contain p-2" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] tracking-[0.2em] text-muted-foreground/60">
                  SEM FOTO
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onPickFile(file);
                e.target.value = "";
              }}
            />
            <div className="flex gap-2">
              <GhostButton disabled={upload.isPending} onClick={() => fileRef.current?.click()}>
                {upload.isPending ? "ENVIANDO..." : "SUBSTITUIR FOTO"}
              </GhostButton>
              {form.main_image_url ? (
                <GhostButton
                  onClick={() =>
                    setConfirming({
                      label: "Remover a foto principal deste Garimpo?",
                      run: () => {
                        set("main_image_url", null);
                        update.mutate(
                          { id, main_image_url: null },
                          { onSettled: () => setConfirming(null) },
                        );
                      },
                    })
                  }
                >
                  REMOVER FOTO
                </GhostButton>
              ) : null}
            </div>
          </Panel>

          <Panel className="space-y-5 p-5">
            <SectionTitle>PUBLICAÇÃO E ACESSO</SectionTitle>

            <Field label="ACESSO">
              <div className="flex gap-2">
                {(["OPEN", "PRIME"] as const).map((value) => (
                  <Toggle
                    key={value}
                    active={form.access_type === value}
                    label={value === "OPEN" ? "ABERTO" : "PRIME"}
                    tone={value === "PRIME" ? "prime" : "default"}
                    onClick={() => set("access_type", value)}
                  />
                ))}
              </div>
            </Field>

            <Field label="STATUS">
              <div className="flex flex-wrap gap-2">
                {(["AVAILABLE", "RESERVED", "SOLD", "CLOSED"] as const).map((value) => (
                  <Toggle
                    key={value}
                    active={form.status === value}
                    label={STATUS_TEXT[value]}
                    onClick={() => {
                      if (value === "CLOSED" && form.status !== "CLOSED") {
                        setConfirming({
                          label: "Tem certeza que deseja encerrar este Garimpo?",
                          run: () => {
                            set("status", "CLOSED");
                            setConfirming(null);
                          },
                        });
                        return;
                      }
                      set("status", value);
                    }}
                  />
                ))}
              </div>
            </Field>

            <Field label="VISIBILIDADE">
              <div className="flex gap-2">
                <Toggle active={form.published} label="PUBLICADO" onClick={() => set("published", true)} />
                <Toggle active={!form.published} label="RASCUNHO" onClick={() => set("published", false)} />
              </div>
            </Field>

            <p className="text-[10px] text-muted-foreground">
              Publicado em {formatDate(data.published_at)} · atualizado em {formatDate(data.updated_at)}
            </p>
          </Panel>

          <SolidButton className="w-full" onClick={save} disabled={update.isPending}>
            {update.isPending ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </SolidButton>

          <Panel className="space-y-3 p-5">
            <SectionTitle>ZONA DE RISCO</SectionTitle>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              A exclusão remove o garimpo e a foto principal em definitivo. Para tirar do Radar sem
              apagar o histórico, use ENCERRADO ou VENDIDO.
            </p>
            <GhostButton
              disabled={remove.isPending}
              className="w-full justify-center border-destructive/50 text-destructive hover:border-destructive"
              onClick={() =>
                setConfirming({
                  label: "Excluir este Garimpo definitivamente? Esta ação não pode ser desfeita.",
                  run: () =>
                    remove.mutate(id, {
                      onSuccess: () => void navigate({ to: "/admin/garimpos" }),
                      onSettled: () => setConfirming(null),
                    }),
                })
              }
            >
              {remove.isPending ? "EXCLUINDO..." : "EXCLUIR GARIMPO"}
            </GhostButton>
          </Panel>
        </div>
      </div>

      {confirming ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm">{confirming.label}</p>
            <div className="flex gap-2">
              <GhostButton onClick={() => setConfirming(null)}>CANCELAR</GhostButton>
              <GhostButton className="border-foreground/60" onClick={() => confirming.run()}>
                CONFIRMAR
              </GhostButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/50 p-3">
      <p className="text-[9px] tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function Toggle({
  active,
  label,
  onClick,
  tone = "default",
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  tone?: "default" | "prime";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-colors ${
        active
          ? tone === "prime"
            ? "border-prime bg-prime text-prime-foreground"
            : "border-foreground bg-foreground text-background"
          : "border-border/60 text-muted-foreground hover:border-foreground/40"
      }`}
    >
      {label}
    </button>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value].slice(0, 12));
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">Nenhum ponto cadastrado.</p>
        ) : (
          items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-[11px]"
            >
              {item}
              <button
                type="button"
                aria-label={`Remover ${item}`}
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </span>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <GhostButton onClick={add}>+ ADICIONAR</GhostButton>
      </div>
    </div>
  );
}
