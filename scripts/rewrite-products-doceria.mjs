/**
 * Reescreve cards de produto (texto/imagens data-*), mantendo preços.
 * Uso: node scripts/rewrite-products-doceria.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    assetHref,
    assetPoolAt,
    DELIVERY_PAGE,
    EVENTOS_PAGE,
    IMG_HERO_DELIVERY,
    IMG_HERO_EVENTOS,
    IMG_EVENTO_CTA,
    DELIVERY_EXPECTED_CARDS,
    STYLE_PRODUTO_IMG
} from "./lib/pastry-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const styleDeliveryHero = `background-image: url('${assetHref(DELIVERY_PAGE, IMG_HERO_DELIVERY)}');`;
const styleEventosHero = `background-image: url('${assetHref(EVENTOS_PAGE, IMG_HERO_EVENTOS)}');`;
const styleEventoCta = `background-image: linear-gradient(rgba(255,255,255,0.94), rgba(248,245,242,0.96)), url('${assetHref(
    EVENTOS_PAGE,
    IMG_EVENTO_CTA
)}'); background-size: cover; background-position: center;`;

function parseAttrs(block) {
    const attrs = {};
    block.replace(/data-produto-(imagem|nome|preco|descricao|ingredientes|pedido)="([^"]*)"/g, (_, k, v) => {
        attrs[k] = v;
        return "";
    });
    return attrs;
}

function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function rebuildArticle(block, prod) {
    const attrs = parseAttrs(block);
    const img = prod.imageUrl;
    const pedidoDisplay = attrs.pedido ?? "";
    const preco = attrs.preco ?? "0";

    const hit = prod.hit
        ? '                    <span class="produto-hit-badge">Mais pedido</span>\r\n'
        : "";
    const social = prod.social
        ? `                    <p class="produto-mini-social">${esc(prod.social)}</p>\r\n`
        : "";

    const imgStyle = img ? `background-image:url('${img}');` : STYLE_PRODUTO_IMG;
    return (
        `<article class="produto-card" data-produto-imagem="${esc(img)}" data-produto-nome="${esc(prod.fullName)}" data-produto-preco="${esc(preco)}" data-produto-descricao="${esc(prod.desc)}" data-produto-ingredientes="${esc(prod.ing)}" data-produto-pedido="${esc(pedidoDisplay)}">\r\n` +
        `                <div class="produto-img" style="${imgStyle}"></div>\r\n` +
        `                <div class="produto-content">\r\n` +
        hit +
        `                    <h3>${prod.short}</h3>\r\n` +
        `                    <p class="descricao-produto">${prod.desc}</p>\r\n` +
        social +
        `                    <span class="produto-preco">${pedidoDisplay}</span>\r\n` +
        `                    <div class="produto-buttons">\r\n` +
        `                        <button type="button" class="btn-adicionar-carrinho">Adicionar</button>\r\n` +
        `                        <button type="button" class="btn-saiba-mais">Saiba mais</button>\r\n` +
        `                    </div>\r\n` +
        `                </div>\r\n` +
        `            </article>`
    );
}

const descBase = [
    "Feito com chocolate belga e finalização especial.",
    "Textura cremosa e acabamento delicado.",
    "Produção artesanal — ingredientes selecionados.",
    "Ideal para dividir ou presentear com elegância.",
    "Sabores equilibrados: doce na medida certa.",
    "Finalização premium em cada camada.",
    "Assado no ponto para máxima fofura.",
    "Receita da casa — clientes elogiam o sabor.",
    "Bem iluminado e fotogênico, como chega até você.",
    "Leve ao paladar sem pesar na consciência.",
    "Casca fina onde precisa — coração bem recheado."
];

const ingBase = [
    "Chocolate belga | Creme de leite | Manteiga",
    "Cacau nobre | Leite integral",
    "Farinhas especiais | Ovos frescos",
    "Frutos vermelhos | Baunilha de bourbon",
    "Nuts selecionados | Flor de sal",
    "Chocolate branco premium | Pistache moído",
    "Limão siciliano | Raspas naturais",
    "Cookies artesanais | Ganache cremosa",
    "Massa amanteigada | Recheio surpresa",
    "Chantilly leve | Toque especial da confeitaria"
];

function buildDeliveryProducts() {
    const arr = [];
    let di = 0;

    function push(full, short, hit = false, social = "") {
        arr.push({
            fullName: full,
            short,
            desc: descBase[di % descBase.length],
            ing: ingBase[di % ingBase.length],
            hit,
            social,
            imageUrl: assetPoolAt(DELIVERY_PAGE, di)
        });
        di++;
    }

    push("Caixa Aurora — Brigadeiros gourmet sortidos", "Caixa Aurora", true, "");
    push("Caixa Primavera — Tortinhas delicadas premium", "Primavera", false, "");
    push('Kit Belle — Brigadeiros cremosos "Antália"', "Belle • Antália", false, "");
    push("Bandeja Instabul — Mix de sobremesas individuais", "Instabul", false, "");
    push(
        "Cesta Ancara — Fatias de bolo + brigadeiros",
        "Ancara",
        false,
        "Clientes dizem que some antes do café — combinação favorita."
    );

    const sn = ["Trouxinha crocante", "Mini brownie", "Potinho bem-casado", "Fatia especial", "Pavê no copo", "Mini naked cake", "Tartelete belga", "Mousse no copinho", "Churrocream", "Alfajor premium"];
    const hn = ["Ninho", "Amêndoa", "Caramelo salgado", "Red velvet", "Maracujá", "Limão", "Pistache", "Nozes", "Chocolate 70%", "Oreo gold"];

    for (let i = 0; i < 52; i++) {
        const line = sn[i % sn.length];
        const variants = `${line} — ${hn[i % hn.length]}`;
        const short = line;
        push(variants, short, i % 11 === 0, i % 17 === 0 ? "Cliente ama esse detalhe de sabor." : "");
    }
    if (arr.length !== DELIVERY_EXPECTED_CARDS) {
        console.error("Delivery: cards", arr.length, "esperados", DELIVERY_EXPECTED_CARDS);
        process.exit(1);
    }
    return arr;
}

function buildEventProducts() {
    const arr = [];
    let ei = 0;
    function evPush(full, short, hit = false, social = "") {
        arr.push({
            fullName: full,
            short,
            desc: descBase[ei % descBase.length],
            ing: ingBase[ei % ingBase.length],
            hit,
            social,
            imageUrl: assetPoolAt(EVENTOS_PAGE, ei)
        });
        ei++;
    }
    evPush("Mesa festiva — Cento brigadeiros gourmet mistos", "Cento brigadeiros mistos", true);
    evPush('Mesa festiva — Cento brigadeiros "belga único"', "Cento belga único");
    evPush("Mesa premium — Cento docinhos finos sortidos", "Cento docinhos finos");
    evPush("Coquetel doce — 100 mini sobremesas assortidas", "100 mini sobremesas");
    evPush("Coquetel doce — 50 mini doces mesa menor", "50 mini doces");
    evPush("Combo doceria — festa até 30 convidados", "Combo 30 convidados");
    evPush("Combo doceria — festa até 50 convidados", "Combo 50 convidados");
    evPush("Buffet de doces por convidado (mín. 30)", "Buffet por pessoa", false, "Perfeito para casamentos corporativos e coffee premium.");
    evPush("Coffee break corporativo doces & mini bolos", "Coffee break corporativo");
    return arr;
}

function rewriteFile(relPath, products, textReplacers) {
    let html = fs.readFileSync(path.join(root, relPath), "utf8");
    for (const [from, to] of textReplacers) html = html.replace(from, to);
    let ix = 0;
    html = html.replace(/<article class="produto-card"[\s\S]*?<\/article>/g, block => {
        const idx = ix++;
        return rebuildArticle(block, products[idx]);
    });
    if (ix !== products.length) {
        console.error(relPath, "cards:", ix, "esperados:", products.length);
        process.exit(1);
    }
    fs.writeFileSync(path.join(root, relPath), html, "utf8");
}

const deliveryProducts = buildDeliveryProducts();
const eventProducts = buildEventProducts();

rewriteFile("delivery/index.html", deliveryProducts, [
    [/<title>.*?<\/title>/, "<title>Delivery | Doceria Premium</title>"],
    [
        /aria-label="Nassar Comida Árabe — Início"/,
        'aria-label="Doceria Premium — Início"'
    ],
    [/Nassar Comida Árabe/g, "Doceria Premium"],
    [
        /<section class="page-hero page-hero--banner"[\s\S]*?<\/section>/,
        `<section class="page-hero page-hero--banner" style="${styleDeliveryHero}">\r\n        <div class="page-hero-brand">\r\n            <span class="page-hero-logo logo-wordmark" role="img" aria-label="Doceria Premium">Doceria Premium</span>\r\n        </div>\r\n        <h1>Delivery</h1>\r\n        <p>Caixas, brigadeiros, bolos individuais, tortas e sobremesas — finalize pelo WhatsApp com carrinho organizado.</p>\r\n    </section>`
    ],
    [/<h2 class="menu-section-title">Combinado Turquia<\/h2>/, '<h2 class="menu-section-title">Caixas especiais · mix doces</h2>'],
    [/<h2 class="menu-section-title">Entradas Frias\/Pães<\/h2>/, '<h2 class="menu-section-title">Docinhos individuais &amp; potinhos</h2>'],
    [/<h2 class="menu-section-title">Kibes<\/h2>/, '<h2 class="menu-section-title">Brownies &amp; fatias especiais</h2>'],
    [/<h2 class="menu-section-title">Esfihas<\/h2>/, '<h2 class="menu-section-title">Tortas e bolos em fatia</h2>'],
    [/<h2 class="menu-section-title">Pratos Quentes<\/h2>/, '<h2 class="menu-section-title">Bolos &amp; tortas grandes</h2>'],
    [/<h2 class="menu-section-title">Sobremesas<\/h2>/, '<h2 class="menu-section-title">Sobremesas em taça · copinho</h2>'],
    [
        /family=Cormorant\+Garamond[^"']*/,
        "family=Playfair+Display:ital,wght@0,500;0,600;0,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600"
    ]
]);

