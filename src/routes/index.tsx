import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Brand,
  ForWho,
  Problem,
  Proof,
  Solution,
  TimeSaved,
  Transparency,
} from "@/components/landing/Sections";
import { UltimosGarimpos } from "@/components/landing/Garimpos";
import { Pricing, PrimeEcosystem } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta, Footer, MobileBar, Urgency } from "@/components/landing/Closing";

const title = "Garimpo Auto | Oportunidades de veículos de leilão garimpadas e analisadas";
const description =
  "Você procura carros. Nós procuramos oportunidades. Monitoramos leilões, filtramos lotes e apresentamos o Valor Garimpo de cada oportunidade analisada. Comece pelo Garimpo Aberto ou seja Prime.";

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Nav />
      <main>
        <Hero />
        <Brand />
        <Problem />
        <UltimosGarimpos />
        <Solution />
        <TimeSaved />
        <ForWho />
        <Proof />
        <Transparency />
        <PrimeEcosystem />
        <Pricing />
        <Urgency />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}

