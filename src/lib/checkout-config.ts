// Preços em centavos. IDs são os UUIDs dos produtos no painel da Fruitfy.
export type CheckoutItem = { key: string; fruitfyId: string; nome: string; descricao: string; imagem: string; preco: number };

export const PRODUTO_PRINCIPAL: CheckoutItem = {
  key: "manual",
  fruitfyId: "",
  nome: "Manual com 165 Massagens Ilustradas + 5 Bônus",
  descricao: "Massagens para costas, pescoço, pernas e todo o corpo, com acesso imediato.",
  imagem: "/lp/assets/img/mockup-oferta.webp",
  preco: 2700,
};

export const ORDER_BUMPS: CheckoutItem[] = [
  { key: "sono", fruitfyId: "", nome: "Automassagem para Dormir em 10 Minutos", descricao: "Sequência ilustrada para soltar o corpo antes de deitar e acordar sem rigidez.", imagem: "/lp/assets/img/maos-costas.webp", preco: 590 },
  { key: "cabeca", fruitfyId: "", nome: "Protocolo Alívio da Dor de Cabeça", descricao: "Pontos da cabeça, nuca e rosto para aliviar a tensão e a enxaqueca em minutos.", imagem: "/lp/assets/img/ana-maos.webp", preco: 590 },
  { key: "pes", fruitfyId: "", nome: "Massagem para Pés e Pernas Cansadas", descricao: "Técnicas para inchaço, peso nas pernas e pés doloridos no fim do dia.", imagem: "/lp/assets/img/bonus-3-reflexologia.webp", preco: 590 },
];

export function itensDoPedido(bumpsSelecionados: string[]): CheckoutItem[] {
  return [PRODUTO_PRINCIPAL, ...ORDER_BUMPS.filter((b) => bumpsSelecionados.includes(b.key))];
}

export function totalCentavos(bumpsSelecionados: string[]): number {
  return itensDoPedido(bumpsSelecionados).reduce((s, i) => s + i.preco, 0);
}

export function formatarReais(centavos: number): string {
  return "R$ " + (centavos / 100).toFixed(2).replace(".", ",");
}

export function cpfValido(cpf: string): boolean {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  for (const t of [9, 10]) {
    let s = 0;
    for (let i = 0; i < t; i++) s += Number(d[i]) * (t + 1 - i);
    if (((s * 10) % 11) % 10 !== Number(d[t])) return false;
  }
  return true;
}
