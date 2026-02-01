// receitasModel
import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        descricao: { type: String, required: true },
        tempoPreparo: { type: Number, required: true },
        porcoes: { type: Number, required: true },
        ingredientes: { type: [String], required: true },
        modoPreparo: { type: String, required: true },
        complexidade: {
            type: String,
            enum: ["facil", "media", "dificil"],
            default: "facil",
        },
        categoria: { type: String, required: true },
        imagem: { type: String },
    },
    {
        timestamps: true,
    }
);

const receita = mongoose.model("receitas", receitaSchema);

export default receita;
