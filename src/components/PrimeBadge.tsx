import { cn } from "@/lib/utils";

/**
 * Selo oficial GARIMPO PRIME.
 * Azul sólido (--prime) + texto branco. Único componente permitido para o selo PRIME.
 * Não usar para a palavra "Prime" dentro de frases corridas.
 */
export function PrimeBadge({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-prime font-extrabold uppercase leading-none text-prime-foreground",
        size === "sm" && "px-1.5 py-[3px] text-[8px] tracking-[0.16em]",
        size === "md" && "px-2 py-1 text-[9px] tracking-[0.16em]",
        size === "lg" && "px-2.5 py-1.5 text-[11px] tracking-[0.18em]",
        className,
      )}
    >
      PRIME
    </span>
  );
}
