import usuarios from "../models/usuariosModel.js";

class usuariosController{
     static async cadastrarUsuario(req, res) {
            try {
                const dadosUsuario = req.body;
             
                // Verificar se usuário já existe no banco
                const usuarioExistente = await usuarios.findOne({ email: dadosUsuario.email });
                if(usuarioExistente){
                    return res.status(400).json({
                        mensagem:"Você já possui uma conta, faça login e aproveite."
                    })
                }
    
                const novoUsuario = await usuarios.create(dadosUsuario);
                res.status(201).json({
                    message: "Usuario cadastrado com sucesso.",
                    usuario: novoUsuario,
                });
            } catch (erro) {
                res.status(500).json({
                    message: `${erro.message} - Falha ao cadastrar usuario`,
                });
                console.erro(erro)
            }
        }
}

export default usuariosController;