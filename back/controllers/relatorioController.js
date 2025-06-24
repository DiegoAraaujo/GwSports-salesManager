const axios = require("axios");

const API_TOKEN = process.env.COHERE_API_KEY;

async function gerarRelatorio(dados) {
  try {
    const prompt = `Os dados a seguir mostram informações detalhadas:\n\n${dados}\n\nCom base nesses dados, gere um relatório simples destacando os pontos principais.`;

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
