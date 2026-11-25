export function HeroOfferCard() {
  return (
    <div className="hero-oferta" aria-label="Apresentação do Manual de Massagens Ilustradas">
      <div className="hero-oferta__imagem">
        <img
          src="/lp/assets/img/mockup-oferta.webp"
          alt="Manual de Massagens Ilustradas acompanhado de cinco materiais bônus."
          width="1100"
          height="661"
          fetchPriority="high"
        />
      </div>
      <div className="hero-oferta__conteudo">
        <p className="hero-oferta__selo">Manual digital + 5 bônus</p>
        <h2>Aprenda a consultar <em>mais de 165 massagens ilustradas</em></h2>
        <p className="hero-oferta__descricao">
          Um guia visual com técnicas para diferentes regiões do corpo, orientações de pressão, tempo e cuidados — para consultar no celular ou imprimir.
        </p>
        <ul className="hero-oferta__lista">
          <li><span aria-hidden="true">✓</span> Mais de 165 manobras ilustradas</li>
          <li><span aria-hidden="true">✓</span> Videoaulas e mapas ilustrados</li>
          <li><span aria-hidden="true">✓</span> Guia de drenagem linfática e mapa de fibromialgia</li>
          <li><span aria-hidden="true">✓</span> Acesso digital por e-mail</li>
        </ul>
        <div className="hero-oferta__preco">
          <span>De <del>R$ 297</del> por</span>
          <strong>R$ 27</strong>
        </div>
        <a className="v4-btn hero-oferta__cta" href="#oferta">
          <span>VER O QUE ESTÁ INCLUÍDO</span>
          <svg width="20" height="20" aria-hidden="true"><use href="#i-seta" /></svg>
        </a>
        <a className="hero-oferta__subcta" href="#dores-title">Continuar sabendo mais <span aria-hidden="true">→</span></a>
        <p className="hero-oferta__nota">Pagamento via Pix • Acesso digital</p>
      </div>
    </div>
  );
}
