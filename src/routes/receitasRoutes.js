// routes/receitasRoutes.js
import express from "express";
import ReceitaController from "../controllers/receitasDbController.js"
// import upload from "../config/uploadImagem.js";

const routes = express.Router()

// Rotas
// Listar receitas
routes.get("/receitas", ReceitaController.listarReceitas);//Todas
routes.get("/receitas/:id", ReceitaController.listarReceitaPorId);//Por Id

// Gerar receita com IA
routes.post("/receitas/ia", ReceitaController.perguntaReceita);

// Cadastrar receita
routes.post("/receitas", ReceitaController.cadastrarReceita);

// Atualiza receita
routes.put("/receitas/:id",  ReceitaController.atualizarReceita);

// Deletar receita
routes.delete("/receitas/:id", ReceitaController.excluirReceita);




export default routes;
