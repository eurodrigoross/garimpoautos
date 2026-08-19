import { createFileRoute, Link } from "@tanstack/react-router";

import { usePrimeContents } from "@/lib/prime.data";
import { formatDate } from "@/lib/garimpo-finance";

export const Route = createFileRoute("/prime/_shell/conteudos/")({
  head: () => ({ meta: [{ title: "Conteúdos — Área Prime" }, { name: "robots", content: "noindex" }] }),
  component: Conteudos,
});

function Conteudos() {
  const { data, isLoading } = usePrimeContents();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Conteúdos da mesa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tutoriais, checklists e leituras rápidas para você arrematar com segurança.
        </p>
      </header>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
      ) : (data ?? []).length === 0 ? (
        <p className="rounded-xl border border-border/40 p-6 text-sm text-muted-foreground">
          Ainda não há conteúdos publicados. Estamos preparando os primeiros materiais.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {(data ?? []).map((c) => (
            <Link
              key={c.id}
              to="/prime/conteudos/$slug"
              params={{ slug: c.slug }}
              className="rounded-xl border border-border/50 p-5 transition-colors hover:border-foreground/30"
            >
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground">{c.category}</p>
              <h2 className="mt-2 text-sm font-medium">{c.title}</h2>
              {c.excerpt ? (
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{c.excerpt}</p>
              ) : null}
              <p className="mt-4 text-[10px] tracking-[0.18em] text-muted-foreground">
                {formatDate(c.created_at)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
