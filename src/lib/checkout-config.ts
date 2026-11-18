import ofertaAsset from "@/assets/oferta-165-massagens.webp.asset.json";
import comboAsset from "@/assets/combo-seguranca-dinheiro.webp.asset.json";

// ============ Configuração do checkout (valores em centavos) ============
// Preencha fruitfyId com o ID (UUID) de cada produto cadastrado na Fruitfy.
// Enquanto estiver vazio, o checkout avisa que falta produto na Fruitfy.

export type CheckoutItem = {
  key: string;
  fruitfyId: string;
  nome: string;
  descricao: string;
  imagem: string;
  preco: number; // centavos
  selo?: string;
  de?: number; // preço "de" em centavos (para risco no card)
  desconto?: number; // percentual de desconto exibido no selo
};

export const PRODUTO_PRINCIPAL: CheckoutItem = {
  key: "manual",
  fruitfyId: "a34174f1-35c1-49cf-8e71-82cbf6a49d3a",
  nome: "Manual com 165 Massagens Ilustradas",
  descricao: "Guia digital em PDF com técnicas ilustradas para costas, pescoço, pernas e todo o corpo.",
  imagem: "/lp/assets/img/mockup-oferta.webp",
  preco: 2700,
};

export const ORDER_BUMPS: CheckoutItem[] = [
  {
    key: "costas",
    fruitfyId: "a34174f1-35c1-49cf-8e71-82cbf6a49d3a",
    nome: "Automassagem para Dormir em 10 Minutos",
    descricao: "Rotina rápida de automassagem para soltar costas e pescoço e cair no sono mais rápido.",
    imagem: "/lp/assets/img/maos-costas.webp",
    preco: 590,
    selo: "Oferta única",
  },
  {
    key: "cabeca",
    fruitfyId: "a34174f1-35c1-49cf-8e71-82cbf6a49d3a",
    nome: "Protocolo Alívio da Dor de Cabeça",
    descricao: "Massagens no pescoço, têmporas e nuca para reduzir a dor de cabeça tensional.",
    imagem: "/lp/assets/img/ana-maos.webp",
    preco: 590,
    selo: "Oferta única",
  },
  {
    key: "combo",
    fruitfyId: "a34174f1-35c1-49cf-8e71-82cbf6a49d3a",
    nome: "Super Mega Combo — Checklist de Segurança + Mini-curso Introdutório de Massagem para Dor + Do Zero ao Primeiro Dinheiro com Massagem",
    descricao:
      "Leve os 3 acima no COMBO com um desconto imperdível! Compre junto e receba agora mesmo os 3 produtos juntos com o Manual Ilustrado.",
    imagem: comboAsset.url,
    preco: 2700,
    de: 29700,
    desconto: 91,
    selo: "Combo com 91% OFF",
  },
];

export const BANNER_CHECKOUT = {
  imagem: ofertaAsset.url,
  alt: "Massagem Alivimediato — Manual com mais de 165 manobras ilustradas para aliviar a dor com massagem",
};

export function itensDoPedido(bumps: string[]): CheckoutItem[] {
  return [PRODUTO_PRINCIPAL, ...ORDER_BUMPS.filter((b) => bumps.includes(b.key))];
}

export function totalCentavos(bumps: string[]): number {
  return itensDoPedido(bumps).reduce((s, i) => s + i.preco, 0);
}

export function formatarReais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function cpfValido(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(d[i]) * (10 - i);
  let d1 = (11 - (soma % 11)) % 11;
  if (d1 !== Number(d[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(d[i]) * (11 - i);
  const d2 = (11 - (soma % 11)) % 11;
  return d2 === Number(d[10]);
}
