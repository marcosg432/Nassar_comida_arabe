/** Remove resíduos de `<link rel="preconnect" href="https://images.pexels.com">` do HTML. */
export function ensurePexelsPreconnect(html) {
    return html.replace(/\s*<link[^>]*href="https:\/\/images\.pexels\.com"[^>]*>\r?\n?/gi, "");
}
