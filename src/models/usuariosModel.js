import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        senha: { type: String, required: true },
        tokenRecuperacaoSenha: { type: String, select: false },
        expiracaoTokenRecuperacao: { type: Date, select: false },
    },
    {
        timestamps: true,
    },
);

const usuarios = mongoose.model("usuarios", usuariosSchema);

export default usuarios;
