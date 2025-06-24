const { PrismaClient } = require("../generated/prisma");
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
          { nome: { contains: termo, mode: "insensitive" } },
          { marca: { contains: termo, mode: "insensitive" } },
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
  console.log(`Tentativa de deletar produto com ID: ${id}`); // Loga o ID recebido

  try {
    // Opcional: Verificar se o produto existe antes de tentar deletar
    // Isso ajuda a dar uma mensagem de erro mais específica
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produtoExistente) {
      console.log(`Produto com ID ${id} não encontrado.`);
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    await prisma.produto.delete({ where: { id: parseInt(id) } });
    console.log(`Produto com ID ${id} deletado com sucesso.`);
    // É comum retornar 204 No Content para deleções bem-sucedidas sem corpo de resposta
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar produto no backend:", error); // Loga o erro completo
    // Se for um erro conhecido do Prisma, você pode customizar a resposta
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "Produto não encontrado para exclusão." });
    }
    // Se for um erro de chave estrangeira (ex: P2003), você também pode dar uma mensagem específica
    if (error.code === "P2003") {
      return res
        .status(409)
        .json({
          error:
            "Não é possível excluir o produto: ele está associado a outros registros.",
        });
    }
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao tentar deletar o produto." });
  }
};
