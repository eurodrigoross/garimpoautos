import { AlertTriangle, Check } from "lucide-react";

/**
 * Bloco reutilizável de PONTOS POSITIVOS / PONTOS DE ATENÇÃO.
 * Usado no card público (resumido) e, futuramente, na ficha Prime (completa).
 */
export function GarimpoPoints({
  positives = [],
  attentionPoints = [],
  maxPositives,
  showAttentionDetails = false,
}: {
  positives?: string[];
  attentionPoints?: string[];
  /** Limite de positivos exibidos. Sem valor = todos. */
  maxPositives?: number;
  /** Falso = apenas indicação compacta de que existem pontos de atenção. */
  showAttentionDetails?: boolean;
}) {
  const pos = maxPositives ? positives.slice(0, maxPositives) : positives;
  const hasAttention = attentionPoints.length > 0;

  if (pos.length === 0 && !hasAttention) return null;

  return (
    <div className="mt-4 space-y-2">
      {pos.length > 0 && (
        <ul className="space-y-1.5">
          {pos.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {hasAttention &&
        (showAttentionDetails ? (
          <ul className="space-y-1.5">
            {attentionPoints.map((p) => (
              <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-foreground/70" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-muted-foreground">
            <AlertTriangle className="size-3.5" />
            {attentionPoints.length} PONTO{attentionPoints.length > 1 ? "S" : ""} DE ATENÇÃO
            MAPEADO{attentionPoints.length > 1 ? "S" : ""}
          </p>
        ))}
    </div>
  );
}
