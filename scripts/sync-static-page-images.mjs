/**
 * Atualiza imagens locais nos cards (ordem dos <article class="produto-card"> no main).
 * Uso: node scripts/sync-static-page-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { assetPoolAt, STYLE_PRODUTO_IMG } from "./lib/pastry-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function escAttr(url) {
    return url.replace(/&/g, "&amp;");
}

function applyPage(rel) {
    const filePath = path.join(root, rel);
    let html = fs.readFileSync(filePath, "utf8");
    let ix = 0;
    html = html.replace(/<article class="produto-card"[\s\S]*?<\/article>/g, block => {
        const url = assetPoolAt(rel, ix);
        const uEsc = escAttr(url);
        ix++;
        let b = block.replace(/data-produto-imagem="[^"]*"/, `data-produto-imagem="${uEsc}"`);
        const produtoStyle = url
            ? `style="background-image: url('${url}');"`
            : `style="${STYLE_PRODUTO_IMG}"`;
        b = b.replace(/<div class="produto-img" style="[^"]*"/, `<div class="produto-img" ${produtoStyle}`);
        return b;
    });
    fs.writeFileSync(filePath, html, "utf8");
    console.log("OK", rel, ix, "cards");
}

applyPage("pages/bolos-vitrine.html");
applyPage("pages/doces-finos.html");
applyPage("pages/doces-festas.html");
applyPage("pages/sobremesas-tortas.html");
applyPage("pages/salgados.html");
