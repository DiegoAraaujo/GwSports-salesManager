// src/controllers/vendasController.js
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.criarVenda = async (req, res) => {
  try {
    const { tipo_pagamento } = req.body;

    const dataVenda = {
      ...req.body,
      status_pagamento: ["DINHEIRO", "PIX", "CARTAO"].includes(tipo_pagamento)
        ? "PAGO"
        : "PENDENTE",
      data_pagamento: ["DINHEIRO", "PIX", "CARTAO"].includes(tipo_pagamento)
        ? new Date().toISOString()
        : null,
    };

    const venda = await prisma.vendas.create({ data: dataVenda });

    // REMOVIDA: Lógica de atualização do caixa na criação da venda,
    // pois o caixa é calculado dinamicamente pelo listarCaixa.

    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar venda",
      details: error.message,
    });
  }
};

exports.atualizarVenda = async (req, res) => {
  const { id } = req.params;
  const { status_pagamento } = req.body; // Apenas o status_pagamento é relevante aqui para a lógica

  try {
    const vendaExistente = await prisma.vendas.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vendaExistente) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    let dataToUpdate = { ...req.body };

    // Se o status_pagamento está sendo alterado para "PAGO" E antes era "PENDENTE"
    if (
      status_pagamento === "PAGO" &&
      vendaExistente.status_pagamento === "PENDENTE"
    ) {
      dataToUpdate.data_pagamento = new Date().toISOString(); // Define a data de pagamento
      // Podemos definir um tipo de pagamento padrão se não for fornecido explicitamente na requisição
      // Isso é útil se o status mudar para PAGO mas o tipo_pagamento original era PENDENTE
      if (!dataToUpdate.tipo_pagamento) {
        dataToUpdate.tipo_pagamento = "DINHEIRO"; // Ou PIX, CARTAO, um padrão razoável
      }
    }

    const vendaAtualizada = await prisma.vendas.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    // REMOVIDA: Lógica de atualização do caixa,
    // pois o caixa é calculado dinamicamente pelo listarCaixa e o front-end re-busca os dados.

    res.json(vendaAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarPorNomeCliente = async (req, res) => {
  try {
    const { nome } = req.query;
    const vendas = await prisma.vendas.findMany({
      where: {
        nome_cliente: {
          contains: nome || undefined,
        },
      },
    });
    res.json(vendas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarVendasComProdutos = async (req, res) => {
  try {
    const { status_pagamento } = req.query;

    const vendas = await prisma.vendas.findMany({
      where: {
        status_pagamento: status_pagamento ? status_pagamento : undefined,
      },
      include: {
        produto: true,
      },
    });

    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
