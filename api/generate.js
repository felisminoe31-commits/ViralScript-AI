import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(request, response) {
  // Configuração de CORS
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { tool, niche, audience, tone } = request.body;

    if (!process.env.API_KEY) {
      return response.status(500).json({ error: 'Server misconfiguration: API_KEY missing' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Contexto base focado em HUMANIZAÇÃO e COPYWRITING PROFISSIONAL
    const baseContext = `
      ATUE COMO: Um Copywriter Sênior de Elite e Estrategista de Redes Sociais com 10 anos de experiência.
      SUA MISSÃO: Escrever conteúdo que pareça 100% humano, autêntico, magnético e impossível de ser ignorado.
      
      CONTEXTO DO PEDIDO:
      - Nicho/Tópico: ${niche}
      - Público Alvo: ${audience}
      - Tom de Voz Desejado: ${tone}
      
      ⛔ REGRAS DE OURO (ANTI-IA / ANTI-ROBÔ) - SIGA ESTRITAMENTE:
      1. PROIBIDO USAR PALAVRAS CLICHÊS DE IA: Não use "desvendar", "mergulhar", "elevar", "impulsionar", "navegar", "cenário digital", "revolucionário", "jogo mudou", "tapeçaria".
      2. ZERO "ENCHIMENTO DE LINGUIÇA": Vá direto ao ponto. Corte introduções longas e óbvias.
      3. LINGUAGEM CONVERSACIONAL: Escreva como uma pessoa real fala, não como um artigo acadêmico ou corporativo (a menos que o tom seja 'Consultivo'). Use contrações, perguntas retóricas e ritmo variado.
      4. FOCO NA DOR E DESEJO: Não descreva recursos, descreva transformações e sentimentos.
      5. FORMATAÇÃO VISUAL: Use quebras de linha curtas para facilitar a leitura no celular.

      INSTRUÇÃO DE FORMATO:
      Retorne APENAS um JSON válido.
    `;

    let specificPrompt = "";

    // Mapeamento das ferramentas com instruções de Alta Performance
    switch (tool) {
        case "storytelling":
            specificPrompt = `
                TAREFA: Escreva uma legenda de Instagram PROFUNDA sobre "${niche}" usando a Jornada do Herói.
                
                ESTILO:
                - Comece 'in media res' (no meio da ação), sem introduções chatas.
                - Use detalhes sensoriais (o que viu, ouviu, sentiu).
                - Evite lições de moral óbvias; deixe a história ensinar.
                
                Mapeamento JSON:
                - title: "Storytelling Emocional"
                - hook: A primeira frase deve ser curta e impossível de parar de ler (ex: "Eu quase perdi tudo quando...", "Ninguém te conta isso, mas...").
                - body: [ "Parágrafo 1: O momento de tensão ou dor (Situação).", "Parágrafo 2: A luta interna ou externa (Desafio).", "Parágrafo 3: A virada de chave e a nova realidade (Superação)." ]
                - cta: Uma pergunta genuína sobre a experiência do leitor (não peça apenas 'comente').
                - visualCues: "Foto autêntica, sem filtros excessivos, olhando para o horizonte ou em ação."
            `;
            break;

        case "vendas":
            specificPrompt = `
                TAREFA: Crie um roteiro de 3 Stories de Venda para "${niche}" usando a técnica PAS (Problema - Agitação - Solução).
                
                ESTILO:
                - Não pareça um vendedor de carro usado. Pareça um amigo dando uma dica valiosa.
                - Foco total no RESULTADO final, não nas características do produto.
                - Use gatilhos mentais de Urgência e Exclusividade de forma sutil.
                
                Mapeamento JSON:
                - title: "Sequência de Venda Invisível"
                - hook: "Story 1 (A Dor): Uma pergunta ou afirmação que toque na ferida do cliente (ex: 'Cansado de tentar X e só ter Y?')."
                - body: [ "Story 2 (A Agitação): Mostre por que continuar assim é perigoso/caro. Gere desconforto.", "Story 3 (A Solução): Apresente o produto como o único caminho lógico. Mostre prova social." ]
                - cta: Texto curto e imperativo para o Sticker (ex: "EU QUERO", "MUDAR AGORA").
                - visualCues: "Story 1: Close no rosto preocupado ou print de um problema. Story 3: Print de depoimento ou resultado."
            `;
            break;

        case "hater":
            specificPrompt = `
                TAREFA: Crie 3 respostas GENIAIS para o comentário hater: "${niche}".
                
                ESTILO:
                - Inteligência emocional nível máximo.
                - Não demonstre raiva. A melhor resposta é aquela que faz o hater parecer bobo ou que mostra sua superioridade calma.
                
                Mapeamento JSON:
                - title: "Gestão de Crise (Haters)"
                - hook: "Opção 1 (Deboche Fino): Uma resposta curta, seca e irônica que desmantela o argumento."
                - body: [ "Opção 2 (Profissional/Educativa): Corrija o hater com dados e polidez excessiva (mata na bondade).", "Opção 3 (Humanizada): Concorde parcialmente e redirecione (Técnica Judo)." ]
                - cta: "Recomendação: Se for muito ofensivo, o silêncio (bloqueio) é a melhor resposta."
                - visualCues: "Responda em vídeo com um sorriso leve no rosto, demonstrando que não foi afetado."
            `;
            break;

        case "polemica":
            specificPrompt = `
                TAREFA: Gere 3 opiniões 'Unpopular Opinions' (Impopulares) sobre "${niche}" para viralizar.
                
                ESTILO:
                - Seja contrarianista: Fale o oposto do que os 'gurus' falam.
                - Use a estrutura: "Todo mundo diz X, mas a verdade é Y".
                - Não seja ofensivo, seja intelectualmente provocativo.
                
                Mapeamento JSON:
                - title: "Opiniões Polêmicas (Viral)"
                - hook: A opinião mais chocante e contrária ao senso comum.
                - body: [ "Opinião 2: Uma crítica a uma ferramenta ou método popular.", "Opinião 3: Uma previsão dura sobre o futuro do nicho." ]
                - cta: "Pergunte: 'Você concorda ou eu tô viajando?' (Gera briga nos comentários = engajamento)."
                - visualCues: "Corte rápido, fale perto da câmera, tom de voz incisivo e sério."
            `;
            break;

        case "simples":
            specificPrompt = `
                TAREFA: Explique "${niche}" como se eu tivesse 10 anos (ELI5).
                
                ESTILO:
                - Use metáforas do cotidiano (cozinha, trânsito, escola, jogos).
                - Zero "economês", "juridiquês" ou termos técnicos.
                - Frases curtas. Ritmo rápido.
                
                Mapeamento JSON:
                - title: "Explicação Simplificada"
                - hook: "Imagine que [Conceito] é igual a [Metáfora Divertida]..."
                - body: [ "Desenvolvimento da metáfora (Parte 1).", "Conexão com a realidade (Parte 2).", "Conclusão simples." ]
                - cta: "Fez sentido agora? Manda pra quem precisa entender isso."
                - visualCues: "Use objetos reais para demonstrar (copos, canetas) ou desenhe num guardanapo."
            `;
            break;

        case "bio":
            specificPrompt = `
                TAREFA: Crie 3 Bios de Instagram de Alta Conversão para "${niche}".
                
                ESTILO:
                - Estrutura: Autoridade + O que eu faço por você (Promessa) + CTA.
                - Use emojis com parcimônia (estratégicos).
                - Foco em autoridade e clareza imediata.
                
                Mapeamento JSON:
                - title: "Bios Magnéticas"
                - hook: Opção 1 (Foco em Transformação): "Ajudo [Público] a [Resultado] sem [Dor]."
                - body: [ "Opção 2 (Minimalista/Autoridade): Cargo | Resultado Específico | Prova Social.", "Opção 3 (Criativa/Humanizada): Uma frase de impacto sobre seus valores + O que você vende." ]
                - cta: "CTA Curto: 'Comece aqui 👇' ou 'Acesse 👇'"
                - visualCues: "Foto de perfil: Fundo de cor sólida contrastante e sorriso confiante (dentes aparecendo)."
            `;
            break;

        case "hashtags":
            specificPrompt = `
                TAREFA: Selecione as 30 melhores Hashtags estratégicas para "${niche}".
                
                ESTILO:
                - Misture hashtags de cauda longa (específicas) e cauda curta (amplas).
                - Evite hashtags banidas ou em inglês se o público for BR.
                
                Mapeamento JSON:
                - title: "Estratégia de Hashtags SEO"
                - hook: "🔥 Ouro: As 5 hashtags que vão trazer o público comprador."
                - body: [ "#AltaProcura (10 tags)", "#NichoEspecifico (10 tags)", "#Localização/Comunidade (10 tags)" ]
                - cta: "Dica: Coloque no primeiro comentário logo após postar, não na legenda."
                - visualCues: "Não repita o mesmo grupo de hashtags todo dia para evitar shadowban."
            `;
            break;

        case "hooks":
            specificPrompt = `
                TAREFA: Crie 10 Headlines (Manchetes) de "Pare o Scroll" sobre "${niche}".
                
                ESTILO:
                - Use Curiosidade, Medo ou Ganância.
                - Use números específicos (ex: "R$ 342" em vez de "Dinheiro").
                - Palavras de poder: Segredo, Erro, Nunca, Perigoso, Ridículo.
                
                Mapeamento JSON:
                - title: "Headlines Virais"
                - hook: A headline mais forte de todas (Estilo 'Clickbait Ético').
                - body: [ "Headline 2 (Lista)", "Headline 3 (Negatividade)", "Headline 4 (Como Fazer)", "Headline 5 (Revelação)", "...até 10" ]
                - cta: "Use essas frases na CAPA do vídeo, bem grande."
                - visualCues: "Texto Branco com contorno preto ou fundo amarelo chama mais atenção."
            `;
            break;

        case "ideas":
            specificPrompt = `
                TAREFA: Crie um Calendário Editorial de 30 dias para "${niche}" focado em crescimento rápido.
                
                ESTILO:
                - Alterne entre: Conteúdo Educativo, Entretenimento, Venda e Conexão.
                - Títulos que gerem vontade de clicar.
                
                Mapeamento JSON:
                - title: "Plano de Crescimento 30 Dias"
                - hook: "O Foco do Mês: Construir Autoridade e Vender."
                - body: [ "Semana 1 (Atração): Lista de 7 ideias de títulos virais.", "Semana 2 (Conexão): Lista de 7 ideias de histórias/bastidores.", "Semana 3 (Autoridade): Lista de 7 ideias de 'Como fazer' ou 'Mitos'.", "Semana 4 (Venda): Lista de 9 ideias de quebra de objeção e oferta." ]
                - cta: "A consistência vence o talento. Postes todos os dias."
                - visualCues: "Planeje um dia da semana apenas para gravar tudo."
            `;
            break;

        case "viral_script":
        default:
            specificPrompt = `
                TAREFA: Escreva um Roteiro de Vídeo Curto (Reels/TikTok) sobre "${niche}" que prenda a atenção do início ao fim.
                
                ESTILO:
                - Fale diretamente com o espectador ("Você").
                - Use frases curtas e impactantes.
                - Linguagem falada, natural, com gírias leves se o público permitir.
                - RITMO ACELERADO.
                
                Mapeamento JSON:
                - title: Título Interno do Roteiro
                - hook: (0-3s) Uma frase que quebre o padrão e gere curiosidade imediata (Nada de "Oi galera").
                - body: [ "Retenção (3-15s): Entregue valor rápido, sem enrolação. Dê o contexto.", "Recompensa (15-45s): O 'pulo do gato', a dica de ouro ou a revelação final." ]
                - cta: Um pedido de engajamento específico e criativo (nada de "curte e compartilha" genérico).
                - visualCues: "Corte a cada 2 segundos. Use B-Rolls ou mude o ângulo da câmera. Legendas dinâmicas."
            `;
            break;
    }

    const finalPrompt = baseContext + specificPrompt;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            body: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cta: { type: Type.STRING },
            visualCues: { type: Type.STRING }
          },
          required: ["title", "hook", "body", "cta", "visualCues"]
        }
      }
    });

    const script = JSON.parse(result.text);
    return response.status(200).json(script);

  } catch (error) {
    console.error("Erro na API:", error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}