// receitasModel
import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descricao: { type: String, required: true },
        tempoPreparo: { type: Number, required: true },
        porcoes: { type: Number, required: true },
        ingredientes: [
            {
                nome: { type: String, required: true },
                unidade: { type: String },
                quantidade: { type: String }
            }
        ],
        modoPreparo: { type: String, required: true },
        complexidade: {
            type: String,
            enum: ["fácil", "médio", "difícil", "nível chef"],
            default: "fácil",
        },
        categoria: { type: String, required: true },
        imagem: { type: String },
    },
    {
        timestamps: true,
    },
);

const receita = mongoose.model("receitas", receitaSchema);

export default receita;
