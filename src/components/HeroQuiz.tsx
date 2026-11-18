import { useEffect, useState } from "react";

type Q = { pergunta: string; dica: string; opcoes: string[] };

const PERGUNTAS: Q[] = [
  { pergunta: "Onde a dor mais te incomoda hoje?", dica: "Escolha a região principal", opcoes: ["Costas e lombar", "Pescoço e ombros", "Pernas e quadril", "Cabeça e mandíbula", "Braços e punhos", "Em vários lugares"] },
  { pergunta: "Com que frequência essa dor aparece?", dica: "Seja sincera, ninguém está julgando", opcoes: ["Todos os dias", "Algumas vezes por semana", "Quando faço esforço", "Raramente, mas forte"] },
  { pergunta: "De 1 a 10, qual a intensidade da dor nos piores dias?", dica: "Toque no número", opcoes: ["1-3", "4-6", "7-8", "9-10"] },
  { pergunta: "O que você costuma fazer quando a dor aparece?", dica: "Escolha o que mais se parece com você", opcoes: ["Tomo remédio", "Deito e espero passar", "Faço compressa ou alongamento", "Não faço nada, convivo com ela"] },
  { pergunta: "Há quanto tempo você convive com essa dor?", dica: "Última pergunta!", opcoes: ["Menos de 1 mês", "De 1 a 6 meses", "De 6 meses a 2 anos", "Mais de 2 anos"] },
];

export function HeroQuiz() {
  const [etapa, setEtapa] = useState(-1); // -1 intro, 0..n perguntas, n analisando, n+1 resultado
  const [resp, setResp] = useState<string[]>([]);
  const [analise, setAnalise] = useState(0);
  const total = PERGUNTAS.length;
  const atual = PERGUNTAS[Math.max(0, Math.min(etapa, total - 1))]!;

  useEffect(() => {
    if (etapa !== total) return;
    setAnalise(0);
    const t = setInterval(() => setAnalise((v) => (v >= 100 ? 100 : v + 4)), 70);
    const f = setTimeout(() => setEtapa(total + 1), 1900);
    return () => { clearInterval(t); clearTimeout(f); };
  }, [etapa, total]);

  const responder = (o: string) => {
    setResp((r) => [...r.slice(0, etapa), o]);
    setEtapa((e) => e + 1);
  };

  const irOferta = () => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" });
  const pontos = resp.length * 20;
  const regiao = resp[0] ?? "Em vários lugares";

  return (
    <div className="qz" aria-live="polite">
      {etapa >= 0 && etapa < total && (
        <div className="qz__topo">
          <span className="qz__passo">Pergunta {etapa + 1} de {total}</span>
          <span className="qz__pontos">⭐ {pontos} pts</span>
        </div>
      )}
      {etapa >= 0 && etapa <= total && (
        <div className="qz__barra"><span style={{ width: `${(Math.min(etapa, total) / total) * 100}%` }} /></div>
      )}

      {etapa === -1 && (
        <div className="qz__intro">
          <p className="qz__selo">Diagnóstico gratuito · 1 minuto</p>
          <h2 className="qz__pergunta">Descubra o que está por trás da sua dor</h2>
          <p className="qz__dica">Responda 5 perguntas rápidas e receba o seu diagnóstico personalizado.</p>
          <button className="v4-btn qz__btn" type="button" onClick={() => setEtapa(0)}>
            <span>Começar meu diagnóstico</span>
            <svg width="20" height="20" aria-hidden="true"><use href="#i-seta" /></svg>
          </button>
        </div>
      )}

      {etapa >= 0 && etapa < total && (
        <div className="qz__card" key={etapa}>
          <h2 className="qz__pergunta">{atual.pergunta}</h2>
          <p className="qz__dica">{atual.dica}</p>
          <div className={`qz__opcoes${etapa === 2 ? " qz__opcoes--escala" : ""}`}>
            {atual.opcoes.map((o) => (
              <button key={o} type="button" className="qz__opcao" onClick={() => responder(o)}>{o}</button>
            ))}
          </div>
          {etapa > 0 && (
            <button type="button" className="qz__voltar" onClick={() => setEtapa(etapa - 1)}>← Voltar</button>
          )}
        </div>
      )}

      {etapa === total && (
        <div className="qz__card">
          <h2 className="qz__pergunta">Analisando suas respostas…</h2>
          <p className="qz__dica">Cruzando com as 165 massagens do Manual</p>
          <div className="qz__barra qz__barra--analise"><span style={{ width: `${analise}%` }} /></div>
          <p className="qz__pct">{analise}%</p>
        </div>
      )}

      {etapa === total + 1 && (
        <div className="qz__card qz__resultado">
          <p className="qz__selo">🏆 Diagnóstico concluído · 100 pts</p>
          <h2 className="qz__pergunta">Seu diagnóstico: {regiao}</h2>
          <div className="qz__borrado">
            <div className="qz__borrado-texto" aria-hidden="true">
              <p>Nível de sobrecarga muscular: elevado. A tensão acumulada na região indica um padrão de contratura que se repete e tende a piorar sem o toque correto.</p>
              <p>Pontos que precisam de atenção: 3 regiões principais e 2 secundárias, com manobras específicas de alívio em até 15 minutos.</p>
              <p>Pressão recomendada: escala 4 a 6. Sequência ideal: Anestesiar, Drenar, Esquentar, Investigar e Relaxar.</p>
            </div>
            <div className="qz__cadeado">
              <span aria-hidden="true">🔒</span>
              <strong>Seu diagnóstico completo está pronto</strong>
              <small>Libere junto com o Manual e as massagens certas para a sua dor</small>
            </div>
          </div>
          <button className="v4-btn qz__btn" type="button" onClick={irOferta}>
            <span>Desbloquear meu diagnóstico</span>
            <svg width="20" height="20" aria-hidden="true"><use href="#i-seta" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
