/**
 * Remove referências a imagens externas (Pexels) nos HTML; substitui por gradientes neutros.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const HERO =
    "background: linear-gradient(165deg, #fffefb 0%, #f5ebe6 55%, #e8dccf 100%);";
const CARD =
    "background: linear-gradient(155deg, #faf7f4, #efe5df);";

function walk(dir, list = []) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) walk(p, list);
        else if (name.endsWith(".html")) list.push(p);
    }
    return list;
}

function strip(html) {
    html = html.replace(
        /\s*<link\s+rel="preconnect"\s+href="https:\/\/images\.pexels\.com"[^>]*>\r?\n?/gi,
        ""
    );

    html = html.replace(
        /data-produto-imagem="https:\/\/images\.pexels\.com[^"]*"/g,
        'data-produto-imagem=""'
    );

    html = html.replace(
        /--about-bg:\s*url\('https:\/\/images\.pexels\.com[^']*'\)/g,
        "--about-bg: none"
    );

    html = html.replace(
        /,\s*url\('https:\/\/images\.pexels\.com[^']*'\)/g,
        ""
    );

    html = html.replace(
        /<div class="hero-slide-bg"\s+style="background-image:\s*url\('https:\/\/images\.pexels\.com[^']*'\);"\s*><\/div>/g,
        `<div class="hero-slide-bg" style="${HERO}"></div>`
    );

    html = html.replace(
        /<section class="page-hero page-hero--banner"\s+style="background-image:\s*url\('https:\/\/images\.pexels\.com[^']*'\);">/g,
        `<section class="page-hero page-hero--banner" style="${HERO}">`
    );

    html = html.replace(
        /<div class="categoria-img"\s+style="background-image:\s*url\('https:\/\/images\.pexels\.com[^']*'\);"\s*><\/div>/g,
        `<div class="categoria-img" style="${CARD}"></div>`
    );

    html = html.replace(
        /<div class="produto-img"\s+style="background-image:\s*url\('https:\/\/images\.pexels\.com[^']*'\);"\s*><\/div>/g,
        `<div class="produto-img" style="${CARD}"></div>`
    );
    html = html.replace(
        /<div class="produto-img"\s+style="background-image:url\('https:\/\/images\.pexels\.com[^']*'\);"\s*><\/div>/g,
        `<div class="produto-img" style="${CARD}"></div>`
    );

    /* Fallback: variações de whitespace ou ordem de atributos */
    for (let i = 0; i < 8; i++) {
        const before = html;
        html = html.replace(
            /<div class="hero-slide-bg"[^>]*style="[^"]*images\.pexels\.com[^"]*"[^>]*><\/div>/g,
            `<div class="hero-slide-bg" style="${HERO}"></div>`
        );
        html = html.replace(
            /<section class="page-hero page-hero--banner" style="[^"]*images\.pexels\.com[^"]*">/g,
            `<section class="page-hero page-hero--banner" style="${HERO}">`
        );
        html = html.replace(
            /<div class="categoria-img"[^>]*style="[^"]*images\.pexels\.com[^"]*"[^>]*><\/div>/g,
            `<div class="categoria-img" style="${CARD}"></div>`
        );
        html = html.replace(
            /<div class="produto-img"[^>]*style="[^"]*images\.pexels\.com[^"]*"[^>]*><\/div>/g,
            `<div class="produto-img" style="${CARD}"></div>`
        );
        if (html === before) break;
    }

    return html;
}

const files = walk(root).filter((p) => {
    const rel = path.relative(root, p).replace(/\\/g, "/");
    if (rel.startsWith("node_modules/")) return false;
    return true;
});

let changed = 0;
for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const after = strip(before);
    if (after !== before) {
        fs.writeFileSync(file, after, "utf8");
        changed++;
        console.log("updated", path.relative(root, file));
    }
}
console.log("done,", changed, "files");
