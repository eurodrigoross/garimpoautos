import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { DealsGrid } from "@/components/landing/DealsGrid";
import { Trust } from "@/components/landing/Trust";
import { WHATSAPP_URL } from "@/lib/deals";

const title = "Repasse VIP | Mesa de Arrematação e Repasse de Retomados";
const description =
  "Mesa privada de assessoria em arrematação e repasse: retomados de banco até 50% abaixo da FIPE, documentação validada, transferência e frete cegonha inclusos.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <DealsGrid />
        <Trust />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Repasse VIP — Mesa de Assessoria em Arrematação e Repasse.</p>
          <a href={WHATSAPP_URL} className="text-gold hover:underline">
            Falar com um assessor
          </a>
        </div>
      </footer>
    </div>
  );
}
