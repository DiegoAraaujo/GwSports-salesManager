const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.listarCaixa = async (req, res) => {
  try {
    const caixa = await prisma.caixa.findMany();
    res.json(caixa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};