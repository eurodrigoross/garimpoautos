import mark from "@/assets/garimpo-mark.png.asset.json";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={mark.url}
      alt="Garimpo Auto"
      className={cn("size-8 object-contain", className)}
      loading="eager"
      decoding="async"
    />
  );
}

export function BrandLockup({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark className={markClassName ?? ""} />
      <span
        className={cn(
          "text-[13px] font-extrabold tracking-[0.28em] text-foreground",
          textClassName,
        )}
      >
        GARIMPO <span className="text-muted-foreground">AUTO</span>
      </span>
    </span>
  );
}
