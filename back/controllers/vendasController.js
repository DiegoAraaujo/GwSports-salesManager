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

    // Se a venda for paga no momento da criação, atualize o caixa
    if (dataVenda.status_pagamento === "PAGO") {
      await prisma.caixa.update({
        where: { id: 1 }, // Assumimos que há apenas um registro de Caixa com ID 1
        data: {
          saldo: {
            increment: venda.valor_venda,
          },
          quantidade_vendas: {
            increment: 1,
          },
        },
      });
    } else {
      // Se a venda for PENDENTE, incrementa pagamentos_pendentes no caixa
      await prisma.caixa.update({
        where: { id: 1 }, // Assumimos que há apenas um registro de Caixa com ID 1
        data: {
          pagamentos_pendentes: {
            increment: 1,
          },
        },
      });
    }

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
  const { status_pagamento, valor_venda } = req.body; // Pegamos o status e o valor da requisição

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
      dataToUpdate.tipo_pagamento = "DINHEIRO"; // Ou outro tipo padrão, já que está sendo pago agora

      // Atualiza o caixa
      await prisma.caixa.update({
        where: { id: 1 }, // Assumimos que há apenas um registro de Caixa com ID 1
        data: {
          saldo: {
            increment: vendaExistente.valor_venda, // Usa o valor original da venda
          },
          quantidade_vendas: {
            increment: 1,
          },
          pagamentos_pendentes: {
            decrement: 1, // Decrementa a contagem de pagamentos pendentes
          },
        },
      });
    }

    const vendaAtualizada = await prisma.vendas.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.json(vendaAtualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarPorNomeCliente = async (req, res) => {
  try {
    const { nome } = req.query; // Assume que você vai filtrar por query param
    const vendas = await prisma.vendas.findMany({
      where: {
        nome_cliente: {
          contains: nome || undefined, // Filtra se nome existir
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
