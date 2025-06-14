const express = require('express');
const router = express.Router();
const {
  criarVenda,
  listarPorNomeCliente,
  atualizarVenda,
  listarVendasComProdutos,
} = require('../controllers/vendasController');

router.post('/', criarVenda);
router.get('/', listarPorNomeCliente);
router.put('/:id', atualizarVenda);
router.get('/listarProdutos', listarVendasComProdutos);

module.exports = router;