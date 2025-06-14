// src/controllers/caixaController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

/**
 * @function listarCaixa
 * @description Busca todas as vendas pagas e calcula o faturamento total, lucro e o número total de vendas.
 * O faturamento considera apenas vendas com status "PAGO".
 * O lucro é calculado como a diferença entre o valor de venda e o preço original do produto.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 */
exports.listarCaixa = async (req, res) => {
  try {
    // Busca todas as vendas PAGAS, incluindo os dados do produto associado.
    const vendas = await prisma.vendas.findMany({
      where: {
        status_pagamento: "PAGO", // Filtra para incluir apenas vendas que foram pagas
      },
      include: {
        produto: true, // Inclui as informações do produto para calcular o lucro
      },
    });

    // Calcula os totais de faturamento, lucro e o número total de vendas pagas.
    const resultado = vendas.reduce(
      (acc, venda) => {
        // Converte o valor de venda para número, usando 0 como fallback se for inválido.
        const valorVenda = Number(venda.valor_venda) || 0;
        // Converte o preço original do produto para número, usando 0 como fallback.
        // O operador ?. (optional chaining) garante que não haverá erro se 'produto' for nulo.
        const precoCusto = Number(venda.produto?.preco_original) || 0;

        return {
          faturamento: acc.faturamento + valorVenda, // Soma o valor da venda ao faturamento
          lucro: acc.lucro + (valorVenda - precoCusto), // Calcula o lucro da venda e adiciona ao total
          totalVendas: acc.totalVendas + 1, // Incrementa o contador de vendas
        };
      },
      { faturamento: 0, lucro: 0, totalVendas: 0 } // Valores iniciais para os acumuladores
    );

    // Retorna os dados calculados como resposta JSON.
    res.json({
      faturamento: resultado.faturamento,
      lucro: resultado.lucro,
      totalVendas: resultado.totalVendas,
    });
  } catch (error) {
    // Em caso de erro, loga o erro no console e envia uma resposta de erro ao cliente.
    console.error("Erro ao calcular dados do caixa:", error);
    res.status(500).json({
      error: "Erro ao calcular dados do caixa",
      details: error.message,
    });
  } finally {
    // Garante que a conexão do Prisma Client seja desconectada após a operação,
    // seja ela bem-sucedida ou não.
    await prisma.$disconnect();
  }
};
