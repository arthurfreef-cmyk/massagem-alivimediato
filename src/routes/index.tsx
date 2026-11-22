import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import spriteHtml from "@/lp/sprite.html?raw";
import mainHtml from "@/lp/main.html?raw";
import footerHtml from "@/lp/footer.html?raw";
import { HeroQuiz } from "@/components/HeroQuiz";

const title = "Massagem Alivimediato — 165 Massagens Ilustradas para Alívio da Dor";
const description =
  "Faça o diagnóstico gratuito e descubra como aliviar dores nas costas, pescoço, pernas e todo o corpo com mais de 165 massagens ilustradas. Por Ana Martha, fisioterapeuta.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: "#FAF8F2" },
      { property: "og:title", content: "Antes do próximo remédio, experimente usar as mãos" },
      { property: "og:description", content: "Mais de 165 massagens ilustradas para todo o corpo e 5 bônus por R$27." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://pcm.topcorpus.com.br", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/lp/assets/fonts/fraunces-latin.woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "/lp/assets/css/v4.css" },
      { rel: "stylesheet", href: "/lp/assets/css/quiz.css" },
    ],
    scripts: [
      { children: "window.dataLayer = window.dataLayer || [];" },
      { src: "/lp/assets/js/env-config.js", defer: true },
      { src: "/lp/assets/js/gtm-loader.js", defer: true },
    ],
  }),
  component: Index,
});

function Index() {
  const [dataAtual, setDataAtual] = useState(() => new Date().toLocaleDateString("pt-BR"));

  useEffect(() => {
    if (document.querySelector("script[data-lp-manual]")) return;
    const s = document.createElement("script");
    s.src = "/lp/assets/js/manual.js";
    s.setAttribute("data-lp-manual", "1");
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    const atualizarData = () => setDataAtual(new Date().toLocaleDateString("pt-BR"));
    const intervalo = window.setInterval(atualizarData, 30_000);
    window.addEventListener("focus", atualizarData);
    document.addEventListener("visibilitychange", atualizarData);
    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener("focus", atualizarData);
      document.removeEventListener("visibilitychange", atualizarData);
    };
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: spriteHtml }} />
      <main>
        <div className="oferta-dia" role="status" aria-live="polite">
          <span className="oferta-dia__icone" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
              <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 3v3M13.5 3v3M3.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="m7.5 12 1.6 1.6 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="oferta-dia__mensagem">Condição especial disponível hoje</span>
          <span className="oferta-dia__data-label">Válida em</span>
          <time className="oferta-dia__data">{dataAtual}</time>
        </div>
        <section className="v4-hero" aria-labelledby="hero-title">
          <div className="v4-wrap v4-hero__grade">
            <div className="v4-hero__copy">
              <h1 className="v4-hero__titulo" id="hero-title">
                Antes do próximo remédio, <em>experimente usar as mãos</em>
              </h1>
              <p className="v4-hero__sub">
                <strong className="v4-hero__promessa">
                  <span>Alivie a dor que te atormenta imediatamente com mais de 165 Massagens Ilustradas</span>
                </strong>
                <span className="v4-hero__resto">
                  para costas, pescoço, pernas e todas as partes do corpo, mostrando onde tocar, como tocar e qual pressão usar
                </span>
              </p>
            </div>
            <HeroQuiz />
            <div className="v4-hero__acao">
              <ul className="v4-oks">
                <li><span className="v4-ok" aria-hidden="true"><svg width="14" height="14"><use href="#i-check" /></svg></span>Mesmo que você nunca tenha feito massagem</li>
                <li><span className="v4-ok" aria-hidden="true"><svg width="14" height="14"><use href="#i-check" /></svg></span>Criado por uma fisioterapeuta com 20 anos de prática</li>
              </ul>
            </div>
          </div>
        </section>
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: mainHtml }} />
      </main>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </>
  );
}
