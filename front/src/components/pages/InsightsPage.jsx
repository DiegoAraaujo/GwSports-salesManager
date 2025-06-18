import "../../styles/insightsPage.css";
import Img from "../../assets/graphic.svg";
import PendingSale from "../PendingSale";
import Button from "../Button";
import { useEffect, useState } from "react";
import axios from "axios";

function InsightsPage() {
  const [vendasPendentes, setVendasPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/vendas")
      .then((response) => {
        // Filtrar vendas com status_pagamento PENDENTE
        const pendentes = response.data.filter(
          (venda) => venda.status_pagamento === "PENDENTE"
        );
        setVendasPendentes(pendentes);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar vendas:", error);
        setCarregando(false);
      });
  }, []);

  return (
    <main className="container container-insightsPage">
      <section className="smartsection">
        <div className="report-container">
          <h2>Relatório</h2>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry...
          </div>
        </div>
        <div className="graphic-container">
          <h2>Gráfico de vendas</h2>
          <div>
            <img src={Img} alt="" />
          </div>
        </div>
      </section>

      <section className="pending-payments-section">
  <h2>Pagamentos pendentes</h2>
  <div className="pending-list-columns">
    <p>Nome</p>
    <p>Valor</p>
    <p>Telefone</p>
    <p>Endereço</p>
  </div>

  <ul className="pending-list">
    {carregando ? (
      <li>Carregando pagamentos pendentes...</li>
    ) : vendasPendentes.length === 0 ? (
      <li>Todos os pagamentos estão em dia.</li>
    ) : (
      vendasPendentes.map((venda) => (
        <li key={venda.id}>
          <PendingSale
            nome={venda.nome_cliente}
            valor={venda.valor_venda}
            telefone={venda.telefone}
            endereco={venda.endereco}
          />
          <div>
            <Button prop="Marcar como pago" />
          </div>
        </li>
      ))
    )}
  </ul>
</section>

    </main>
  );
}

export default InsightsPage;
