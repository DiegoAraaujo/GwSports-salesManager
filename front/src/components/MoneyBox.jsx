import { useState, useEffect } from "react";
import axios from "axios";

function MoneyBox() {
  // Estado para armazenar os dados do caixa: faturamento, lucro, status de carregamento e erro.
  const [caixa, setCaixa] = useState({
    faturamento: 0,
    lucro: 0,
    loading: true,
    error: null,
  });

  // useEffect para buscar os dados do caixa quando o componente é montado.
  useEffect(() => {
    const fetchDadosCaixa = async () => {
      try {
        // Faz uma requisição GET para o endpoint do caixa no backend.
        // A URL foi ajustada para "http://localhost:3000/caixa" para corresponder à sua rota.
        const response = await axios.get("http://localhost:3000/caixa");

        // Extrai 'faturamento' e 'lucro' da resposta do backend.
        // Seu backend já retorna esses valores calculados.
        const { faturamento, lucro } = response.data;

        // Atualiza o estado do componente com os dados recebidos e desativa o carregamento.
        setCaixa({
          faturamento,
          lucro,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Em caso de erro na requisição, atualiza o estado para refletir o erro.
        setCaixa({
          faturamento: 0,
          lucro: 0,
          loading: false,
          error: "Erro ao carregar dados do caixa",
        });
        // Loga o erro no console para depuração.
        console.error("Erro ao buscar dados do caixa:", error);
      }
    };

    // Chama a função de busca de dados.
    fetchDadosCaixa();
  }, []); // O array de dependências vazio garante que esta função é executada apenas uma vez (no componentDidMount).

  // Função auxiliar para formatar valores monetários em Real Brasileiro (BRL).
  const formatMoney = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2, // Garante que sempre haverá duas casas decimais
      maximumFractionDigits: 2, // Garante que não haverá mais de duas casas decimais
    });
  };

  // Renderização condicional baseada no estado de carregamento e erro.
  if (caixa.loading) {
    return <div className="money-box">Carregando dados do caixa...</div>;
  }

  if (caixa.error) {
    return <div className="money-box error">{caixa.error}</div>;
  }

  // Renderiza os dados do caixa quando carregados com sucesso.
  return (
    <div className="money-box">
      <h3>Caixa</h3>
      <p>Faturamento: {formatMoney(caixa.faturamento)}</p>
      <p>
        Lucro:{" "}
        {/* Aplica uma classe CSS 'profit' ou 'loss' com base no valor do lucro. */}
        <span className={caixa.lucro >= 0 ? "profit" : "loss"}>
          {formatMoney(caixa.lucro)}
        </span>
      </p>
    </div>
  );
}

export default MoneyBox;
