import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Brand,
  ForWho,
  Problem,
  ProductMockup,
  Proof,
  Solution,
  TimeSaved,
} from "@/components/landing/Sections";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta, Footer, MobileBar, Urgency } from "@/components/landing/Closing";

const title = "Garimpo Auto | Oportunidades de leilão garimpadas por especialistas";
const description =
  "Você procura carros. Nós procuramos oportunidades. Monitoramos leilões, filtramos lotes e entregamos oportunidades analisadas. Comece gratuitamente ou seja Prime por R$50/mês.";

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
        <Solution />
        <ProductMockup />
        <TimeSaved />
        <ForWho />
        <Proof />
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
