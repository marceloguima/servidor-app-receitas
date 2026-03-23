import usuarios from "../models/usuariosModel.js";
import bcrypt from "bcrypt";

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

            // criptografar senha
            const salt = await bcrypt.genSalt(10);

            const senhaHasheada = await bcrypt.hash(dadosUsuario.senha, salt);

            const usuarioParaSalvar = {
                nome: dadosUsuario.nome,
                email: dadosUsuario.email,
                senha: senhaHasheada, // <-- Senha blindada!
            };

            const novoUsuario = await usuarios.create(usuarioParaSalvar);

            // Retornamos sucesso (repare que não devolvemos a senha pro Front)
            res.status(201).json({
                message: "Usuario cadastrado com sucesso.",
                usuario: {
                    id: novoUsuario._id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                },
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
                email: email,
            });

            if (!usuarioEncontrado) {
                return res.status(404).json({
                    mensagem:
                        "Email não encontrado. Crie uma conta agora, é simples!",
                });
            }

            // e compara com o Hash que tá salvo lá no banco de dados.
            const senhaCorreta = await bcrypt.compare(
                senha,
                usuarioEncontrado.senha,
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    mensagem: "Senha incorreta. Tente novamente.",
                });
            }

            // Se passou, libera!
            res.status(200).json({
                mensagem: `Bem-vindo ${usuarioEncontrado.nome}!`,
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
