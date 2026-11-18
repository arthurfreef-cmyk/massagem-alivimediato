import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { answerQuiz, getQuizProfile, getQuizQuestion, QUIZ_TOTAL } from "@/lib/quiz-personalization";

export function HeroQuiz() {
  const [etapa, setEtapa] = useState(-1); // -1 intro, 0..n perguntas, n analisando, n+1 resultado
  const [resp, setResp] = useState<string[]>([]);
  const [analise, setAnalise] = useState(0);
  const total = QUIZ_TOTAL;
  const atual = getQuizQuestion(etapa, resp);
  const perfil = getQuizProfile(resp);

  useEffect(() => {
    if (etapa !== total) return;
    setAnalise(0);
    const t = setInterval(() => setAnalise((v) => (v >= 100 ? 100 : v + 4)), 70);
    const f = setTimeout(() => setEtapa(total + 1), 1900);
    return () => { clearInterval(t); clearTimeout(f); };
  }, [etapa, total]);

  const responder = (o: string) => {
    setResp((r) => answerQuiz(r, etapa, o));
    setEtapa((e) => e + 1);
  };

  const irOferta = () => document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" });
  const pontos = Math.min(Math.max(etapa, 0), total) * 20;
  const voltar = () => {
    setResp((r) => r.slice(0, etapa - 1));
    setEtapa((e) => e - 1);
  };

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
          <p className="qz__selo">Diagnóstico inicial · 1 minuto</p>
          <h2 className="qz__pergunta">Descubra o que seu desconforto revela sobre você</h2>
          <p className="qz__dica">Responda a 5 perguntas rápidas e receba uma avaliação personalizada das regiões que mais incomodam, da intensidade e da frequência dos sintomas — com orientações para encontrar as massagens mais adequadas ao seu perfil.</p>
          <Button variant="ghost" className="v4-btn qz__btn h-auto whitespace-normal" type="button" onClick={() => setEtapa(0)}>
            <span>Iniciar meu diagnóstico</span>
            <svg width="20" height="20" aria-hidden="true"><use href="#i-seta" /></svg>
          </Button>
        </div>
      )}

      {etapa >= 0 && etapa < total && (
        <div className="qz__card" key={etapa}>
          <h2 className="qz__pergunta">{atual.pergunta}</h2>
          <p className="qz__dica">{atual.dica}</p>
          <div className={`qz__opcoes${atual.escala ? " qz__opcoes--escala" : ""}`}>
            {atual.opcoes.map((o) => (
              <Button variant="ghost" key={o} type="button" className="qz__opcao h-auto whitespace-normal" onClick={() => responder(o)}>{o}</Button>
            ))}
          </div>
          {etapa > 0 && (
            <Button variant="ghost" type="button" className="qz__voltar h-auto" onClick={voltar}>← Voltar</Button>
          )}
        </div>
      )}

      {etapa === total && (
        <div className="qz__card">
          <h2 className="qz__pergunta">Concluindo seu diagnóstico inicial…</h2>
          <p className="qz__dica">Organizando seu perfil para {perfil.regiao.toLowerCase()}</p>
          <div className="qz__barra qz__barra--analise"><span style={{ width: `${analise}%` }} /></div>
          <p className="qz__pct">{analise}%</p>
        </div>
      )}

      {etapa === total + 1 && (
        <div className="qz__card qz__resultado">
          <p className="qz__selo">🏆 Diagnóstico inicial concluído · 100 pts</p>
          <h2 className="qz__pergunta">Seu diagnóstico: {perfil.regiao}</h2>
          <p className="qz__dica">{perfil.resumo}<br />Seu objetivo: {perfil.objetivo.toLowerCase()}.</p>
          <p className="qz__dica">Esta análise organiza as informações que você forneceu e não identifica doenças nem substitui um diagnóstico médico.</p>
          <div className="qz__borrado">
            <div className="qz__borrado-texto" aria-hidden="true">
              {perfil.detalhes.map((texto) => <p key={texto}>{texto}</p>)}
            </div>
            <div className="qz__cadeado">
              <span aria-hidden="true">🔒</span>
              <strong>Seu foco: {perfil.regiao.toLowerCase()}</strong>
              <small>Conheça as 165 massagens ilustradas, inclusive técnicas para aplicar em você mesma(o), respeitando seus limites.</small>
            </div>
          </div>
          <p className="qz__dica">{perfil.aviso}</p>
          <Button variant="ghost" className="v4-btn qz__btn h-auto whitespace-normal" type="button" onClick={irOferta}>
            <span>QUERO ALIVIAR MINHAS DORES AGORA</span>
            <svg width="20" height="20" aria-hidden="true"><use href="#i-seta" /></svg>
          </Button>
        </div>
      )}
    </div>
  );
}
