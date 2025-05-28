const express = require('express');
const router = express.Router();
const {
  criarVenda,
  listarPorNomeCliente,
  atualizarVenda,
} = require('../controllers/vendasController');

router.post('/', criarVenda);
router.get('/', listarPorNomeCliente);
router.put('/:id', atualizarVenda);

module.exports = router;