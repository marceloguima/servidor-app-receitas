import receita from "../models/receitaModel.js";

class ReceitaController {
    static async listarReceitas(req, res) {
        try {
            const listaReceita = await receita.find({});
            res.status(200).json(listaReceita);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Falha na requisição.`,
            });
        }
    }
    // ----------------------------------------------------------------------------------------

    static async listarReceitaPorId(req, res) {
        try {
            const id = req.params.id.trim();

            const receitaEncontrada = await receita.findById(id);
            res.status(200).json(receitaEncontrada);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Falha na requisição da receita.`,
            });
        }
    }
    // -------------------------------------------------------------------------------------

    static async cadastrarReceita(req, res) {
        try {
            const novaReceita = await receita.create(req.body);
            res.status(201).json({
                message: "Receita cadastrada com sucesso.",
                receita: novaReceita,
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Falha ao cadastrar receita`,
            });
        }
    }

    // --------------------------------------------------------------------------------------

    static async atualizarReceita(req, res) {
        try {
            const id = req.params.id.trim();

            const receitaAtualizada = await receita.findByIdAndUpdate(
                id,
                req.body,
            );
            res.status(200).json({
                message: "Receita atualizada com sucesso.",
                receita: receitaAtualizada,
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} -Falha na atualização de receita.`,
            });
        }
    }

    // ----------------------------------------------------------------------

    static async excluirReceita(req, res) {
        try {
            const id = req.params.id.trim();

            await receita.findByIdAndDelete(id);
            res.status(200).json({
                message: "Receita excluida com sucesso.",
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Falha ao excluir receita.`,
            });
        }
    }
}

export default ReceitaController;
