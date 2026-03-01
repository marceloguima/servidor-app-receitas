import usuarios from "../models/usuariosModel.js";

class usuariosController {
    static async cadastrarUsuario(req, res) {
        try {
            const dadosUsuario = req.body;

            // Verificar se usuário já existe no banco
            const usuarioExistente = await usuarios.findOne({
                email: dadosUsuario.email,
            });
            if (usuarioExistente) {
                return res.status(400).json({
                    mensagem:
                        "Você já possui uma conta, faça login e aproveite.",
                });
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
            console.erro(erro);
        }
    }

    static async logarUsuario(req, res) {
        try {
            const { email, senha } = req.body;
            // verifica se o usuario existe
            const usuarioEncontrado = await usuarios.findOne({
                email: email
            });
            
            if (!usuarioEncontrado) {
                return res.status(404).json({
                    mensagem:
                    "Email não encontrado. Crie uma conta agora, é simples!",
                });
            }
            
            // veriifica senha
            if (usuarioEncontrado.senha !== senha) {
                return res.status(401).json({
                    mensagem: "Senha incorreta. Tente novamente.",
                });
            }
            
            // se passou libera
            res.status(200).json({
                mensagem: `Bem-vindo ${usuarioEncontrado.nome}!`,
                
                // retorna o usuário "sem senha" por questões de segurança.
                usuario: {
                    id: usuarioEncontrado._id,
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email,
                },
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: `${erro.message} - Falha ao fazer login`,
            });
        }
    }
}
export default usuariosController;
