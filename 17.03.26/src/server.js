import express from "express";
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Frutas! Use /fruits para ver a lista de frutas.");
})

