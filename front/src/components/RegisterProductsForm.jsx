import { Link } from "react-router-dom";
import Button from "./Button";
import "../styles/registerProduct.css";
import axios from "axios";
import { useState } from "react";

function RegisterProductsForm() {
  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    marca: "",
    precoOriginal: "",
    precoRevenda: "",
    quantidade: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/produtos", {
        nome: produto.nome,
        categoria: produto.categoria,
        tamanho: produto.tamanho,
        marca: produto.marca,
        preco_original: parseFloat(produto.precoOriginal),
        preco_revenda: parseFloat(produto.precoRevenda),
        quantidade: parseInt(produto.quantidade),
      })
      .then((response) => {
        alert("Produto adicionado com sucesso!");
        // opcional: limpar formulário
        setProduto({
          nome: "",
          categoria: "",
          tamanho: "",
          marca: "",
          precoOriginal: "",
          precoRevenda: "",
          quantidade: 0,
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar o produto:", error);
        alert("Erro ao enviar o produto.");
      });
  };

  return (
    <div className="register-products-section">
      <div className="register-or-edit-product">
        <h2 className="register-product">Cadastro de Produtos</h2>
        <Link to="/editPage">
          <h2 className="edit-product">Editar Estoque</h2>
        </Link>
      </div>
      <form
        className="register-products-form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="product-data">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={produto.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="categoria">Categoria:</label>
          <input
            type="text"
            name="categoria"
            id="categoria"
            value={produto.categoria}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            name="marca"
            id="marca"
            value={produto.marca}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="precoOriginal">Preço (original):</label>
          <input
            type="text"
            name="precoOriginal"
            id="precoOriginal"
            value={produto.precoOriginal}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="precoRevenda">Preço (revenda):</label>
          <input
            type="text"
            name="precoRevenda"
            id="precoRevenda"
            value={produto.precoRevenda}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="tamanho">Tamanho:</label>
          <input
            type="text"
            name="tamanho"
            id="tamanho"
            value={produto.tamanho}
            onChange={handleChange}
            required
          />
        </div>
        <div className="product-data">
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            id="quantidade"
            value={produto.quantidade}
            onChange={handleChange}
            required
          />
        </div>
        <Button prop="Cadastrar Produto" type="submit" />
      </form>
    </div>
  );
}

export default RegisterProductsForm;
