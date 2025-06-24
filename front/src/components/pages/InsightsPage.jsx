// src/pages/InsightsPage.jsx
import "../../styles/insightsPage.css";
// Removemos a importação de Img, pois não será mais usada
import PendingSale from "../PendingSale";
import Button from "../Button";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
// Importações do Recharts para o gráfico de barras
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function InsightsPage() {
  const [vendasPendentes, setVendasPendentes] = useState([]);
  const [todasAsVendas, setTodasAsVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState([]); // Novo estado para os dados do gráfico

  // Função para buscar as vendas do backend
  const fetchVendas = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await axios.get("http://localhost:3000/vendas");
      const vendas = response.data;
      setTodasAsVendas(vendas);

      const pendentes = vendas.filter(
        (venda) => venda.status_pagamento === "PENDENTE"
      );
      setVendasPendentes(pendentes);

      // Prepara os dados para o gráfico
      // Agrupa as vendas pelo tipo_pagamento e soma os valores
      const aggregatedData = vendas.reduce((acc, venda) => {
        const tipo = venda.tipo_pagamento;
        if (!acc[tipo]) {
          acc[tipo] = { name: tipo, valor: 0 };
        }
        acc[tipo].valor += venda.valor_venda;
        return acc;
      }, {});

      // Converte o objeto agregado em um array para o Recharts
      setDadosGrafico(Object.values(aggregatedData));
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setErro("Erro ao carregar vendas. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  // Função para lidar com o clique no botão "Marcar como pago"
  const handleMarcarComoPago = async (vendaId, valorVenda) => {
    try {
      await axios.put(`http://localhost:3000/vendas/${vendaId}`, {
        status_pagamento: "PAGO",
      });

      // Atualiza os estados no frontend
      setVendasPendentes((prevVendas) =>
        prevVendas.filter((venda) => venda.id !== vendaId)
      );

      // Re-busca todas as vendas para atualizar o gráfico e a lista de pendentes
      // Isso garante que o gráfico reflita imediatamente a mudança
      await fetchVendas();

      console.log(
        `Venda ${vendaId} marcada como paga e caixa atualizado no backend.`
      );
    } catch (error) {
      console.error("Erro ao marcar venda como paga:", error);
      setErro("Erro ao marcar pagamento como pago. Tente novamente.");
    }
  };

  return (
    <main className="container container-insightsPage">
      <section className="smartsection">
        <div className="report-container">
          <h2>Relatório</h2>
          <div className="report-here" style={{ whiteSpace: "pre-line" }}>
            {/* Conteúdo do relatório aqui */}
          </div>
          <div className="generate-report-button" style={{ cursor: "pointer" }}>
            <Button prop="Gerar relatório" />
          </div>
        </div>

        <div className="graphic-container">
          <h2>Gráfico de vendas por Tipo de Pagamento</h2>
          {carregando ? (
            <p>Carregando gráfico...</p>
          ) : erro ? (
            <p className="error-message">{erro}</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dadosGrafico}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="name" />{" "}
                {/* 'name' será o tipo de pagamento (DINHEIRO, PIX, CARTAO, PENDENTE) */}
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar
                  dataKey="valor"
                  fill="#8884d8"
                  name="Valor Total de Vendas"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
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
          ) : erro ? (
            <li className="error-message">{erro}</li>
          ) : vendasPendentes.length === 0 ? (
            <li>Todos os pagamentos estão em dia.</li>
          ) : (
            vendasPendentes.map((venda) => (
              <li key={venda.id}>
                <div className="debtor-details">
                  <PendingSale
                    nome={venda.nome_cliente}
                    valor={venda.valor_venda}
                    telefone={venda.telefone}
                    endereco={venda.endereco}
                  />
                </div>
                <div className="mark-as-paid-button">
                  <Button
                    prop="Marcar como pago"
                    type="button"
                    onClick={() =>
                      handleMarcarComoPago(venda.id, venda.valor_venda)
                    }
                  />
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
