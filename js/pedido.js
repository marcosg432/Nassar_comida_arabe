/**
 * pedido.js — Fluxo delivery (WhatsApp, sem admin) e evento (orçamento + admin + WhatsApp)
 */

function valorCampo(id) {
    var el = document.getElementById(id);
    if (!el || el.value == null) return "";
    return String(el.value).replace(/^\s+|\s+$/g, "");
}

function montarItensOrcamentoDoCarrinho() {
    return carrinho.map(function (item) {
        var subtotal = Math.round(item.preco * item.quantidade * 100) / 100;
        return {
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
            preco_unitario: item.preco,
            subtotal: subtotal
        };
    });
}

function montarMensagemOrcamento(orcId) {
    var nome = valorCampo("nome");
    var telefone = valorCampo("telefone");
    var email = valorCampo("email-cliente");
    var dataEvento = valorCampo("data-evento");
    var tipoEvento = valorCampo("tipo-evento");
    var convidados = valorCampo("convidados");
    var localEvento = valorCampo("local-evento");
    var tipo = valorCampo("tipo");
    var endereco = valorCampo("endereco");
    var observacao = valorCampo("observacao");

    var valorOriginal = calcularTotal();
    var msg = "NOVO ORÇAMENTO (EVENTO)\n";
    msg += "Ref: " + orcId + "\n\n";
    msg += "ITENS:\n";
    carrinho.forEach(function (item) {
        var subtotal = item.preco * item.quantidade;
        msg += item.quantidade + "x " + item.nome + " - R$ " + formatarPreco(subtotal) + "\n";
    });
    msg += "\nTotal estimado: R$ " + formatarPreco(valorOriginal) + "\n\n";
    msg += "EVENTO\n";
    msg += "Data: " + (dataEvento || "-") + "\n";
    msg += "Tipo: " + (tipoEvento || "-") + "\n";
    msg += "Convidados: " + (convidados || "-") + "\n";
    msg += "Local: " + (localEvento || "-") + "\n";
    if (tipo) {
        msg += "Entrega/Retirada: " + (tipo || "-") + "\n";
        if (tipo === "Entrega") msg += "Endereço: " + (endereco || "-") + "\n";
    }
    msg += "\nObservações: " + (observacao || "-") + "\n\n";
    msg += "CLIENTE\n";
    msg += "Nome: " + (nome || "-") + "\n";
    msg += "Telefone: " + (telefone || "-") + "\n";
    msg += "E-mail: " + (email || "-") + "\n";
    msg += "-------------";
    return msg;
}

function montarMensagemDelivery() {
    var nome = valorCampo("nome");
    var telefone = valorCampo("telefone");
    var endereco = valorCampo("endereco-delivery");
    var bairro = valorCampo("bairro-delivery");
    var pagamento = valorCampo("pagamento-delivery");
    var observacao = valorCampo("observacao-delivery");
    var horario = valorCampo("horario-delivery");
    var total = calcularTotal();
    var msg = "PEDIDO DELIVERY\n\n";
    msg += "ITENS:\n";
    carrinho.forEach(function (item) {
        var subtotal = item.preco * item.quantidade;
        msg += item.quantidade + "x " + item.nome + " - R$ " + formatarPreco(subtotal) + "\n";
    });
    msg += "\nTotal: R$ " + formatarPreco(total) + "\n\n";
    msg += "ENTREGA\n";
    msg += "Nome: " + (nome || "-") + "\n";
    msg += "Telefone: " + (telefone || "-") + "\n";
    msg += "Endereço: " + (endereco || "-") + "\n";
    msg += "Bairro: " + (bairro || "-") + "\n";
    msg += "Pagamento: " + (pagamento || "-") + "\n";
    if (horario) msg += "Horário desejado: " + horario + "\n";
    msg += "Observações: " + (observacao || "-") + "\n";
    msg += "-------------";
    return msg;
}

