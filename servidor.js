import express from "express";
import "dotenv/config";
import cors from "cors";

import receitasRoute from "./routes/receita.route.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin: "*",
        // "http://localhost:5173"
    }),
);
app.use(express.json());




// teste rota
app.get("/", (req, res) => {
    res.json({ mensagem: "Olá! Bem-vindo à API de Receitas!" });
});

app.use("/api/receitas", receitasRoute);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
