import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { BANNER_CHECKOUT, ORDER_BUMPS, PRODUTO_PRINCIPAL, itensDoPedido, formatarReais, cpfValido } from "@/lib/checkout-config";
import { criarPix, statusPix } from "@/lib/fruitfy.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout Pix — Massagem Alivimediato" },
      { name: "description", content: "Finalize sua compra do Manual com 165 Massagens Ilustradas pagando com Pix." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout — Massagem Alivimediato" },
      { property: "og:description", content: "Pague com Pix e receba o acesso na hora." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: "/lp/assets/css/v4.css" },
      { rel: "stylesheet", href: "/lp/assets/css/checkout.css" },
    ],
  }),
  component: Checkout,
});

const so = (s: string) => s.replace(/\D/g, "");
const mascCpf = (s: string) => so(s).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const mascTel = (s: string) => so(s).slice(0, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");

function Checkout() {
  const gerar = useServerFn(criarPix);
  const consultar = useServerFn(statusPix);
  const [f, setF] = useState({ nome: "", email: "", telefone: "", cpf: "" });
  const [bumps, setBumps] = useState<string[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pix, setPix] = useState<{ pix: string; qr: string; id: string | null } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [pago, setPago] = useState(false);
  const precoBump = 990;

  useEffect(() => {
    if (!pix?.id || pago) return;
    const id = pix.id;
    let redirecionando = false;
    const t = setInterval(async () => {
      try {
        const status = await consultar({ data: { id } });
        if (status.pago && !redirecionando) {
          redirecionando = true;
          setPago(true);
          window.location.replace("/upsell-sucupira");
        }
      } catch {
        // Mantém a consulta ativa e tenta novamente.
      }
    }, 5000);
    return () => clearInterval(t);
  }, [pix, pago, consultar]);

  const alternar = (k: string) => setBumps((b) => (b.includes(k) ? b.filter((x) => x !== k) : [...b, k]));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (f.nome.trim().split(/\s+/).length < 2) return setErro("Digite seu nome completo.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setErro("Digite um e-mail válido.");
    if (so(f.telefone).length < 10) return setErro("Digite seu WhatsApp com DDD.");
    if (!cpfValido(f.cpf)) return setErro("CPF inválido.");
    setCarregando(true);
    try {
      const r = await gerar({ data: { nome: f.nome.trim(), email: f.email.trim(), telefone: so(f.telefone), cpf: so(f.cpf), bumps } });
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

  const itens = itensDoPedido(bumps).map((item) =>
    item.key === "costas" || item.key === "cabeca"
      ? { ...item, preco: precoBump ?? item.preco }
      : item,
  );
  const total = itens.reduce((soma, item) => soma + item.preco, 0);

  const resumo = (
    <aside className="ck__box ck__resumo">
      <h2 className="ck__h">Resumo do pedido</h2>
      <div className="ck__prod">
        <img src={PRODUTO_PRINCIPAL.imagem} alt="Manual com 165 Massagens Ilustradas" width={92} height={92} />
        <div><strong>{PRODUTO_PRINCIPAL.nome}</strong><br /><small>{PRODUTO_PRINCIPAL.descricao}</small></div>
      </div>
      {itens.map((i) => (
        <div className="ck__linha" key={i.key}><span>{i.nome}</span><span>{formatarReais(i.preco)}</span></div>
      ))}
      <div className="ck__total"><span>Total</span><span>{formatarReais(total)}</span></div>
      <p className="ck__seg">🔒 Pagamento seguro via Pix · Acesso imediato por e-mail</p>
    </aside>
  );

  return (
    <main className="ck">
      <img className="ck__banner" src={BANNER_CHECKOUT.imagem} alt={BANNER_CHECKOUT.alt} width={1024} height={357} />
      <p className="ck__topo">Massagem Alivimediato · Checkout seguro</p>
      <div className="ck__wrap">
        {resumo}
        {pago ? (
          <section className="ck__box ck__pix">
            <p className="ck__ok">Pagamento confirmado! 🎉</p>
            <p>Enviamos o acesso para <strong>{f.email}</strong>. Confira também a caixa de spam.</p>
          </section>
        ) : pix ? (
          <section className="ck__box ck__pix">
            <h1 className="ck__h">Pague {formatarReais(total)} com Pix</h1>
            <p>Abra o app do seu banco, escolha Pix e escaneie o código ou use o copia e cola.</p>
            <img src={pix.qr} alt="QR Code do Pix" />
            <textarea readOnly rows={4} value={pix.pix} aria-label="Código Pix copia e cola" />
            <button type="button" className="ck__btn" onClick={async () => { await navigator.clipboard.writeText(pix.pix); setCopiado(true); setTimeout(() => setCopiado(false), 2500); }}>
              {copiado ? "Código copiado ✓" : "Copiar código Pix"}
            </button>
            <p className="ck__seg">Assim que o pagamento for aprovado, o acesso chega no seu e-mail.</p>
          </section>
        ) : (
          <form className="ck__box" onSubmit={enviar} noValidate>
            <h1 className="ck__h">Seus dados</h1>
            <label className="ck__campo">Nome completo<input name="name" autoComplete="name" required maxLength={120} value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Seu nome completo" /></label>
            <label className="ck__campo">E-mail (onde você recebe o acesso)<input name="email" type="email" inputMode="email" autoComplete="email" required maxLength={200} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="seuemail@exemplo.com" /></label>
            <div className="ck__dois">
              <label className="ck__campo">WhatsApp<input name="tel" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16} value={f.telefone} onChange={(e) => setF({ ...f, telefone: mascTel(e.target.value) })} placeholder="(11) 99999-9999" /></label>
              <label className="ck__campo">CPF<input name="cpf" inputMode="numeric" autoComplete="off" required maxLength={14} value={f.cpf} onChange={(e) => setF({ ...f, cpf: mascCpf(e.target.value) })} placeholder="000.000.000-00" /></label>
            </div>
            <h2 className="ck__h" style={{ marginTop: 10 }}>Aproveite também</h2>
                        {ORDER_BUMPS.map((b) => (
              <label key={b.key} className={"ck__bump" + (bumps.includes(b.key) ? " is-on" : "")}>
                <input type="checkbox" checked={bumps.includes(b.key)}  onChange={() => alternar(b.key)} />
                <img src={b.imagem} alt="" width={64} height={64} loading="lazy" />
                <span>
                  <span className="ck__selo">{b.selo ?? "Oferta única"}</span>
                  <strong>{b.nome}</strong>
                  <small>{b.descricao}</small>
                  {b.de ? (
                    <span className="ck__de">
                      de <s>{formatarReais(b.de)}</s> por <strong>{formatarReais(b.preco)}</strong>
                    </span>
                  ) : null}
                  <em>Sim, quero por apenas {b.key === "costas" || b.key === "cabeca" ? formatarReais(precoBump) : formatarReais(b.preco)}</em>
                </span>
              </label>
            ))}
            <section className="ck__depoimentos" aria-labelledby="ck-depo-title">
              <h2 id="ck-depo-title">Quem já conhece o trabalho da Ana conta como foi</h2>
              <article className="ck__depo">
                <img src="/lp/assets/img/depo-ana-maria.webp" alt="Depoimento enviado por Ana Maria dos Santos Andrade Filha." loading="lazy" />
                <p><strong>Ana Maria dos Santos Andrade Filha</strong><span>Relato sobre as massagens nas pernas e nas costas do marido.</span></p>
              </article>
              <article className="ck__depo">
                <img src="/lp/assets/img/depo-ruthlea.webp" alt="Mensagem enviada por Ruthlea Barbosa dos Santos Sales." loading="lazy" />
                <p><strong>Ruthlea Barbosa dos Santos Sales</strong><span>Relato sobre a experiência de massagear os pés e as costas da mãe.</span></p>
              </article>
              <article className="ck__depo ck__depo--texto">
                <p><strong>Betina Chaluppe · Massoterapeuta</strong><span>“Quando finalizei a sessão [...] ela olhou pra mim e disse: nossa, você tirou um peso gigante de mim. A dor está em 2.”</span></p>
              </article>
              <p className="ck__depo-nota">Depoimentos publicados na página do Manual.</p>
            </section>
            {erro && <p className="ck__erro" role="alert">{erro}</p>}
            <button className="ck__btn" disabled={carregando}>{carregando ? "Gerando Pix..." : "COMPRAR AGORA"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
