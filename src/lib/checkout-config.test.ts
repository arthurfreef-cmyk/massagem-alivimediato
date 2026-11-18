import { describe, expect, it } from "vitest";
import { ORDER_BUMPS, totalCentavos, cpfValido } from "./checkout-config";

describe("checkout", () => {
  it("tem 3 order bumps de R$5,90", () => {
    expect(ORDER_BUMPS).toHaveLength(3);
    ORDER_BUMPS.forEach((b) => expect(b.preco).toBe(590));
  });
  it("produto sozinho custa R$27", () => expect(totalCentavos([])).toBe(2700));
  it("com os 3 bumps custa R$44,70", () => expect(totalCentavos(ORDER_BUMPS.map((b) => b.key))).toBe(4470));
  it("valida CPF", () => {
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(cpfValido("111.111.111-11")).toBe(false);
  });
});
