export type QuizQuestion = { pergunta: string; dica: string; opcoes: string[]; escala?: boolean };

export const QUIZ_TOTAL = 5;
export const REGIOES = ["Costas e lombar", "Pescoço e ombros", "Pernas e quadril", "Cabeça e mandíbula", "Braços e punhos", "Em vários lugares"];

const CONTEXTOS: Record<string, string[]> = {
  "Costas e lombar": ["Depois de ficar sentada(o)", "Ao levantar peso", "Ao acordar", "Sem um motivo claro"],
  "Pescoço e ombros": ["Depois de usar celular ou computador", "Em momentos de estresse", "Ao acordar", "Sem um motivo claro"],
  "Pernas e quadril": ["Depois de ficar em pé", "Depois de caminhar ou treinar", "Após ficar sentada(o)", "Sem um motivo claro"],
  "Cabeça e mandíbula": ["Em momentos de estresse", "Ao mastigar ou apertar os dentes", "Depois de usar telas", "Sem um motivo claro"],
  "Braços e punhos": ["Depois de digitar ou usar o celular", "Depois de movimentos repetitivos", "Ao carregar objetos", "Sem um motivo claro"],
  "Em vários lugares": ["Depois de um dia corrido", "Em momentos de estresse", "Depois de esforço físico", "Sem um motivo claro"],
};

export function getQuizQuestion(step: number, answers: string[]): QuizQuestion {
  const regiao = answers[0] ?? "Em vários lugares";
  const contexto = answers[1] ?? "";
  const frequencia = answers[2] ?? "";
  const intensidade = answers[3] ?? "";
  switch (step) {
    case 0:
      return { pergunta: "Onde a dor mais te incomoda hoje?", dica: "Escolha a região principal", opcoes: REGIOES };
    case 1:
      return { pergunta: `Quando o incômodo em ${regiao.toLowerCase()} costuma aparecer?`, dica: `Vamos entender melhor o seu dia a dia com ${regiao.toLowerCase()}.`, opcoes: CONTEXTOS[regiao] ?? CONTEXTOS["Em vários lugares"] ?? [] };
    case 2:
      return { pergunta: contexto === "Sem um motivo claro" ? `Mesmo sem um motivo claro, com que frequência o incômodo em ${regiao.toLowerCase()} aparece?` : `Quando isso acontece — ${contexto.toLowerCase()} — com que frequência você sente o incômodo?`, dica: "Considere o que acontece na sua rotina", opcoes: ["Todos os dias", "Algumas vezes por semana", "Algumas vezes por mês", "Só de vez em quando"] };
    case 3:
      return { pergunta: `Nos dias em que aparece, qual a intensidade do incômodo em ${regiao.toLowerCase()}?`, dica: frequencia === "Todos os dias" ? "Você relatou incômodo diário. Considere os dias mais difíceis." : `Você respondeu: ${frequencia.toLowerCase()}. Considere os dias mais difíceis.`, opcoes: ["1-3", "4-6", "7-8", "9-10"], escala: true };
    default:
      return { pergunta: intensidade === "7-8" || intensidade === "9-10" ? "Com esse incômodo mais intenso, o que você mais gostaria de recuperar?" : `O que você mais gostaria de melhorar na rotina com ${regiao.toLowerCase()}?`, dica: `Pensando no que você contou: ${contexto.toLowerCase()}.`, opcoes: intensidade === "7-8" || intensidade === "9-10" ? ["Dormir com mais conforto", "Fazer minhas atividades com mais conforto", "Cuidar de mim sem depender de outra pessoa", "Retomar meus momentos de descanso"] : ["Relaxar depois desses momentos", "Ter mais conforto ao me movimentar", "Aprender automassagem", "Cuidar de alguém além de mim"] };
  }
}

export function getQuizProfile(answers: string[]) {
  const [regiao = "Em vários lugares", contexto = "Sem um motivo claro", frequencia = "Só de vez em quando", intensidade = "1-3", objetivo = "Aprender automassagem"] = answers;
  const cuidado = intensidade === "7-8" || intensidade === "9-10" || frequencia === "Todos os dias";
  return {
    regiao,
    contexto,
    frequencia,
    intensidade,
    objetivo,
    resumo: `Seu foco: ${regiao.toLowerCase()}. Você relatou incômodo ${frequencia.toLowerCase()}, com intensidade ${intensidade}/10.`,
    detalhes: [
      `Na sua rotina, o incômodo aparece: ${contexto.toLowerCase()}. Seu objetivo é: ${objetivo.toLowerCase()}.`,
      `Seu roteiro de leitura prioriza as ilustrações para ${regiao.toLowerCase()}, incluindo opções de automassagem conforme a região e os seus limites.`,
      `Para o objetivo “${objetivo.toLowerCase()}”, consulte as orientações ilustradas e respeite seu conforto. Não force movimentos nem pressione áreas doloridas.`,
    ],
    cuidado,
    aviso: cuidado ? "Você relatou dor intensa ou frequente: procure avaliação profissional antes de experimentar massagens. Este quiz não identifica a causa da dor." : "Este perfil reúne suas respostas, não é um diagnóstico médico. Se a dor persistir, piorar ou vier com outros sintomas, procure avaliação profissional.",
  };
}

// Later answers belong to the old path and must not survive a changed response.
export function answerQuiz(answers: string[], step: number, answer: string): string[] {
  return [...answers.slice(0, step), answer];
}