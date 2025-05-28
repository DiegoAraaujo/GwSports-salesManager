const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.criarVenda = async (req, res) => {
  try {
    const venda = await prisma.vendas.create({ data: req.body });
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarPorNomeCliente = async (req, res) => {
  const { nome_cliente } = req.query;
  try {
    const vendas = await prisma.vendas.findMany({
      where: { nome_cliente: { contains: nome_cliente, mode: 'insensitive' } },
    });
    res.json(vendas);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
