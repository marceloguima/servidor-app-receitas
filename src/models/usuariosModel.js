import mongoose from "mongoose";



const usuariosSchema = new mongoose.Schema(
    {
        nome: {type : String, required: true},
        email: {type: String, required: true},
        senha: {type: String, required: true}
    
    },
     {
        timestamps: true,
    },
)

const usuarios = mongoose.model("usuarios", usuariosSchema);

export default usuarios;