function validarFormularioDelivery() {
    var nome = valorCampo("nome");
    var telefone = valorCampo("telefone");
    var endereco = valorCampo("endereco-delivery");
    var bairro = valorCampo("bairro-delivery");
    if (!nome) return "Preencha o nome.";
    if (!telefone) return "Preencha o telefone.";
    if (!endereco) return "Preencha o endereço.";
    if (!bairro) return "Preencha o bairro.";
    return null;
}

function validarFormularioEvento() {
    var nome = valorCampo("nome");
    var telefone = valorCampo("telefone");
    var email = valorCampo("email-cliente");
    var dataEvento = valorCampo("data-evento");
    var tipoEvento = valorCampo("tipo-evento");
    var convidados = valorCampo("convidados");
    var localEvento = valorCampo("local-evento");
    var tipoEl = document.getElementById("tipo");
    var endereco = valorCampo("endereco");

    if (!nome) return "Preencha o nome do cliente.";
    if (!telefone) return "Preencha o telefone.";
    if (document.getElementById("email-cliente")) {
        if (!email) return "Preencha o e-mail.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido.";
    }
    if (!dataEvento) return "Informe a data do evento.";
    if (!tipoEvento) return "Informe o tipo de evento.";
    if (!convidados || parseInt(convidados, 10) < 1) return "Informe o número de convidados.";
    if (!localEvento) return "Informe o local do evento.";
    if (tipoEl) {
        var tipo = valorCampo("tipo");
        if (!tipo) return "Selecione entrega ou retirada.";
        if (tipo === "Entrega" && !endereco) return "Preencha o endereço para entrega.";
    }
    return null;
}

function aposEnviarLimparCarrinho() {
    carrinho = [];
    salvarCarrinho(carrinho);
    atualizarCarrinho();
    atualizarBadge();
    fecharCarrinho();
}

function abrirWhatsAppComTexto(texto, avisoHtml) {
    var telefoneWa = (CONFIG && CONFIG.telefoneWhatsApp) || "5547999999999";
    var url = "https://wa.me/" + telefoneWa + "?text=" + encodeURIComponent(texto);
    if (avisoHtml) alert(avisoHtml);
    var waWin = window.open(url, "_blank");
    if (!waWin || waWin.closed || typeof waWin.closed === "undefined") {
        window.location.href = url;
    }
}

function enviarPedidoDelivery() {
    if (typeof getCarrinhoModo === "function" && getCarrinhoModo() !== "delivery") {
        alert("Este formulário é apenas para pedidos de delivery.");
        return;
    }
    if (carrinho.length === 0) {
        alert("Adicione itens ao carrinho antes de finalizar.");
        return;
    }
    var erro = validarFormularioDelivery();
    if (erro) {
        alert(erro);
        return;
    }
    var msg = montarMensagemDelivery();
    abrirWhatsAppComTexto(msg, "Pedido enviado ao WhatsApp. Obrigado!");
    aposEnviarLimparCarrinho();
}

