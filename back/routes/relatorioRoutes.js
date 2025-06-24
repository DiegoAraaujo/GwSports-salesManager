const express = require('express');
const router = express.Router();
const { gerarRelatorio } = require('../controllers/relatorioController');

router.post('/', async (req, res) => {
  const { dados } = req.body;

  if (!dados) {
    return res.status(400).json({ erro: 'Dados não enviados.' });
  }

  try {
    const relatorio = await gerarRelatorio(dados);
    res.json({ relatorio });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
