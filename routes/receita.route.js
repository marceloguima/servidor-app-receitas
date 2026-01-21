import express from "express";
import {perguntaReceita, listarReceitas} from "../controllers/receitas.controller.js";

const router = express.Router();

// Na home lista receitas/busca
router.get("/", listarReceitas);

// assistente de IA, gera receitas apartir de ingredintes em uma conversa com o usuário.
router.post("/", perguntaReceita);

export default router;