require('dotenv').config();

const express = require('express');
const cors = require('cors'); // 👈 importa o cors

const app = express();

// Middlewares
app.use(cors()); // 👈 habilita o CORS
app.use(express.json());

// Rotas
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/produtos', require('./routes/produtoRoutes'));
app.use('/vendas', require('./routes/vendasRoutes'));
app.use('/caixa', require('./routes/caixaRoutes'));

module.exports = app;
