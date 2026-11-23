import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/upsell-sucupira")({
  head: () => ({
    meta: [
      { title: "Oferta especial — Pacote Sucupira Composta" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Oferta adicional do Pacote Sucupira Composta." },
    ],
    links: [{ rel: "stylesheet", href: "/lp/assets/css/v4.css" }],
  }),
  component: UpsellSucupira,
});

function UpsellSucupira() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf8f2", padding: "32px 16px 56px", color: "#25251f" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", color: "#77705f" }}>
          MASSAGEM ALIVIMEDIATO · OFERTA PÓS-COMPRA
        </p>
        <section style={{ background: "#fff", borderRadius: 20, padding: "clamp(22px, 5vw, 42px)", boxShadow: "0 12px 40px rgba(40,35,20,.08)", marginTop: 18 }}>
          <p style={{ textAlign: "center", color: "#8b6b35", fontWeight: 700, margin: "0 0 10px" }}>
            Obrigado pela sua compra!
          </p>
          <h1 style={{ textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.12, margin: "0 auto 14px", maxWidth: 620 }}>
            Conheça o Pacote Sucupira Composta
          </h1>
          <p style={{ textAlign: "center", color: "#625f56", lineHeight: 1.6, maxWidth: 570, margin: "0 auto 22px" }}>
            Uma oferta adicional disponível nesta etapa, separada do Manual Alivimediato que você acabou de adquirir.
          </p>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px auto 22px" }}>
            <img
              src="/lp/assets/img/sucupira-composta.webp"
              alt="Pacote Sucupira Composta com três frascos."
              width={384}
              height={384}
              style={{ width: "min(100%, 360px)", height: "auto", objectFit: "contain" }}
            />
          </div>
          <h2 style={{ textAlign: "center", fontSize: 24, margin: "0 0 8px" }}>Pacote com 3 frascos</h2>
          <p style={{ textAlign: "center", color: "#77705f", margin: "0 0 4px" }}>
            De <s>R$ 297,00</s> por
          </p>
          <p style={{ textAlign: "center", fontSize: 48, lineHeight: 1, fontWeight: 800, color: "#276747", margin: "8px 0 22px" }}>
            R$ 67,00
          </p>
          <div style={{ borderTop: "1px solid #eee9df", paddingTop: 20, marginTop: 8 }}>
            <h3 style={{ textAlign: "center", fontSize: 18, margin: "0 0 12px" }}>Depoimentos em vídeo</h3>
            <div style={{ border: "1px dashed #c9c1b2", borderRadius: 12, padding: 22, textAlign: "center", color: "#77705f", background: "#faf8f2" }}>
              Espaço reservado para os vídeos de depoimentos que serão enviados.
            </div>
          </div>
          <button
            type="button"
            disabled
            style={{ display: "block", width: "100%", border: 0, borderRadius: 12, padding: "17px 20px", marginTop: 22, background: "#a8b2a9", color: "#fff", fontSize: 17, fontWeight: 700, cursor: "not-allowed" }}
          >
            Aceitar oferta — checkout em configuração
          </button>
          <p style={{ textAlign: "center", color: "#77705f", fontSize: 13, margin: "12px 0 0" }}>
            A compra adicional será opcional e não altera o pedido do Manual.
          </p>
        </section>
      </div>
    </main>
  );
}
