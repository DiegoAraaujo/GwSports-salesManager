const axios = require("axios");

const API_TOKEN = process.env.COHERE_API_KEY;

async function gerarRelatorio(dados) {
  try {
    const prompt = `Os dados abaixo são da GWSports, contendo informações detalhadas das vendas realizadas:\n\n${dados}\n\nPor favor, gere um relatório claro, organizado e em português, apresentando cada venda em tópicos ou linhas separadas. Destaque o nome do produto, o valor da venda, o status do pagamento e a forma de pagamento. Evite repetir informações ou incluir dados irrelevantes. Mantenha a resposta objetiva e fácil de entender.`;

    const response = await axios.post(
      "https://api.cohere.ai/generate",
      {
        model: "command-r-08-2024",
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.text || "Relatório não gerado corretamente.";
  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    throw new Error("Erro ao gerar relatório.");
  }
}

module.exports = { gerarRelatorio };
