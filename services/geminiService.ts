import { GeneratedScript, ScriptRequest } from "../types";

export const generateViralScript = async (request: ScriptRequest): Promise<GeneratedScript> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data as GeneratedScript;
  } catch (error) {
    console.error("Erro ao gerar roteiro via API:", error);
    
    // Fallback amigável em caso de erro de conexão ou backend offline
    return {
      title: "Erro de Conexão",
      hook: "Ops! Não consegui falar com a Inteligência Artificial.",
      body: [
        "Verifique sua conexão com a internet.",
        "O servidor pode estar passando por instabilidades.",
        "Tente clicar em 'Gerar' novamente em alguns instantes."
      ],
      cta: "Tentar Novamente",
      visualCues: "Ícone de wi-fi com sinal de alerta"
    };
  }
};