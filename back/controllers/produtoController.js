const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.criarProduto = async (req, res) => {
  try {
    const produto = await prisma.produto.create({ data: req.body });
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarPorNomeOuMarca = async (req, res) => {
  const { termo } = req.query;
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        OR: [
          { nome: { contains: termo, mode: 'insensitive' } },
          { marca: { contains: termo, mode: 'insensitive' } },
        ],
      },
    });
    res.json(produtos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};