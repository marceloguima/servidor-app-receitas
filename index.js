// index.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import receitasRoute from "./routes/receita.route.js";

import conectaBaseDados from "./src/config/dbConect.js";
import routes from "./src/routes/index.js";


// conexão com MONGO DB
const conexao = await conectaBaseDados();

conexao.on("error", (error) => {
    console.error("erro de conexão", error);
});

conexao.once("open", () => {
    console.log("Conectado ao banco com sucesso!");
});


const app = express();
routes(app)




const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin: "*",
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
