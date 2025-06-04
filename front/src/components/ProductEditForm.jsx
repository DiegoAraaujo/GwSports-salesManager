import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "./Button";
import "../styles/ProductEditForm.css";

function ProductEditForm() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [novoPrecoOriginal, setNovoPrecoOriginal] = useState("");
  const [novoPrecoRevenda, setNovoPrecoRevenda] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  function carregarProdutos() {
    axios
      .get("http://localhost:3000/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao carregar produtos:", error));
  }

  function limparFormulario() {
    setProdutoSelecionado("");
    setNovoPrecoOriginal("");
    setNovoPrecoRevenda("");
    setNovaQuantidade("");
  }

  function handleAtualizarProduto(evento) {
    evento.preventDefault();

    if (!produtoSelecionado) {
      alert("Selecione um produto para editar.");
      return;
    }

    const dadosAtualizados = {};
    if (novoPrecoOriginal) dadosAtualizados.preco_original = parseFloat(novoPrecoOriginal);
    if (novoPrecoRevenda) dadosAtualizados.preco_revenda = parseFloat(novoPrecoRevenda);
    if (novaQuantidade) dadosAtualizados.quantidade = parseInt(novaQuantidade);

    axios
      .put(`http://localhost:3000/produtos/${produtoSelecionado}`, dadosAtualizados)
      .then(() => {
        alert("Produto atualizado com sucesso!");
        carregarProdutos();
        limparFormulario(); // limpa os campos
      })
      .catch((error) => {
        console.error("Erro ao atualizar produto:", error);
        alert("Erro ao atualizar produto.");
      });
  }

  function handleExcluirProduto() {
    if (!produtoSelecionado) {
      alert("Selecione um produto para excluir.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    axios
      .delete(`http://localhost:3000/produtos/${produtoSelecionado}`)
      .then(() => {
        alert("Produto excluído com sucesso!");
        carregarProdutos();
        limparFormulario(); // limpa os campos
      })
      .catch((error) => {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto.");
      });
  }

  return (
    <div className="register-products-section">
      <div className="register-or-edit-product">
        <h2 className="edit-productt">Editar Produtos</h2>
        <Link to="/">
          <h2 className="register-productt">Cadastro de Produtos</h2>
        </Link>
      </div>

      <form className="edit-products-form" onSubmit={handleAtualizarProduto}>
        <div>
          <label>Selecione um produto: </label>
          <select
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
          >
            <option value="">-- Escolha --</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Novo preço original: </label>
          <input
            type="number"
            value={novoPrecoOriginal}
            onChange={(e) => setNovoPrecoOriginal(e.target.value)}
          />
        </div>

        <div>
          <label>Novo preço de revenda: </label>
          <input
            type="number"
            value={novoPrecoRevenda}
            onChange={(e) => setNovoPrecoRevenda(e.target.value)}
          />
        </div>

        <div>
          <label>Nova quantidade: </label>
          <input
            type="number"
            value={novaQuantidade}
            onChange={(e) => setNovaQuantidade(e.target.value)}
          />
        </div>

        <div>
          <Button prop="SALVAR" />
          <button type="button" className="deleteProductButton" onClick={handleExcluirProduto}>
            Excluir produto
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditForm;
