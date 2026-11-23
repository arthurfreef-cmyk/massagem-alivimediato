import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { formatarReais, cpfValido } from "@/lib/checkout-config";
import { criarPix, statusPix } from "@/lib/fruitfy.functions";
import imagemSucupira from "@/assets/upsell-sucupira.jpg";

export const Route = createFileRoute("/upsell-sucupira")({
  head: () => ({
    meta: [
      { title: "Oferta especial — Chá de Sucupira | Massagem Alivimediato" },
      { name: "description", content: "Oferta única pós-compra: potencialize o alívio das dores com o Chá de Sucupira." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Oferta especial — Chá de Sucupira" },
      { property: "og:description", content: "Potencialize o alívio das dores com o Chá de Sucupira." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: "/lp/assets/css/v4.css" },
      { rel: "stylesheet", href: "/lp/assets/css/checkout.css" },
    ],
  }),
  component: UpsellSucupira,
});

const PRECO = 2700; // centavos
const DE = 9700;

const so = (s: string) => s.replace(/\D/g, "");
const mascCpf = (s: string) => so(s).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const mascTel = (s: string) => so(s).slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");

const BENEFICIOS = [
  "Anti-inflamatório natural: tradicionalmente usado para aliviar dores nas articulações, joelhos e coluna.",
  "Potencializa o Manual: enquanto a massagem alivia por fora, a sucupira cuida por dentro.",
  "100% natural: casca e semente de sucupira selecionadas, sem química adicionada.",
  "Simples de preparar: basta ferver e tomar — cabe na sua rotina sem esforço.",
];

function UpsellSucupira() {
  const gerar = useServerFn(criarPix);
  const consultar = useServerFn(statusPix);
  const [querOferta, setQuerOferta] = useState(false);
  const [recusou, setRecusou] = useState(false);
  const [f, setF] = useState({ nome: "", email: "", telefone: "", cpf: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pix, setPix] = useState<{ pix: string; qr: string; id: string | null } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [pago, setPago] = useState(false);

  useEffect(() => {
    if (!pix?.id || pago) return;
    const id = pix.id;
    const t = setInterval(async () => {
      try { if ((await consultar({ data: { id } })).pago) setPago(true); } catch { /* tenta de novo */ }
    }, 5000);
    return () => clearInterval(t);
  }, [pix, pago, consultar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (f.nome.trim().split(/\s+/).length < 2) return setErro("Digite seu nome completo.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setErro("Digite um e-mail válido.");
    if (so(f.telefone).length < 10) return setErro("Digite seu WhatsApp com DDD.");
    if (!cpfValido(f.cpf)) return setErro("CPF inválido.");
    setCarregando(true);
    try {
      const r = await gerar({ data: { nome: f.nome.trim(), email: f.email.trim(), telefone: so(f.telefone), cpf: so(f.cpf), bumps: [] } });
      if (!r.ok) return setErro(r.erro);
      const qr = r.qr ?? (await QRCode.toDataURL(r.pix, { width: 460, margin: 1 }));
      setPix({ pix: r.pix, qr, id: r.id });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErro("Não foi possível gerar o Pix. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="ck">
      <p className="ck__topo">Massagem Alivimediato · Oferta especial</p>
      <div className="ck__wrap" style={{ maxWidth: 720, display: "block" }}>
        {pago ? (
          <section className="ck__box ck__pix">
            <p className="ck__ok">Pagamento confirmado! 🎉</p>
            <p>Seu Chá de Sucupira está garantido. Enviamos os detalhes para <strong>{f.email}</strong>.</p>
          </section>
        ) : pix ? (
          <section className="ck__box ck__pix">
            <h1 className="ck__h">Pague {formatarReais(PRECO)} com Pix</h1>
            <p>Abra o app do seu banco, escolha Pix e escaneie o código ou use o copia e cola.</p>
            <img src={pix.qr} alt="QR Code do Pix" />
            <textarea readOnly rows={4} value={pix.pix} aria-label="Código Pix copia e cola" />
            <button type="button" className="ck__btn" onClick={async () => { await navigator.clipboard.writeText(pix.pix); setCopiado(true); setTimeout(() => setCopiado(false), 2500); }}>
              {copiado ? "Código copiado ✓" : "Copiar código Pix"}
            </button>
            <p className="ck__seg">Assim que o pagamento for aprovado, confirmamos seu pedido.</p>
          </section>
        ) : recusou ? (
          <section className="ck__box ck__pix">
            <p className="ck__ok">Sem problemas! 😊</p>
            <p>Seu Manual com 165 Massagens Ilustradas já está garantido. Obrigado pela confiança!</p>
          </section>
        ) : (
          <section className="ck__box">
            <p className="ck__seg" style={{ marginTop: 0, fontWeight: 800, color: "var(--verde)" }}>
              Parabéns pela sua compra! Antes de ir, uma oferta só sua:
            </p>
            <h1 className="ck__h" style={{ fontSize: 26, textAlign: "center" }}>
              Potencialize o alívio das suas dores com o Chá de Sucupira
            </h1>
            <img
              src={imagemSucupira}
              alt="Kit de Chá de Sucupira com casca e sementes selecionadas"
              width={1024}
              height={1024}
              style={{ width: "100%", maxWidth: 380, height: "auto", display: "block", margin: "0 auto 14px", borderRadius: 14 }}
            />
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "grid", gap: 8 }}>
              {BENEFICIOS.map((b) => (
                <li key={b} style={{ display: "flex", gap: 8, fontSize: 14.5, lineHeight: 1.45 }}>
                  <span aria-hidden>✅</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p style={{ textAlign: "center", margin: "0 0 4px" }}>
              <span className="ck__de" style={{ display: "inline", fontSize: 15 }}>
                de <s>{formatarReais(DE)}</s> por apenas{" "}
                <strong style={{ fontSize: 24 }}>{formatarReais(PRECO)}</strong>
              </span>
            </p>
            <p className="ck__seg" style={{ marginTop: 0 }}>Oferta única nesta página — não aparece de novo.</p>
            {!querOferta ? (
              <>
                <button type="button" className="ck__btn" onClick={() => setQuerOferta(true)}>
                  Sim, quero o meu Chá de Sucupira
                </button>
                <p className="ck__seg">
                  <button
                    type="button"
                    onClick={() => setRecusou(true)}
                    style={{ background: "none", border: 0, cursor: "pointer", color: "inherit", textDecoration: "underline", font: "inherit" }}
                  >
                    Não, obrigado — quero só o Manual
                  </button>
                </p>
              </>
            ) : (
              <form onSubmit={enviar} noValidate style={{ marginTop: 10 }}>
                <label className="ck__campo">Nome completo<input autoComplete="name" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></label>
                <label className="ck__campo">E-mail<input type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
                <div className="ck__dois">
                  <label className="ck__campo">WhatsApp<input inputMode="tel" autoComplete="tel" value={f.telefone} onChange={(e) => setF({ ...f, telefone: mascTel(e.target.value) })} placeholder="(11) 99999-9999" /></label>
                  <label className="ck__campo">CPF<input inputMode="numeric" value={f.cpf} onChange={(e) => setF({ ...f, cpf: mascCpf(e.target.value) })} placeholder="000.000.000-00" /></label>
                </div>
                {erro && <p className="ck__erro" role="alert">{erro}</p>}
                <button className="ck__btn" disabled={carregando}>{carregando ? "Gerando Pix..." : `Gerar Pix de ${formatarReais(PRECO)}`}</button>
              </form>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
