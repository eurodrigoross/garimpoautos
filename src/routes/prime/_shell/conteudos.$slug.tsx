import { createFileRoute, Link } from "@tanstack/react-router";

import { usePrimeContent } from "@/lib/prime.data";
import { formatDate } from "@/lib/garimpo-finance";

export const Route = createFileRoute("/prime/_shell/conteudos/$slug")({
  head: () => ({ meta: [{ title: "Conteúdo — Área Prime" }, { name: "robots", content: "noindex" }] }),
  component: Conteudo,
});

function Conteudo() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = usePrimeContent(slug);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl border border-border/40 bg-muted/20" />;
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-border/40 p-6">
        <p className="text-sm text-muted-foreground">
          {(error as Error | null)?.message ?? "Conteúdo não encontrado."}
        </p>
        <Link to="/prime/conteudos" className="mt-4 inline-block text-[11px] tracking-[0.18em] hover:underline">
          VOLTAR PARA OS CONTEÚDOS
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl space-y-6">
      <Link to="/prime/conteudos" className="text-[10px] tracking-[0.22em] text-muted-foreground hover:text-foreground">
        ← CONTEÚDOS
      </Link>
      <header>
        <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{data.category}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-[11px] text-muted-foreground">{formatDate(data.created_at)}</p>
      </header>
      <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
        {data.content}
      </div>
    </article>
  );
}
