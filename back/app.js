const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/produtos', require('./routes/produtoRoutes'));
app.use('/vendas', require('./routes/vendasRoutes'));
app.use('/caixa', require('./routes/caixaRoutes'));

module.exports = app;