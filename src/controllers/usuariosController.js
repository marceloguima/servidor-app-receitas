// import usuarios from "../models/usuariosModel.js";
// import bcrypt from "bcrypt";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// class usuariosController {
//     static async cadastrarUsuario(req, res) {
//         try {
//             const dadosUsuario = req.body;

//             // Verificar se o email já existe no banco
//             const usuarioExistente = await usuarios.findOne({
//                 email: dadosUsuario.email,
//             });
//             if (usuarioExistente) {
//                 return res.status(400).json({
//                     mensagem:
//                         "Você já possui uma conta, faça login e aproveite.",
//                 });
//             }

//             // Adiciona uma camada de segurança misturando a senha com um "salt" aleatório
//             const salt = await bcrypt.genSalt(10);
//             const senhaHasheada = await bcrypt.hash(dadosUsuario.senha, salt);

//             // Preparamos os dados para o banco garantindo que a senha real nunca seja salva
//             const usuarioParaSalvar = {
//                 nome: dadosUsuario.nome,
//                 email: dadosUsuario.email,
//                 senha: senhaHasheada,
//             };

//             const novoUsuario = await usuarios.create(usuarioParaSalvar);

//             // Retornamos sucesso (repare que não devolvemos a senha pro Front)
//             res.status(201).json({
//                 mensagem: "Usuario cadastrado com sucesso.",
//                 usuario: {
//                     id: novoUsuario._id,
//                     nome: novoUsuario.nome,
//                     email: novoUsuario.email,
//                 },
//             });
//         } catch (erro) {
//             res.status(500).json({
//                 mensagem: `${erro.message} - Falha ao cadastrar usuario`,
//             });
//             console.erro(erro);
//         }
//     }

//     static async logarUsuario(req, res) {
//         try {
//             const { email, senha } = req.body;
//             // verifica se o usuario existe
//             const usuarioEncontrado = await usuarios.findOne({
//                 email: email,
//             });

//             if (!usuarioEncontrado) {
//                 return res.status(404).json({
//                     mensagem:
//                         "Email não encontrado. Crie uma conta agora, é simples!",
//                 });
//             }

//             // compara com o Hash que tá salvo lá no banco de dados.
//             const senhaCorreta = await bcrypt.compare(
//                 senha,
//                 usuarioEncontrado.senha,
//             );

//             if (!senhaCorreta) {
//                 return res.status(401).json({
//                     mensagem: "Senha incorreta. Tente novamente.",
//                     // Vou adicionar limite aqui para evitar ataques de força bruta
//                 });
//             }

//             // Se passou, libera!
//             res.status(200).json({
//                 mensagem: `Bem-vindo ${usuarioEncontrado.nome}!`,
//                 usuario: {
//                     id: usuarioEncontrado._id,
//                     nome: usuarioEncontrado.nome,
//                     email: usuarioEncontrado.email,
//                 },
//             });
//         } catch (erro) {
//             console.error(erro);
//             res.status(500).json({
//                 mensagem: `${erro.message} - Falha ao fazer login`,
//             });
//         }
//     }

//     static async recuperarConta(req, res) {
//         try {
//             const { email } = req.body;
//             const usuarioEncontrado = await usuarios.findOne({
//                 email: email,
//             });
//             const mensagemPadrao =
//                 "Se esse email estiver cadastrado, você receberá instruções para recuperar sua conta.";

//             // se o email não estiver cadastrado, por segurança, não revelamos isso. Enviamos a mesma mensagem de sucesso para evitar que hackers descubram quais emails estão cadastrados.
//             if (!usuarioEncontrado) {
//                 return res.status(200).json({
//                     mensagem: mensagemPadrao,
//                 });
//             }

//             const tokenRecuperacao = crypto.randomBytes(20).toString("hex");
//             const expiracaoToken = new Date();
//             expiracaoToken = new Date(Date.now() + 60 * 60 * 1000);  

//             const resposta = await usuarios.findByIdAndUpdate(
//                 usuarioEncontrado._id,
//                 {
//                     tokenRecuperacaoSenha: tokenRecuperacao,
//                     expiracaoTokenRecuperacao: expiracaoToken,
//                 },
//             );

//             const linkDeRecuperacao = `http://localhost:5173/redefinir-senha/${tokenRecuperacao}`;

//             const transport = nodemailer.createTransport({
//                 host: "sandbox.smtp.mailtrap.io",
//                 port: 2525,
//                 auth: {
//                     user: "7f8c0fb7a23ee9",
//                     pass: "9deb9ac2bc7c6f",
//                 },
//             });

//             const emailConfigs = {
//                 from: '"Equipe de Suporte" <suporte@ideiadesabor.com>',
//                 to: usuarioEncontrado.email,
//                 subject: "Instruções para Recuperação de Conta",

//                 html: `
//         <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: 0 auto;">
//             <h2>Olá! Esqueceu sua senha?</h2>
//             <p>Não se preocupe, a gente te ajuda. Clique no botão abaixo para criar uma nova senha:</p>
            
//             <a href="${linkDeRecuperacao}" style="background-color: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; font-weight: bold;">
//                 Redefinir Minha Senha
//             </a>
            
//             <p style="margin-top: 30px; font-size: 12px; color: #888;">Se você não solicitou essa recuperação, desconsidere este email.</p>
//         </div>
//     `,
//             };

