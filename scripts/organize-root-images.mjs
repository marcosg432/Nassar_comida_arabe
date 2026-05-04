/**
 * Move imagens soltas na raiz do projeto para assets/images/ com nomes seguros.
 * Uso: node scripts/organize-root-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const destDir = path.join(root, "assets", "images");

const RENAME_MAP = [
    ["linha_classica_02.webp", "linha-classica-02.webp"],
    ["linha-classica-doces-finos.webp", "linha-classica-doces-finos.webp"],
    ["linha-afetiva-brigadeiro-amendoim.webp", "linha-afetiva-brigadeiro-amendoim.webp"],
    ["ChatGPT Image 16 de abr. de 2026, 01_10_11.png", "hero-abstract-02.png"],
    ["WhatsApp Image 2026-04-15 at 06.56.54.jpeg", "foto-whatsapp-02.jpeg"],
    ["linha-afetiva-brancos.webp", "linha-afetiva-brancos.webp"],
    ["linha-classica-docinhos-copo.webp", "linha-classica-docinhos-copo.webp"],
    ["linha-classica-cafe-branco.webp", "linha-classica-cafe-branco.webp"],
    ["linha-afetiva-doces-brancos.webp", "linha-afetiva-doces-brancos.webp"],
    ["linha-classica-doce-fino (1).webp", "linha-classica-doce-fino-alt.webp"],
    ["20260321_151225.jpg.jpeg", "foto-20260321-151225.jpeg"],
    ["linha-classica-brigadeiro-gourmet.webp", "linha-classica-brigadeiro-gourmet.webp"],
    ["linha-classica-doces-brancos.webp", "linha-classica-doces-brancos.webp"],
    ["linha-classica-doces-decorados.webp", "linha-classica-doces-decorados.webp"],
    ["linha-classica-chocolate-fino.webp", "linha-classica-chocolate-fino.webp"],
    ["WhatsApp Image 2026-04-15 at 06.54.59.jpeg", "foto-whatsapp-01.jpeg"],
    ["20260418_151939.jpg.jpeg", "foto-20260418-151939.jpeg"],
    ["linha-afetiva-doces-caseiros.webp", "linha-afetiva-doces-caseiros.webp"],
    ["20260411_125110.jpg.jpeg", "foto-20260411-125110.jpeg"],
    ["linha-afetiva-doces-caseiros-ultra.webp", "linha-afetiva-doces-caseiros-ultra.webp"],
    ["linha-afetiva-doces-caseiros-high.webp", "linha-afetiva-doces-caseiros-high.webp"],
    ["lembrancinha-brownie-leve.webp", "lembrancinha-brownie-leve.webp"],
    ["linha-classica-coracoes-chocolate.webp", "linha-classica-coracoes-chocolate.webp"],
    ["linha-afetiva-doces-caseiros-hq.webp", "linha-afetiva-doces-caseiros-hq.webp"],
    ["20260307_154847.jpg.jpeg", "foto-20260307-154847.jpeg"],
    ["20260307_154829.jpg.jpeg", "foto-20260307-154829.jpeg"],
    ["ChatGPT Image 16 de abr. de 2026, 01_05_35.png", "hero-abstract-01.png"],
    ["linha-afetiva-doces.webp", "linha-afetiva-doces.webp"],
    ["lembrancinha-doces-laco-light.webp", "lembrancinha-doces-laco-light.webp"],
    ["lembrancinha-doces-laco.webp", "lembrancinha-doces-laco.webp"],
    ["linha-classica-doce-fino-blueberry.webp", "linha-classica-doce-fino-blueberry.webp"],
    ["linha-afetiva-brigadeiro-amendoim-lite.webp", "linha-afetiva-brigadeiro-amendoim-lite.webp"]
];

fs.mkdirSync(destDir, { recursive: true });

for (const [from, to] of RENAME_MAP) {
    const src = path.join(root, from);
    const out = path.join(destDir, to);
    if (!fs.existsSync(src)) {
        console.warn("skip (missing)", from);
        continue;
    }
    fs.renameSync(src, out);
    console.log("→", to);
}

console.log("OK", RENAME_MAP.length, "ficheiros em assets/images/");
