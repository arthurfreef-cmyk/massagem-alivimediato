import { describe, expect, it } from "vitest";
import { answerQuiz, getQuizProfile, getQuizQuestion, REGIOES } from "./quiz-personalization";

describe("Personalized quiz", () => {
  it("offers distinct context choices for all six body regions", () => {
    const paths = REGIOES.map((region) => getQuizQuestion(1, [region]).opcoes);
    expect(new Set(paths.map((path) => JSON.stringify(path))).size).toBe(6);
    expect(paths.every((path) => path.length === 4)).toBe(true);
  });
  it("uses the context in the following question", () => {
    expect(getQuizQuestion(2, ["Costas e lombar", "Ao levantar peso"]).pergunta).not.toEqual(getQuizQuestion(2, ["Costas e lombar", "Ao acordar"]).pergunta);
  });
  it("adapts the intensity prompt to frequency", () => {
    expect(getQuizQuestion(3, ["Costas e lombar", "Ao acordar", "Todos os dias"]).dica).not.toEqual(getQuizQuestion(3, ["Costas e lombar", "Ao acordar", "Só de vez em quando"]).dica);
  });
  it("offers different goals for high intensity", () => {
    expect(getQuizQuestion(4, ["Costas e lombar", "Ao acordar", "Todos os dias", "9-10"]).opcoes).not.toEqual(getQuizQuestion(4, ["Costas e lombar", "Ao acordar", "Todos os dias", "1-3"]).opcoes);
  });
  it("changes the profile for each of the five answers", () => {
    const answers = ["Costas e lombar", "Ao acordar", "Algumas vezes por mês", "1-3", "Aprender automassagem"];
    const replacements = ["Pescoço e ombros", "Em momentos de estresse", "Todos os dias", "9-10", "Cuidar de alguém além de mim"];
    const original = getQuizProfile(answers);
    replacements.forEach((value, step) => {
      const changed = [...answers];
      changed[step] = value;
      expect(getQuizProfile(changed)).not.toEqual(original);
    });
  });
  it("discards later answers when an earlier choice changes", () => {
    expect(answerQuiz(["Costas e lombar", "Ao acordar", "Todos os dias", "9-10"], 0, "Pernas e quadril")).toEqual(["Pernas e quadril"]);
  });
  it("prioritizes professional assessment for intense or daily pain", () => {
    expect(getQuizProfile(["Costas e lombar", "Ao acordar", "Só de vez em quando", "7-8"]).cuidado).toBe(true);
    expect(getQuizProfile(["Costas e lombar", "Ao acordar", "Todos os dias", "1-3"]).cuidado).toBe(true);
    expect(getQuizProfile(["Costas e lombar", "Ao acordar", "Só de vez em quando", "1-3"]).cuidado).toBe(false);
  });
});