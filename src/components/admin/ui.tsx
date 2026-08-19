import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { PrimeBadge } from "@/components/PrimeBadge";
import type { RadarAccessType, RadarStatus } from "@/lib/radar-contract";

export const STATUS_TEXT: Record<RadarStatus, string> = {
  AVAILABLE: "DISPONÍVEL",
  RESERVED: "RESERVADO",
  CLOSED: "ENCERRADO",
};

export const ACCESS_TEXT: Record<RadarAccessType, string> = {
  OPEN: "ABERTO",
  PRIME: "PRIME",
};

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "solid" | "outline" | "faint" | "prime";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-[0.14em] whitespace-nowrap",
        tone === "solid" && "border-foreground bg-foreground text-background",
        tone === "muted" && "border-border/60 bg-muted/30 text-muted-foreground",
        tone === "outline" && "border-foreground/40 bg-transparent text-foreground",
        tone === "faint" && "border-border/40 bg-transparent text-muted-foreground/60",
        tone === "prime" && "border-prime bg-prime text-prime-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: RadarStatus }) {
  return (
    <Chip tone={status === "AVAILABLE" ? "outline" : status === "RESERVED" ? "muted" : "faint"}>
      {STATUS_TEXT[status]}
    </Chip>
  );
}

export function AccessChip({ access }: { access: RadarAccessType }) {
  if (access === "PRIME") return <PrimeBadge size="sm" />;
  return <Chip tone="muted">{ACCESS_TEXT[access]}</Chip>;
}

export function PublishChip({ published }: { published: boolean }) {
  return <Chip tone={published ? "outline" : "faint"}>{published ? "PUBLICADO" : "RASCUNHO"}</Chip>;
}


export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">{children}</h2>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground/40";

export function GhostButton({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick ?? undefined}
      disabled={disabled ?? false}
      className={cn(
        "rounded-md border border-border/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-foreground transition-colors hover:border-foreground/50 hover:bg-muted/40 disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SolidButton({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick ?? undefined}
      disabled={disabled ?? false}
      className={cn(
        "rounded-md bg-foreground px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
