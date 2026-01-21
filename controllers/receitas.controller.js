import { obterReceita } from "../util.js";
import axios from "axios";

export const perguntaReceita = async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta || pergunta.trim() === "") {
            return res
                .status(400)
                .json({ erro: "Por favor, forneça uma pergunta válida." });
        }

        const resposta = await obterReceita(pergunta);

        res.json({ resposta });
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao obter a receita. Tente novamente mais tarde.",
        });
    }
};

export const listarReceitas = async (req, res) => {
    const q = (req.query.q || "").toLowerCase().trim();

  

    try {
        const response = await axios.get(
            "https://api-receitas-pi.vercel.app/receitas/todas",

            { params: { s : q } }
        );

    

 const items = Array.isArray(response.data)
      ? response.data
      : response.data.items || [];

 const filtrados = q
      ? items.filter((item) =>
          (item.receita || "").toLowerCase().includes(q) ||
          (item.tipo || "").toLowerCase().includes(q)
        )
      : items;

    const receitas = filtrados.map((item) => ({
      id: item.id,
      titulo: item.receita,
      categoria: item.tipo,
      imagem: item.link_imagem,
      ingredientes: item.ingredientes,
      modoPreparo: item.modo_preparo,
      ingredientesBase: item.IngredientesBase?.[0]?.nomesIngrediente || [],
    }));
    res.json(receitas);

    


    } catch (erro) {
        console.error("Erro ao buscar na TheMealDB:", erro.message);
        res.status(500).json({ mensagem: "Erro ao buscar receitas externas" });
    }
};
