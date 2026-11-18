import { describe, expect, it } from "vitest";
import { ORDER_BUMPS, totalCentavos, cpfValido } from "./checkout-config";

describe("checkout", () => {
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
