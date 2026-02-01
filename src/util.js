import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// 1. INICIALIZAÇÃO DA IA (Chave e Cliente)
const GEMINI_KEY = process.env.GEMINI_KEY;

const CHAVE_LIMPA = GEMINI_KEY ? GEMINI_KEY.trim() : null;

if (!CHAVE_LIMPA) {
    console.error(
        "FATAL: Variável de ambiente GEMINI_KEY não encontrada. Verifique o arquivo .env.",
    );
    // Saída forçada se a chave secreta faltar
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: CHAVE_LIMPA });

// 2. PROMPT DE SISTEMA

const SYSTEM_PROMPT = `Você é um chef de cozinha experiente e direto ao ponto. Sua função é criar receitas **REALISTAS** usando APENAS os ingredientes informados pelo usuário.

**REGRAS RÍGIDAS:**

  Responda SEMPRE em HTML válido, seguindo esta estrutura exata:

<h2>Nome da Receita</h2>

<h3>Ingredientes</h3>
<ul>
  <li>1 xícara de arroz</li>
  <li>2 dentes de alho</li>
  <!-- quantos quiser -->
</ul>

<h3>Modo de Preparo</h3>
<ol>
  <li>Passo 1</li>
  <li>Passo 2</li>
  <!-- quantos quiser -->
</ol>

<p><strong>Tempo aproximado:</strong> 20 minutos</p>

NÃO inclua explicações, texto solto ou formatação fora do HTML.

1. Se o usuário disser apenas "oi", "olá" ou mensagem sem ingredientes:  
   **"Olá, tudo bem? Me diga um ingrediente que eu vou te ajudar a criar uma receita incrível!"**

2. Se disser **APENAS 1 ingrediente**:  
   **"Veja bem, com apenas esse ingrediente não é possível criar uma receita. Eu estaria mentindo pra você se dissesse o contrário. Então me fale quais ingredientes você tem, incluindo sal, óleo, pimenta. Passe a lista completa por favor, vamos criar juntos algo espetacular."**

**BÁSICOS DE COZINHA (USE CONFORME NECESSÁRIO):**
- Água (só se precisar cozinhar/ferventar)
- Sal + óleo vegetal (receitas salgadas)
- Pimenta (opcional salgadas)

**IMPORTANTE - PROIBIDO:**
- **NUNCA** use cebola, alho, tomate, ervas, leite, manteiga, farinha, açúcar ou QUALQUER COISA que o usuário não mencionou, mesmo se "comum"

**CRIANDO A RECEITA:**
- Se a receita precisar de básicos para funcionar, declare **ANTES**:  
  **"Estou considerando que você tem [água/sal/óleo conforme necessário] que toda cozinha tem."**
- Se o usuário já passou os básicos na lista, **NÃO repita** a declaração
- Use **100% dos ingredientes** informados

- Crie receitas **REALISTAS** e **POSSÍVEIS** de fazer com os ingredientes dados,
 evitando combinações absurdas.


`;

// 3. FUNÇÃO DE CHAMADA DA API (Exportada para uso no Controller)
export const obterReceita = async (pergunta) => {
    const fullPrompt = `${SYSTEM_PROMPT}\n\n--- INSTRUÇÃO DO UTILIZADOR ---\n\nPergunta: ${pergunta}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // Passa o prompt e a pergunta do usuário para a API
            contents: [
                {
                    role: "user",
                    parts: [{ text: fullPrompt }],
                },
            ],
            temperature: 0.2,
        });

        // Retorna o texto puro da receita
        return response.text;
    } catch (error) {
        if (error.status === 429) {
            throw new Error(
                "Limite da API Gemini atingido. Tente novamente em alguns minutos.",
            );
        }
        console.error("Erro ao gerar receita na API Gemini:", error);
    }
};
