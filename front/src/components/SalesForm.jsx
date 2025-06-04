import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import "../styles/salesSection.css";

function SalesForm() {
  const [produtos, setProdutos] = useState([]);
  const [venda, setVenda] = useState({
    produtoId: "",
    nome_cliente: "",
    telefone: "",
    endereco: "",
    tipo_pagamento: "DINHEIRO",
    valor_venda: 0,
    // Removemos data_pagamento do estado inicial
  });

  // Busca produtos com estoque positivo
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/produtos");
        const produtosComEstoque = response.data.filter(
          (p) => p.quantidade > 0
        );
        setProdutos(produtosComEstoque);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenda((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verifica se um produto foi selecionado
      if (!venda.produtoId) {
        alert("Selecione um produto");
        return;
      }

      // Busca o produto selecionado
      const produtoSelecionado = produtos.find(
        (p) => p.id === parseInt(venda.produtoId)
      );

      // Verifica estoque
      if (produtoSelecionado.quantidade < 1) {
        alert("Produto sem estoque disponível");
        return;
      }

      // Determina status do pagamento e data
      const pagamentoInstantaneo = ["DINHEIRO", "PIX", "CARTAO"].includes(
        venda.tipo_pagamento
      );
      const statusPagamento = pagamentoInstantaneo ? "PAGO" : "PENDENTE";

      // Prepara os dados da venda
      const dadosVenda = {
        nome_cliente: venda.nome_cliente,
        telefone: venda.telefone,
        endereco: venda.endereco,
        tipo_pagamento: venda.tipo_pagamento,
        status_pagamento: statusPagamento,
        valor_venda: produtoSelecionado.preco_revenda,
        produtoId: parseInt(venda.produtoId),
      };

      // Só adiciona data_pagamento se for pagamento instantâneo
      if (pagamentoInstantaneo) {
        dadosVenda.data_pagamento = new Date().toISOString().split("T")[0]; // Data atual no formato YYYY-MM-DD
      }

      // 1. Primeiro registra a venda
      const responseVenda = await axios.post(
        "http://localhost:3000/vendas",
        dadosVenda
      );

      // 2. Depois atualiza o estoque do produto
      await axios.put(`http://localhost:3000/produtos/${venda.produtoId}`, {
        quantidade: produtoSelecionado.quantidade - 1,
      });

      alert("Venda registrada e estoque atualizado com sucesso!");

      // Limpa o formulário e recarrega os produtos
      setVenda({
        produtoId: "",
        nome_cliente: "",
        telefone: "",
        endereco: "",
        tipo_pagamento: "DINHEIRO",
        valor_venda: 0,
      });

      // Recarrega a lista de produtos para refletir o novo estoque
      const response = await axios.get("http://localhost:3000/produtos");
      const produtosComEstoque = response.data.filter((p) => p.quantidade > 0);
      setProdutos(produtosComEstoque);
    } catch (error) {
      console.error("Erro no processo de venda:", error);
      alert("Erro ao processar venda: " + error.message);
    }
  };

  return (
    <form className="sales-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="produtoId">Selecionar produto</label>
        <select
          id="produtoId"
          name="produtoId"
          value={venda.produtoId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome} - {produto.marca} (R$ {produto.preco_revenda}) -
              Estoque: {produto.quantidade}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipo_pagamento">Método de pagamento</label>
        <select
          id="tipo_pagamento"
          name="tipo_pagamento"
          value={venda.tipo_pagamento}
          onChange={handleChange}
          required
        >
          <option value="DINHEIRO">Dinheiro</option>
          <option value="PIX">Pix</option>
          <option value="CARTAO">Cartão</option>
          <option value="PENDENTE">Pagar mais tarde</option>
        </select>
      </div>

      <div>
        <label htmlFor="nome_cliente">Cliente:</label>
        <input
          type="text"
          name="nome_cliente"
          id="nome_cliente"
          value={venda.nome_cliente}
          onChange={handleChange}
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="telefone">Número de telefone:</label>
        <input
          type="text"
          name="telefone"
          id="telefone"
          value={venda.telefone}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="endereco">Endereço:</label>
        <input
          type="text"
          name="endereco"
          id="endereco"
          value={venda.endereco}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>

      <Button type="submit" prop="Vender" />
    </form>
  );
}

export default SalesForm;
