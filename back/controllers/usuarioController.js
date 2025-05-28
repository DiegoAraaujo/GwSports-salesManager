const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.criarUsuario = async (req, res) => {
  const { email, nome, senha } = req.body;
  try {
    const novoUsuario = await prisma.usuario.create({
      data: { email, nome, senha },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: parseInt(id) } });
    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};