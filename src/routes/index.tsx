import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import bodyHtml from "@/lp/body.html?raw";

const title = "Manual Ilustrado para Alívio da Dor com Massagem";
const description =
  "Antes do próximo remédio, experimente usar as mãos: mais de 70 massagens ilustradas que mostram onde tocar, como tocar e qual pressão usar. Por Ana Martha, fisioterapeuta.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: "#FAF8F2" },
      { property: "og:title", content: "Antes do próximo remédio, experimente usar as mãos" },
      { property: "og:description", content: "Mais de 70 massagens ilustradas e 5 bônus por R$27." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://pcm.topcorpus.com.br", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/lp/assets/fonts/fraunces-latin.woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "/lp/assets/css/v4.css" },
    ],
    scripts: [
      { children: "window.dataLayer = window.dataLayer || [];" },
      { src: "/lp/assets/js/env-config.js" },
      { src: "/lp/assets/js/gtm-loader.js" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    if (document.querySelector("script[data-lp-manual]")) return;
    const s = document.createElement("script");
    s.src = "/lp/assets/js/manual.js";
    s.setAttribute("data-lp-manual", "1");
    document.body.appendChild(s);
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
