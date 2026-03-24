import express from "express";
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Bem-vindo à sua nova API, use com sabedoria.");
})
