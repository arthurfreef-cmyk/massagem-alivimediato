import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { itensDoPedido, ORDER_BUMPS, cpfValido } from "./checkout-config";

const BASE = "https://api.fruitfy.io";

function headers() {
  return {
    Authorization: `Bearer ${process.env["FRUITFY_API_TOKEN"] ?? ""}`,
    "Store-Id": process.env["FRUITFY_STORE_ID"] ?? "",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// A resposta da Fruitfy é lida de forma tolerante: procura o código copia e cola,
// a imagem do QR e o id do pedido em qualquer nível do JSON.
function procurar(obj: unknown, out: { pix?: string; qr?: string; id?: string; status?: string }) {
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === "string") {
      if (!out.pix && (v.trim().startsWith("000201") || (/^(pix|pix_code|pix_copy_paste|brcode|copy_paste|payload)$/i.test(k) && v.trim().length > 30))) out.pix = v.trim();
      else if (!out.qr && (v.startsWith("data:image") || (/qr/i.test(k) && /^https?:|^[A-Za-z0-9+/=]{200,}$/.test(v)))) out.qr = v.startsWith("http") || v.startsWith("data:") ? v : `data:image/png;base64,${v}`;
      else if (!out.id && /^(id|order_id|uuid|order_uuid)$/i.test(k)) out.id = v;
      else if (!out.status && /status/i.test(k)) out.status = v.toLowerCase();
    } else if (typeof v === "number" && !out.id && /^(id|order_id)$/i.test(k)) out.id = String(v);
    else procurar(v, out);
  }
  return out;
}

export const criarPix = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      nome: z.string().trim().min(3).max(120),
      email: z.string().trim().email().max(200),
      telefone: z.string().regex(/^\d{10,11}$/),
      cpf: z.string().regex(/^\d{11}$/).refine(cpfValido),
      bumps: z.array(z.enum(ORDER_BUMPS.map((b) => b.key) as [string, ...string[]])).max(3),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const itens = itensDoPedido(data.bumps);
    if (itens.some((i) => !i.fruitfyId)) return { ok: false as const, erro: "Checkout ainda não configurado com os produtos da Fruitfy." };
    if (!process.env["FRUITFY_API_TOKEN"] || !process.env["FRUITFY_STORE_ID"]) {
      console.error("Fruitfy: FRUITFY_API_TOKEN ou FRUITFY_STORE_ID não configurado no servidor.");
      return { ok: false as const, erro: "Pagamento temporariamente indisponível. Tente novamente mais tarde." };
    }
    const res = await fetch(`${BASE}/pix/charge`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        name: data.nome, email: data.email, phone: `55${data.telefone}`, cpf: data.cpf,
        amount: itens.reduce((total, item) => total + item.preco, 0),
        items: itens.map((i) => ({ id: i.fruitfyId, value: i.preco, quantity: 1 })),
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || (json && typeof json === "object" && "success" in json && (json as { success?: boolean }).success === false)) {
      console.error("Fruitfy pix/charge", res.status, JSON.stringify(json));
      const mensagem = json && typeof json === "object"
        ? String((json as { message?: string }).message ?? "")
        : "";
      return { ok: false as const, erro: mensagem || "Não foi possível gerar o Pix. Confira seus dados e tente de novo." };
    }
    const r = procurar(json, {});
    if (!r.pix) {
      console.error("Fruitfy sem copia e cola", JSON.stringify(json));
      return { ok: false as const, erro: "Não foi possível gerar o Pix agora. Tente de novo." };
    }
    return { ok: true as const, pix: r.pix, qr: r.qr ?? null, id: r.id ?? null };
  });

export const statusPix = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const res = await fetch(`${BASE}/api/order/${encodeURIComponent(data.id)}`, { headers: headers() });
    if (!res.ok) return { pago: false };
    const r = procurar(await res.json().catch(() => null), {});
    return { pago: !!r.status && /(paid|pago|approved|aprovad|complete)/.test(r.status) };
  });
