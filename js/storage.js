/**
 * storage.js - Persistência do carrinho no localStorage
 * Carrinhos separados: delivery x evento (data-carrinho-modo no <body>)
 */

/**
 * Modo do carrinho da página atual
 * @returns {"delivery"|"evento"}
 */
function getCarrinhoModo() {
    var b = document.body;
    if (!b) return "evento";
    var m = b.getAttribute("data-carrinho-modo");
    if (m === "delivery" || m === "evento") return m;
    return "evento";
}

function getStorageKeyBaseNome() {
    return (typeof CONFIG !== "undefined" && CONFIG.nomeEmpresa)
        ? CONFIG.nomeEmpresa.replace(/\s+/g, "_").toLowerCase()
        : "carrinho";
}

/**
 * @returns {string}
 */
function getStorageKey() {
    var nome = getStorageKeyBaseNome();
    var modo = getCarrinhoModo();
    return "carrinho_" + modo + "_" + nome;
}

/** Chave legada (antes da separação delivery/evento) */
function getStorageKeyLegado() {
    return "carrinho_" + getStorageKeyBaseNome();
}

/**
 * Salva os dados do carrinho no localStorage
 * @param {Array} dados - Array de itens do carrinho
 */
function salvarCarrinho(dados) {
    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(dados));
    } catch (e) {
        console.warn('LocalStorage indisponível:', e);
    }
}

/**
 * Carrega o carrinho do localStorage
 * @returns {Array} Array de itens ou array vazio
 */
function carregarCarrinho() {
    try {
        var key = getStorageKey();
        var saved = localStorage.getItem(key);
        if (!saved) {
            var legado = localStorage.getItem(getStorageKeyLegado());
            if (legado) {
                saved = legado;
                localStorage.setItem(key, legado);
            }
        }
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn("Erro ao carregar carrinho:", e);
    }
    return [];
}
