// src/pages/InsightsPage.jsx
import "../../styles/insightsPage.css";
import Img from "../../assets/graphic.svg";
import PendingSale from "../PendingSale";
import Button from "../Button";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function InsightsPage() {
  const [vendasPendentes, setVendasPendentes] = useState([]);
  const [todasAsVendas, setTodasAsVendas] = useState([]); // Este estado agora será usado para refletir a mudança
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null); // Novo estado para lidar com erros

  // Função para buscar as vendas do backend
  const fetchVendas = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await axios.get("http://localhost:3000/vendas");
      setTodasAsVendas(response.data);

      const pendentes = response.data.filter(
        (venda) => venda.status_pagamento === "PENDENTE"
      );
      setVendasPendentes(pendentes);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setErro("Erro ao carregar vendas. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchVendas(); // Chamamos a função de busca ao montar o componente
  }, [fetchVendas]);

  // Função para lidar com o clique no botão "Marcar como pago"
  const handleMarcarComoPago = async (vendaId, valorVenda) => {
    try {
      // 1. Atualiza o status da venda no backend
      await axios.put(`http://localhost:3000/vendas/${vendaId}`, {
        status_pagamento: "PAGO",
        // A data_pagamento será definida no backend automaticamente
        // quando o status for alterado para PAGO.
      });

      // 2. Atualiza os estados no frontend para remover a venda da lista de pendentes
      setVendasPendentes((prevVendas) =>
        prevVendas.filter((venda) => venda.id !== vendaId)
      );

      // Opcional: Atualizar 'todasAsVendas' se você precisar que esse estado reflita a mudança
      // setTodasAsVendas((prevTodasAsVendas) =>
      //   prevTodasAsVendas.map((venda) =>
      //     venda.id === vendaId
      //       ? { ...venda, status_pagamento: "PAGO", data_pagamento: new Date().toISOString() }
      //       : venda
      //   )
      // );

      console.log(
        `Venda ${vendaId} marcada como paga e caixa atualizado no backend.`
      );
      // Poderíamos adicionar uma mensagem de sucesso ao usuário aqui
    } catch (error) {
      console.error("Erro ao marcar venda como paga:", error);
      setErro("Erro ao marcar pagamento como pago. Tente novamente.");
      // Poderíamos adicionar uma mensagem de erro ao usuário aqui
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
          <h2>Gráfico de vendas</h2>
          <div>
            <img src={Img} alt="Gráfico de vendas" />
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
                    type="button" // Garante que não tente submeter um formulário
                    // Passa a função de tratamento de clique, com os dados da venda
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
