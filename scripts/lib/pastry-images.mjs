/**
 * Imagens locais em assets/images/ — nomes estáveis; rotação por índice nos cards.
 */
export const STYLE_PRODUTO_IMG =
    "background: linear-gradient(155deg, #faf7f4, #efe5df);";
export const STYLE_PAGE_HERO =
    "background: linear-gradient(165deg, #fffefb 0%, #f5ebe6 55%, #e8dccf 100%);";
export const STYLE_EVENTO_CTA =
    "background: linear-gradient(rgba(255,255,255,0.94), rgba(248,245,242,0.96)); background-size: cover; background-position: center;";

/** Caminhos de página relativos à raiz do site (para calcular ../). */
export const DELIVERY_PAGE = "delivery/index.html";
export const EVENTOS_PAGE = "eventos/index.html";
export const INDEX_PAGE = "index.html";

/**
 * @param {string} pageRelPath ex.: "delivery/index.html", "pages/doces-finos.html", "index.html"
 * @param {string} basename só o nome do ficheiro em assets/images/
 */
export function assetHref(pageRelPath, basename) {
    const norm = pageRelPath.replace(/\\/g, "/");
    const parts = norm.split("/").filter(Boolean);
    const depth = parts.length - 1;
    const prefix = depth > 0 ? "../".repeat(depth) : "";
    return `${prefix}assets/images/${basename}`;
}

/** Todos os ficheiros em assets/images/ (ordem alfabética, rotação nos grids). */
export const LOCAL_ASSET_FILENAMES = [
    "foto-20260307-154829.jpeg",
    "foto-20260307-154847.jpeg",
    "foto-20260321-151225.jpeg",
    "foto-20260411-125110.jpeg",
    "foto-20260418-151939.jpeg",
    "foto-whatsapp-01.jpeg",
    "foto-whatsapp-02.jpeg",
    "hero-abstract-01.png",
    "hero-abstract-02.png",
    "lembrancinha-brownie-leve.webp",
    "lembrancinha-doces-laco-light.webp",
    "lembrancinha-doces-laco.webp",
    "linha-afetiva-brancos.webp",
    "linha-afetiva-brigadeiro-amendoim-lite.webp",
    "linha-afetiva-brigadeiro-amendoim.webp",
    "linha-afetiva-doces-brancos.webp",
    "linha-afetiva-doces-caseiros-high.webp",
    "linha-afetiva-doces-caseiros-hq.webp",
    "linha-afetiva-doces-caseiros-ultra.webp",
    "linha-afetiva-doces-caseiros.webp",
    "linha-afetiva-doces.webp",
    "linha-classica-02.webp",
    "linha-classica-brigadeiro-gourmet.webp",
    "linha-classica-cafe-branco.webp",
    "linha-classica-chocolate-fino.webp",
    "linha-classica-coracoes-chocolate.webp",
    "linha-classica-doces-brancos.webp",
    "linha-classica-doces-decorados.webp",
    "linha-classica-doces-finos.webp",
    "linha-classica-docinhos-copo.webp",
    "linha-classica-doce-fino-alt.webp",
    "linha-classica-doce-fino-blueberry.webp"
];

export function assetPoolAt(pageRelPath, index) {
    const n = LOCAL_ASSET_FILENAMES.length;
    const i = ((index % n) + n) % n;
    return assetHref(pageRelPath, LOCAL_ASSET_FILENAMES[i]);
}

/** Carrossel home — 3 slides. */
export const IMG_HOME_SLIDES = [
    "foto-20260418-151939.jpeg",
    "hero-abstract-01.png",
    "foto-20260411-125110.jpeg"
];

/** Blocos “Por que escolher” + “Como pedir” (5 imagens). */
export const IMG_HOME_CATEGORIAS = [
    "linha-classica-doces-finos.webp",
    "linha-classica-brigadeiro-gourmet.webp",
    "linha-afetiva-doces-caseiros.webp",
    "linha-classica-docinhos-copo.webp",
    "lembrancinha-doces-laco.webp"
];

export const IMG_ABOUT = "linha-afetiva-brancos.webp";

export const IMG_HERO_DELIVERY = "linha-classica-02.webp";
export const IMG_HERO_EVENTOS = "linha-afetiva-doces.webp";
export const IMG_EVENTO_CTA = "lembrancinha-brownie-leve.webp";

/** Hero 16:9 por ficheiro HTML. */
export const STATIC_PAGE_HERO = {
    "pages/bolos-vitrine.html": "linha-classica-doces-decorados.webp",
    "pages/doces-finos.html": "linha-classica-chocolate-fino.webp",
    "pages/doces-festas.html": "linha-classica-doces-finos.webp",
    "pages/sobremesas-tortas.html": "linha-classica-doce-fino-blueberry.webp",
    "pages/salgados.html": "linha-classica-cafe-branco.webp",
    "pages/pedido-personalizado.html": "foto-whatsapp-01.jpeg",
    "pages/bolos-personalizados.html": "linha-classica-coracoes-chocolate.webp"
};

/** Número esperado de cards no delivery (caixas + grelha). */
export const DELIVERY_EXPECTED_CARDS = 57;
