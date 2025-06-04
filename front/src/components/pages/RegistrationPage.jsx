import "../../styles/main.css";
import ProductDate from "../ProductDate";
import RegisterProductsForm from "../RegisterProductsForm";
import SalesForm from "../SalesForm";
import MoneyBox from "../MoneyBox";

import React, { useEffect, useState } from "react";
import axios from "axios";

function Main() {
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
    <main className="container">
      <section className="stock-section">
        <h2>Estoque</h2>
        <div>
          {produtos.map((produto) => (
            <ProductDate
              nome={produto.nome}
              tamanho={produto.tamanho}
              valor={produto.preco_revenda}
              quantidade={produto.quantidade}
              marca={produto.marca}
            />
          ))}
        </div>
      </section>

      <section className="registration-and-control-section">
        <RegisterProductsForm />
        <div className="sales-section">
          <h2>Controle de estoque</h2>
          <div>
            <SalesForm />
            <MoneyBox />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
