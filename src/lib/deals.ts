export type Deal = {
  id: string;
  title: string;
  specs: string;
  fipe: number;
  repasse: number;
  vendaRapida: number;
  scarcity: string;
  category: ("margem" | "ate30" | "sedan")[];
};

export const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20quero%20falar%20com%20a%20Mesa%20de%20Assessoria%20Repasse%20VIP";

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const deals: Deal[] = [
  {
    id: "cruze",
    title: "GM CRUZE SEDAN LT 1.8 AUT",
    specs: "2013/2014 • Prata • 78.000 km • São Paulo / SP",
    fipe: 54900,
    repasse: 28500,
    vendaRapida: 44000,
    scarcity: "● 4 investidores analisando",
    category: ["margem", "ate30", "sedan"],
  },
  {
    id: "corolla",
    title: "TOYOTA COROLLA XEI 2.0 FLEX",
    specs: "2016/2017 • Preto • 96.400 km • Campinas / SP",
    fipe: 98700,
    repasse: 61200,
    vendaRapida: 88500,
    scarcity: "⚡ Liberado há 12 min",
    category: ["sedan", "margem"],
  },
  {
    id: "hb20",
    title: "HYUNDAI HB20S COMFORT 1.0",
    specs: "2018/2019 • Branco • 61.200 km • Belo Horizonte / MG",
    fipe: 62400,
    repasse: 29900,
    vendaRapida: 51500,
    scarcity: "● 7 investidores analisando",
    category: ["margem", "ate30", "sedan"],
  },
  {
    id: "compass",
    title: "JEEP COMPASS LONGITUDE 2.0 D",
    specs: "2019/2020 • Cinza • 84.900 km • Curitiba / PR",
    fipe: 142300,
    repasse: 89400,
    vendaRapida: 128000,
    scarcity: "⚡ Liberado há 28 min",
    category: ["margem"],
  },
  {
    id: "onix",
    title: "CHEVROLET ONIX PLUS LTZ 1.0 T",
    specs: "2020/2021 • Vermelho • 52.300 km • Goiânia / GO",
    fipe: 74200,
    repasse: 29800,
    vendaRapida: 63900,
    scarcity: "● 11 investidores analisando",
    category: ["margem", "ate30", "sedan"],
  },
  {
    id: "civic",
    title: "HONDA CIVIC EXL 2.0 CVT",
    specs: "2017/2018 • Prata • 103.700 km • Ribeirão Preto / SP",
    fipe: 109500,
    repasse: 68900,
    vendaRapida: 99000,
    scarcity: "⚡ Liberado há 45 min",
    category: ["sedan", "margem"],
  },
];

export const marginOf = (d: Deal) => d.vendaRapida - d.repasse;
export const marginPct = (d: Deal) => Math.round((marginOf(d) / d.repasse) * 100);
