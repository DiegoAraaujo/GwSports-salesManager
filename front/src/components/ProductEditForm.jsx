import { Link } from "react-router-dom";
import Button from "./Button";
import "../styles/ProductEditForm.css";

import React, { useEffect, useState } from "react";
import axios from "axios";

function RegisterProductsForm() {
  const [produtos, setProdutos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/produtos")
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
      });
  }, []);

  return (
    <div className="register-products-section">
      <div className="register-or-edit-product">
        <h2 className="edit-productt">Editar Produtos</h2>
        <Link to="/">
          <h2 className="register-productt">Cadastro de Produtos</h2>
        </Link>
      </div>
      <form className="edit-products-form" autoComplete="off">
        <select name="" id="">
          <option value="">selecionar produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>

        <div>
          <label htmlFor="newPrice">Novo preço original: </label>
          <input type="number" name="newPrice" id="newPrice" />
        </div>
        <div>
          <label htmlFor="newResalePrice">Novo preço de revenda: </label>
          <input type="number" name="newResalePrice" id="newResalePrice" />
        </div>
        <div>
          <label htmlFor="newQuantity">Nova quantidade: </label>
          <input type="number" name="newQuantity" id="newQuantity" />
        </div>
        <div>
          <Button prop="SALVAR" />
          <button className="deleteProductButton">Excluir produto</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterProductsForm;