function gerarOrcamentoEvento() {
    if (typeof getCarrinhoModo === "function" && getCarrinhoModo() === "delivery") {
        alert("Na página de delivery use «Enviar pedido». Para orçamento, acesse Eventos.");
        return;
    }
    if (carrinho.length === 0) {
        alert("Adicione itens ao orçamento antes de gerar.");
        return;
    }

    var erro = validarFormularioEvento();
    if (erro) {
        alert(erro);
        return;
    }

    var nome = valorCampo("nome");
    var telefone = valorCampo("telefone");
    var email = valorCampo("email-cliente");
    var dataEvento = valorCampo("data-evento");
    var tipoEvento = valorCampo("tipo-evento");
    var convidados = valorCampo("convidados");
    var localEvento = valorCampo("local-evento");
    var tipoEl = document.getElementById("tipo");
    var tipo = tipoEl ? valorCampo("tipo") : "";
    var endereco = valorCampo("endereco");
    var pagamento = document.getElementById("pagamento") ? valorCampo("pagamento") : "";
    var observacao = valorCampo("observacao");

    var entregaTexto = tipo === "Entrega" ? "Entrega — " + (endereco || "") : (tipo || "");

    var valorOriginal = Math.round(calcularTotal() * 100) / 100;
    var id = Date.now();
    var itens = montarItensOrcamentoDoCarrinho();

    var statusNovo = (CONFIG && CONFIG.STATUS_ORCAMENTO && CONFIG.STATUS_ORCAMENTO.NOVO) || "novo_orcamento";
    var agora = new Date().toISOString();

    var registro = {
        id: id,
        tipo: "evento",
        cliente: nome,
        telefone: telefone,
        email: email || null,
        evento_data: dataEvento,
        evento_tipo: tipoEvento,
        convidados: parseInt(convidados, 10) || 0,
        local: localEvento,
        entrega: entregaTexto || null,
        observacoes: observacao || "",
        itens: itens,
        valor_original: valorOriginal,
        desconto_tipo: null,
        desconto_valor: null,
        valor_desconto: 0,
        valor_final: valorOriginal,
        taxa_entrega: null,
        forma_pagamento: pagamento || "",
        entrada: null,
        restante: null,
        data_pagamento_entrada: null,
        data_pagamento_final: null,
        status: statusNovo,
        contrato_pdf: null,
        data_criacao: agora,
        nome_cliente: nome,
        data_evento: dataEvento,
        tipo_evento: tipoEvento,
        local_evento: localEvento,
        entrega_retirada: tipo || null,
        endereco: tipo === "Entrega" ? endereco : null,
        forma_pagamento_ref: pagamento || null,
        pagamento: pagamento || "",
        total: valorOriginal,
        data: agora,
        contrato: null
    };

    try {
        if (typeof criarOrcamento !== "function") {
            throw new Error("criarOrcamento não disponível (orcamentos-storage.js).");
        }
        criarOrcamento(registro);
    } catch (e) {
        console.error(e);
        alert("Não foi possível salvar o orçamento. Verifique o armazenamento do navegador ou bloqueios.");
        return;
    }

    var mensagem = montarMensagemOrcamento(String(id));
    alert("Orçamento salvo (ref. " + id + "). Abrindo o WhatsApp…");
    aposEnviarLimparCarrinho();
    var telefoneWa = (CONFIG && CONFIG.telefoneWhatsApp) || "5547999999999";
    var url = "https://wa.me/" + telefoneWa + "?text=" + encodeURIComponent(mensagem);
    var waWin = window.open(url, "_blank");
    if (!waWin || waWin.closed || typeof waWin.closed === "undefined") {
        window.location.href = url;
    }
}

function toggleCampoEndereco() {
    var tipo = document.getElementById("tipo");
    var enderecoWrap = document.getElementById("endereco-wrap");
    var enderecoInput = document.getElementById("endereco");

    if (tipo && enderecoWrap) {
        if (tipo.value === "Entrega") {
            enderecoWrap.style.display = "block";
            if (enderecoInput) enderecoInput.required = true;
        } else {
            enderecoWrap.style.display = "none";
            if (enderecoInput) {
                enderecoInput.required = false;
                enderecoInput.value = "";
            }
        }
    }
}

function initPedido() {
    var btnDelivery = document.getElementById("btn-finalizar-delivery");
    var btnEvento = document.getElementById("btn-finalizar-evento");
    var btnLegado = document.querySelector(".btn-finalizar-pedido");
    var tipoSelect = document.getElementById("tipo");

    if (btnDelivery) {
        btnDelivery.addEventListener("click", enviarPedidoDelivery);
    }
    if (btnEvento) {
        btnEvento.addEventListener("click", gerarOrcamentoEvento);
    }
    if (!btnDelivery && !btnEvento && btnLegado) {
        btnLegado.addEventListener("click", function () {
            var modo = typeof getCarrinhoModo === "function" ? getCarrinhoModo() : "evento";
            if (modo === "delivery") enviarPedidoDelivery();
            else gerarOrcamentoEvento();
        });
    }

    if (tipoSelect) {
        tipoSelect.addEventListener("change", toggleCampoEndereco);
        toggleCampoEndereco();
    }
}

document.addEventListener("DOMContentLoaded", initPedido);
