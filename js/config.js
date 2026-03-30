/**
 * Configurações do Sistema de Pedidos / Orçamentos
 * Alterar apenas este arquivo para configurar em novos cardápios/clientes
 */
const CONFIG = {
    /** Número do WhatsApp com DDD (ex: 5547999999999) */
    telefoneWhatsApp: "5547999999999",
    /** Nome da empresa para identificação e chave do localStorage */
    nomeEmpresa: "Nassar",
    /** Senha da área administrativa (troque em produção) */
    senhaAdmin: "senna2025",
    /** Chaves de status — fluxo de orçamentos para eventos (painel admin) */
    STATUS_ORCAMENTO: {
        NOVO: "novo_orcamento",
        AGUARDANDO_RESPOSTA: "aguardando_resposta",
        APROVADO: "aprovado",
        EM_PRODUCAO: "em_producao",
        FINALIZADO: "finalizado",
        PERDIDO: "perdido"
    },
    /** Rótulos para exibição (admin, PDF) */
    STATUS_LABELS: {
        novo_orcamento: "Novo orçamento",
        aguardando_resposta: "Aguardando resposta",
        aprovado: "Aprovado",
        em_producao: "Em produção",
        finalizado: "Finalizado",
        perdido: "Perdido"
    },
    /** Dias de validade exibidos no PDF do orçamento */
    validadeOrcamentoDias: 15,
    /**
     * Logo para PDF (opcional): caminho a partir da raiz do site, ex: "assets/logo.png"
     * Deixe vazio para não carregar imagem (usa só o nome da empresa).
     */
    logoOrcamentoRelPath: "assets/img/logo-nassar.png"
};