//             await transport.sendMail(emailConfigs);
//             console.log(
//                 "Email de recuperação enviado para:",
//                 usuarioEncontrado.email,
//             );

//             // Retornamos a resposta final de sucesso pro Front
//             return res.status(200).json({ mensagem: mensagemPadrao });
//         } catch (erro) {
//             console.error(erro);
//             res.status(500).json({
//                 mensagem: `${erro.message} - Falha ao recuperar conta`,
//             });
//         }
//     }
// }
// export default usuariosController;



import usuarios from "../models/usuariosModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

class usuariosController {
    static async cadastrarUsuario(req, res) {
        try {
            const dadosUsuario = req.body;

            // Verifica duplicidade antes de hashear — evita custo desnecessário
            // de CPU no bcrypt caso o email já exista.
            const usuarioExistente = await usuarios.findOne({
                email: dadosUsuario.email,
            });
            if (usuarioExistente) {
                return res.status(400).json({
                    mensagem: "Você já possui uma conta, faça login e aproveite.",
                });
            }

            // saltRounds=10 é o balanço recomendado entre segurança e latência (~100ms).
            // Considere aumentar para 12 em produção se o hardware permitir.
            const salt = await bcrypt.genSalt(10);
            const senhaHasheada = await bcrypt.hash(dadosUsuario.senha, salt);

            const usuarioParaSalvar = {
                nome: dadosUsuario.nome,
                email: dadosUsuario.email,
                senha: senhaHasheada,
            };

            const novoUsuario = await usuarios.create(usuarioParaSalvar);

            // A resposta omite a senha mesmo que o ORM a inclua por padrão.
            res.status(201).json({
                mensagem: "Usuario cadastrado com sucesso.",
                usuario: {
                    id: novoUsuario._id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email,
                },
            });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: `${erro.message} - Falha ao cadastrar usuario`,
            });
        }
    }

    static async logarUsuario(req, res) {
        try {
            const { email, senha } = req.body;

            const usuarioEncontrado = await usuarios.findOne({ email });

            if (!usuarioEncontrado) {
                return res.status(404).json({
                    mensagem: "Email não encontrado. Crie uma conta agora, é simples!",
                });
            }

            // bcrypt.compare é timing-safe: leva o mesmo tempo independente do
            // resultado, dificultando ataques de timing side-channel.
            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

            if (!senhaCorreta) {
                // TODO: implementar rate limiting por IP/email para mitigar força bruta.
                return res.status(401).json({
                    mensagem: "Senha incorreta. Tente novamente.",
                });
            }

            // A resposta omite a senha mesmo que o ORM a inclua por padrão.
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

    static async recuperarConta(req, res) {
        try {
            const { email } = req.body;
            const usuarioEncontrado = await usuarios.findOne({ email });

            // Resposta idêntica para email existente ou não — evita user enumeration,
            // onde um atacante testa emails para descobrir quem tem conta.
            const mensagemPadrao =
                "Se esse email estiver cadastrado, você receberá instruções para recuperar sua conta.";

            if (!usuarioEncontrado) {
                return res.status(200).json({ mensagem: mensagemPadrao });
            }

            // 20 bytes = 40 chars hex — suficiente para ser criptograficamente
            // imprevisível. crypto.randomBytes usa entropia do SO, não Math.random().
            const tokenRecuperacao = crypto.randomBytes(20).toString("hex");

            // Date.now() retorna UTC em ms, eliminando dependência de fuso horário
            // do servidor. 30 min é conservador: curto o suficiente para reduzir
            // risco se o email for interceptado, longo o suficiente para o usuário agir.
            const expiracaoToken = new Date(Date.now() + 30 * 60 * 1000);

            // Salvar novo token invalida automaticamente qualquer token anterior
            // (last-write-wins), evitando tokens paralelos ativos.
            await usuarios.findByIdAndUpdate(usuarioEncontrado._id, {
                tokenRecuperacaoSenha: tokenRecuperacao,
                expiracaoTokenRecuperacao: expiracaoToken,
            });

            const linkDeRecuperacao = `${process.env.FRONTEND_URL}/redefinir-senha/${tokenRecuperacao}`;

            // Credenciais carregadas exclusivamente do .env — evita hardcoding e facilita mudanças sem deploy.
            const transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const emailConfigs = {
                from: '"Equipe de Suporte" <onboarding@resend.dev>',
                to: usuarioEncontrado.email,
                subject: "Instruções para Recuperação de Conta",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: 0 auto;">
                        <h2>Olá! Esqueceu sua senha?</h2>
                        <p>Não se preocupe, a equipe do Ideia de Sabor te ajuda. Clique no botão abaixo para criar uma nova senha:</p>
                        
                        <a href="${linkDeRecuperacao}" style="background-color: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 15px; font-weight: bold;">
                            Redefinir Minha Senha
                        </a>

                        <p style="margin-top: 20px; font-size: 13px; color: #555;">
                            Este link expira em <strong>30 minutos</strong>.
                        </p>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #888;">
                            Se você não solicitou essa recuperação, desconsidere este email.
                        </p>
                    </div>
                `,
            };

            await transport.sendMail(emailConfigs);
            console.log("Email de recuperação enviado para:", usuarioEncontrado.email);

            return res.status(200).json({ mensagem: mensagemPadrao });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                mensagem: `${erro.message} - Falha ao recuperar conta`,
            });
        }
    }
}

export default usuariosController;