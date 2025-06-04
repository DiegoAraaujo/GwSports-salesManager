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
  });

  // Função para aplicar máscara de telefone
  const formatPhone = (value) => {
    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara: (XX) XXXXX-XXXX
    if (cleaned.length <= 2) {
      return cleaned;
    }
    if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    // Limita a 11 dígitos (com DDD)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // Manipulador de mudança para o telefone
  const handlePhoneChange = (e) => {
    const formattedValue = formatPhone(e.target.value);
    setVenda(prev => ({
      ...prev,
      telefone: formattedValue
    }));
  };

  // Validação do telefone antes de enviar
  const validatePhone = (phone) => {
    // Remove todos os não dígitos para contar
    const digits = phone.replace(/\D/g, '');
    // Telefone deve ter 10 (sem 9º dígito) ou 11 dígitos (com 9º dígito)
    return digits.length === 10 || digits.length === 11;
  };

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

    // Validação do telefone
    if (venda.telefone && !validatePhone(venda.telefone)) {
      alert("Por favor, insira um número de telefone válido (10 ou 11 dígitos)");
      return;
    }

    try {
      // Verifica se um produto foi selecionado
      if (!venda.produtoId) {
        alert("Selecione um produto");
        return;
      }

      // Resto do seu código de submit permanece o mesmo...
      const produtoSelecionado = produtos.find(
        (p) => p.id === parseInt(venda.produtoId)
      );

      if (produtoSelecionado.quantidade < 1) {
        alert("Produto sem estoque disponível");
        return;
      }

      const pagamentoInstantaneo = ["DINHEIRO", "PIX", "CARTAO"].includes(
        venda.tipo_pagamento
      );
      const statusPagamento = pagamentoInstantaneo ? "PAGO" : "PENDENTE";

      const dadosVenda = {
        nome_cliente: venda.nome_cliente,
        telefone: venda.telefone.replace(/\D/g, ''), // Remove a máscara antes de salvar
        endereco: venda.endereco,
        tipo_pagamento: venda.tipo_pagamento,
        status_pagamento: statusPagamento,
        valor_venda: produtoSelecionado.preco_revenda,
        produtoId: parseInt(venda.produtoId),
        data_pagamento: pagamentoInstantaneo ? new Date().toISOString().split("T")[0] : null,
      };

      const responseVenda = await axios.post(
        "http://localhost:3000/vendas",
        dadosVenda
      );

      await axios.put(`http://localhost:3000/produtos/${venda.produtoId}`, {
        quantidade: produtoSelecionado.quantidade - 1,
      });

      alert("Venda registrada e estoque atualizado com sucesso!");

      setVenda({
        produtoId: "",
        nome_cliente: "",
        telefone: "",
        endereco: "",
        tipo_pagamento: "DINHEIRO",
        valor_venda: 0,
      });

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
          onChange={handlePhoneChange}  // Usa o manipulador especial para telefone
          autoComplete="off"
          placeholder="(99) 99999-9999"
          maxLength={15}  // Com máscara: (99) 99999-9999 = 15 caracteres
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