rewriteFile("eventos/index.html", eventProducts, [
    [/<title>.*?<\/title>/, "<title>Eventos | Doceria Premium</title>"],
    [
        /aria-label="Nassar Comida Árabe — Início"/,
        'aria-label="Doceria Premium — Início"'
    ],
    [/Nassar Comida Árabe/g, "Doceria Premium"],
    [
        /<section class="page-hero page-hero--banner"[\s\S]*?<\/section>/,
        `<section class="page-hero page-hero--banner" style="${styleEventosHero}">\r\n        <div class="page-hero-brand">\r\n            <span class="page-hero-logo logo-wordmark" role="img" aria-label="Doceria Premium">Doceria Premium</span>\r\n        </div>\r\n        <h1>Orçamentos para eventos</h1>\r\n        <p>Mesas de doces, centenas de brigadeiros, combos para festas e buffet doce — carrinho, orçamento e acompanhamento com nossa equipe.</p>\r\n    </section>`
    ],
    [/<h2 class="menu-section-title">Cento de esfihas<\/h2>/, '<h2 class="menu-section-title">Mesa festiva · brigadeiros &amp; centos</h2>'],
    [/<h2 class="menu-section-title">Cento de kibe<\/h2>/, '<h2 class="menu-section-title">Docinhos finos premium</h2>'],
    [/<h2 class="menu-section-title">Mini salgados árabes<\/h2>/, '<h2 class="menu-section-title">Mini doces para coquetel</h2>'],
    [/<h2 class="menu-section-title">Combos para festas<\/h2>/, '<h2 class="menu-section-title">Combos doceria para festas</h2>'],
    [/<h2 class="menu-section-title">Buffet árabe<\/h2>/, '<h2 class="menu-section-title">Buffet de doces &amp; operações grandes</h2>'],
    [
        /<div class="evento-cta-card"[\s\S]*?<\/div>(?=\s*<\/main>)/,
        `<div class="evento-cta-card" style="${styleEventoCta}">\r\n            <h3>Orçamento personalizado</h3>\r\n            <p>Monte mesa exclusiva com paleta do seu evento, volumes sob medida e degustação. Valores formalizados na proposta.</p>\r\n            <a href="../pages/pedido-personalizado.html" class="btn btn-primary">Abrir pedido personalizado</a>\r\n        </div>`
    ],
    [
        /family=Cormorant\+Garamond[^"']*/,
        "family=Playfair+Display:ital,wght@0,500;0,600;0,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600"
    ]
]);

console.log("OK delivery", deliveryProducts.length, "eventos", eventProducts.length);
