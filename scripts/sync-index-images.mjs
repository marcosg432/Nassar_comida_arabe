/**
 * Aplica fotos locais na home (carrossel, categorias, bloco sobre).
 * Uso: node scripts/sync-index-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    assetHref,
    INDEX_PAGE,
    IMG_HOME_SLIDES,
    IMG_HOME_CATEGORIAS,
    IMG_ABOUT
} from "./lib/pastry-images.mjs";
import { ensurePexelsPreconnect } from "./lib/ensure-pexels-preconnect.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");

let html = ensurePexelsPreconnect(fs.readFileSync(indexPath, "utf8"));

const slideUrls = IMG_HOME_SLIDES.map((f) => assetHref(INDEX_PAGE, f));
html = html.replace(/<div class="hero-slide-bg" style="[^"]*"><\/div>/g, () => {
    const u = slideUrls.shift();
    return `<div class="hero-slide-bg" style="background-image: url('${u}');"></div>`;
});

const catUrls = IMG_HOME_CATEGORIAS.map((f) => assetHref(INDEX_PAGE, f));
html = html.replace(/<div class="categoria-img" style="[^"]*"><\/div>/g, () => {
    const u = catUrls.shift();
    return `<div class="categoria-img" style="background-image: url('${u}');"></div>`;
});

const aboutUrl = assetHref(INDEX_PAGE, IMG_ABOUT);
html = html.replace(
    /<section class="section arabic-about" id="sobre" style="[^"]*">/,
    `<section class="section arabic-about" id="sobre" style="--about-bg: url('${aboutUrl}');">`
);

fs.writeFileSync(indexPath, html, "utf8");
console.log("OK index.html");
