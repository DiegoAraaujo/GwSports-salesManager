const express = require('express');
const router = express.Router();
const { criarUsuario, deletarUsuario } = require('../controllers/usuarioController');

router.post('/', criarUsuario);
router.delete('/:id', deletarUsuario);

module.exports = router;