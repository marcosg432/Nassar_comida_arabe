/**
 * Cálculo de valor final e desconto (preços dos produtos não são alterados)
 */

function calcularValorFinalComDesconto(valorOriginal, descontoTipo, descontoValor) {
    const vo = Math.max(0, Number(valorOriginal) || 0);
    const tipo = descontoTipo;
    const dv = Number(descontoValor);
    if (!tipo || dv == null || isNaN(dv) || dv <= 0) return Math.round(vo * 100) / 100;

    if (tipo === 'reais') {
        return Math.round(Math.max(0, vo - dv) * 100) / 100;
    }
    if (tipo === 'percentual') {
        const p = Math.min(100, Math.max(0, dv));
        return Math.round(vo * (1 - p / 100) * 100) / 100;
    }
    return vo;
}

function descontoEquivalenteEmReais(valorOriginal, descontoTipo, descontoValor) {
    const vo = Math.max(0, Number(valorOriginal) || 0);
    const vf = calcularValorFinalComDesconto(vo, descontoTipo, descontoValor);
    return Math.round((vo - vf) * 100) / 100;
}

/** Valor após desconto + taxa de entrega (ambos não negativos). */
function calcularValorFinalComTaxaEntrega(valorAposDesconto, taxaEntrega) {
    const base = Math.max(0, Number(valorAposDesconto) || 0);
    const tx = Math.max(0, Number(taxaEntrega) || 0);
    return Math.round((base + tx) * 100) / 100;
}
