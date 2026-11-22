import { describe, expect, it } from "vitest";
import { ORDER_BUMPS, PRODUTO_PRINCIPAL, itensFruitfy, totalCentavos, cpfValido } from "./checkout-config";

describe("checkout", () => {
  it("usa exclusivamente o ID fornecido em todos os produtos", () => {
    expect([PRODUTO_PRINCIPAL, ...ORDER_BUMPS].map((item) => item.fruitfyId)).toEqual(
      Array(4).fill("a3487131-0343-419b-8608-120b4912fca1"),
    );
  });
  it("consolida o produto e os adicionais em uma única linha de R$65,80", () => {
    expect(itensFruitfy(["costas", "cabeca", "combo"])).toEqual([
      { id: "a3487131-0343-419b-8608-120b4912fca1", value: 6580, quantity: 1 },
    ]);
  });
  it("mantém R$27 sem adicionais e R$32,90 com um adicional", () => {
    expect(itensFruitfy([])[0]?.value).toBe(2700);
    expect(itensFruitfy(["costas"])[0]?.value).toBe(3290);
  });
  it("tem 2 bumps de R$5,90 e o combo de R$27", () => {
    expect(ORDER_BUMPS).toHaveLength(3);
    expect(ORDER_BUMPS.filter((b) => b.preco === 590)).toHaveLength(2);
    const combo = ORDER_BUMPS.find((b) => b.key === "combo");
    expect(combo?.preco).toBe(2700);
    expect(combo?.de).toBe(29700);
    expect(combo?.desconto).toBe(91);
  });
  it("produto sozinho custa R$27", () => expect(totalCentavos([])).toBe(2700));
  it("com os 3 bumps custa R$65,80", () => expect(totalCentavos(ORDER_BUMPS.map((b) => b.key))).toBe(6580));
  it("valida CPF", () => {
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(cpfValido("111.111.111-11")).toBe(false);
  });
});
