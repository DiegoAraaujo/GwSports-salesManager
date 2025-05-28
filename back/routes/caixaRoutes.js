const express = require('express');
const router = express.Router();
const { listarCaixa } = require('../controllers/caixaController');

router.get('/', listarCaixa);

module.exports = router;
