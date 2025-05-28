const express = require('express');
const router = express.Router();
const {
  criarProduto,
  listarProdutos,
  buscarPorNomeOuMarca,
  atualizarProduto,
  deletarProduto,
} = require('../controllers/produtoController');

router.post('/', criarProduto);
router.get('/', listarProdutos);
router.get('/buscar', buscarPorNomeOuMarca);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);

module.exports = router;