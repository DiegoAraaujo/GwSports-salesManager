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
  try {
    const venda = await prisma.vendas.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(venda);
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
