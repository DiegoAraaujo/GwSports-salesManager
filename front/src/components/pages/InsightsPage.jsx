// src/pages/InsightsPage.jsx
import "../../styles/insightsPage.css";
import PendingSale from "../PendingSale";
import Button from "../Button";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
  const [dadosGrafico, setDadosGrafico] = useState([]);

  // Estados para relatório
  const [relatorio, setRelatorio] = useState("");
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);
  const [erroRelatorio, setErroRelatorio] = useState(null);

  // Buscar vendas e preparar gráfico e pendentes
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

      const aggregatedData = vendas.reduce((acc, venda) => {
        const tipo = venda.tipo_pagamento;
        if (!acc[tipo]) {
          acc[tipo] = { name: tipo, valor: 0 };
        }
        acc[tipo].valor += venda.valor_venda;
        return acc;
      }, {});

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

  // Marcar como pago, atualiza lista e gráfico
  const handleMarcarComoPago = async (vendaId, valorVenda) => {
    try {
      await axios.put(`http://localhost:3000/vendas/${vendaId}`, {
        status_pagamento: "PAGO",
      });
      setVendasPendentes((prevVendas) =>
        prevVendas.filter((venda) => venda.id !== vendaId)
      );
      await fetchVendas();
      console.log(
        `Venda ${vendaId} marcada como paga e caixa atualizado no backend.`
      );
    } catch (error) {
      console.error("Erro ao marcar venda como paga:", error);
      setErro("Erro ao marcar pagamento como pago. Tente novamente.");
    }
  };

  // Função gerar relatório integrada da IA
  const gerarRelatorio = async () => {
    setCarregandoRelatorio(true);
    setErroRelatorio(null);
    setRelatorio("");

    // Monta a string de vendas para enviar ao backend
    const vendasTexto = todasAsVendas
      .map((venda) => {
        return `${venda.nome_produto || venda.produto || "Produto desconhecido"} vendeu ${
          venda.quantidade_vendida || venda.qtd || 0
        } unidades.`;
      })
      .join(" ");

    try {
      const response = await axios.post("http://localhost:3000/relatorio", {
        dados: vendasTexto,
      });
      setRelatorio(response.data.relatorio);
    } catch (error) {
      console.error(
        "Erro ao gerar relatório:",
        error.response?.data || error.message || error
      );
      setErroRelatorio("Erro ao gerar relatório. Tente novamente mais tarde.");
    } finally {
      setCarregandoRelatorio(false);
    }
  };

  return (
    <main className="container container-insightsPage">
      <section className="smartsection">
        <div className="report-container">
          <h2>Relatório</h2>
          <div className="report-here" style={{ whiteSpace: "pre-line" }}>
            {carregandoRelatorio && <p>Carregando relatório...</p>}
            {erroRelatorio && <p style={{ color: "red" }}>{erroRelatorio}</p>}
            {!carregandoRelatorio && !erroRelatorio && relatorio && (
              <pre>{relatorio}</pre>
            )}
            {!carregandoRelatorio && !erroRelatorio && !relatorio && (
              <p>Conteúdo do relatório aqui</p>
            )}
          </div>
          <div
            className="generate-report-button"
            style={{ cursor: "pointer" }}
          >
            <Button
              prop="Gerar relatório"
              onClick={gerarRelatorio}
              disabled={carregandoRelatorio}
            />
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
                <XAxis dataKey="name" />
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
                    onClick={() => handleMarcarComoPago(venda.id, venda.valor_venda)}
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
