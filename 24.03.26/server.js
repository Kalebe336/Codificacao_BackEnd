import express from "express";
import gameRoutes from "./src/routes/gameRoutes.js";

const app = express();
app.use(express.json());

app.use("/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Jogos!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
