# GARIMPO AUTOS

Build a modern, ultra-luxurious, and high-converting Landing Page for a private car auction advisory and wholesale deal platform ("Mesa de Assessoria em Arrematação e Repasse VIP").

Design Aesthetic & Theme (Inspired by Minimalist Tech-Boutique / Alpha Continuum):

- Overall vibe: High-end financial portal, executive advisory, dark, sleek, precise, and tech-driven. NOT a traditional informal car dealership.

- Color Palette (Obsidian & Gold Tech):

  * Primary Background: Deep Dark Charcoal `#090D16` with a very subtle radial ambient glow behind the Hero section.

  * Card/Module Backgrounds: `#111827` (Dark Slate Gray) with ultra-thin `1px` subtle borders in `#1F2937` or `#374151`.

  * Accent Colors: Muted Champagne Gold (`#D4AF37` / `#C5A059`) for badges and primary active highlights; Emerald Green (`#10B981`) for profitability metrics and call-to-action conversion buttons.

  * Text Colors: Crisp White `#F8FAFC` for primary headers, Slate Gray `#94A3B8` for body text and secondary metrics.

- UI/UX Styling:

  * Glassmorphism effects (`backdrop-blur-md` with translucent backgrounds).

  * Clean, sans-serif typography (Plus Jakarta Sans or Inter Display style) with generous whitespace and clear visual hierarchy.

  * Rounded cards (`rounded-2xl` and `rounded-xl`) with smooth hover transitions.

Key Sections & Components (React + Tailwind CSS):

1. Navigation Bar (Sticky Glassmorphic Header):

   - Logo: Minimalist gold badge icon with text "REPASSE VIP".

   - Links: "Como Funciona", "Mesa de Deals", "Nossa Assessoria".

   - Top-right CTA button: "Área Restrita / Investidores" (Bordered style).

2. Hero Section + Interactive Profile Filter (The Checklist Feature):

   - Main Headline: "Oportunidades de Retomados de Banco com até 50% Abaixo da Tabela FIPE"

   - Subtitle: "Curadoria exclusiva, validação jurídica da documentação, transferência de titularidade e logística completa."

   - Profile Matching Card (The Interactive Checklist):

     * Title: "Filtro Interativo de Perfil de Investimento"

     * Subtitle: "Clique nas opções para filtrar os lotes ideais para o seu objetivo:"

     * Checkbox items (styled with smooth toggle states and glowing borders when selected):

       [ ] "Busco veículos para revenda rápida com margem/lucro estimado acima de R$ 10.000"

       [ ] "Quero comprar para uso próprio economizando até 50% em relação à Tabela FIPE"

       [ ] "Exijo garantia de documentação 100% checada, sem risco de leilão falso ou fraudes"

       [ ] "Preciso de suporte logístico completo (transporte cegonha/guincho e placa Mercosul)"

     * Dynamic CTA Button below the list: When 1 or more options are checked, highlight the button in Emerald Green (`#10B981`) with text: "VER LOTES RECOMENDADOS PARA SEU PERFIL →".

3. Active Deals Grid (Mural de Lotes Ativos na Mesa):

   - Section Title: "Lotes Ativos na Mesa de Repasse"

   - Filter Tabs: [ Todos (12) ] [ Maior Margem (%) ] [ Até R$ 30.000 ] [ Sedãs Premium ]

   - Deal Cards Structure (Grid of 2-3 columns):

     * Car Photo Area: Sleek dark container representing the car, featuring a privacy badge over the license plate area ("🔒 PLACA OCULTA - ASSESSORIA").

     * Scarcity Badge on top of image: "🔴 4 Investidores analisando" or "⚡ Liberado Há 12 min".

     * Car Title & Specs: e.g., "GM CRUZE SEDAN LT 1.8 AUT" (Ano 2013/2014 • Prata • 78.000 km • São Paulo / SP).

     * Financial Metrics Dashboard (Box with clean divider lines):

       - Tabela FIPE Oficial: R$ 54.900

       - Valor de Repasse Titular: R$ 28.500 (Gold highlighted text)

       - Sugestão de Venda Rápida: R$ 44.000

       - Margem Estimada Box: "💰 Lucro / Margem Est.: R$ 15.500 (54%)" (Highlighted in dark green badge).

     * Bullet Checklist:

       ✓ Documentação 100% Baixada e Sem Débitos

       ✓ Laudo Cautelar Aprovado com Vistoria

       ✓ Cotação de Frete Cegonha Integrado para todo Brasil

     * CTA Button: "SOLICITAR RESERVA DO LOTE →" (Linking directly to WhatsApp/Advisory).

4. Trust & Value Proposition (Why Us):

   - 3 Column features explaining: Zero Auction Scams, Full Transfer Management, Integrated Freight Logistics.

Ensure the page is fully responsive, looks sleek on mobile devices, and delivers a premium, high-tech experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://garimpoautos.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9bfe2da3-8284-4fbf-988e-fe13650116aa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
