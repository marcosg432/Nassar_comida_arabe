/**
 * Banners locais nas páginas estáticas (hero 16:9).
 * Uso: node scripts/sync-static-heroes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { assetHref, STATIC_PAGE_HERO } from "./lib/pastry-images.mjs";
import { ensurePexelsPreconnect } from "./lib/ensure-pexels-preconnect.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const pages = Object.entries(STATIC_PAGE_HERO);

for (const [rel, basename] of pages) {
    const filePath = path.join(root, rel);
    const original = fs.readFileSync(filePath, "utf8");
    let h = original;
    h = ensurePexelsPreconnect(h);
    const u = assetHref(rel, basename);
    const style = `background-image: url('${u}');`;
    const out = h.replace(
        /<section class="page-hero page-hero--banner" style="[^"]*">/,
        `<section class="page-hero page-hero--banner" style="${style}">`
    );
    if (out === original) {
        console.warn("skip (unchanged)", rel);
        continue;
    }
    fs.writeFileSync(filePath, out, "utf8");
    console.log("OK", rel);
}

for (const rel of ["delivery/index.html", "eventos/index.html"]) {
    const filePath = path.join(root, rel);
    let html = fs.readFileSync(filePath, "utf8");
    const patched = ensurePexelsPreconnect(html);
    if (patched !== html) {
        fs.writeFileSync(filePath, patched, "utf8");
        console.log("head", rel);
    }
}
