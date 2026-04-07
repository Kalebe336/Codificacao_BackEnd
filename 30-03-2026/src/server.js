import express from 'express'
import fruitRoutes from './routes/fruitRoutes.js'

const app = express()
const port = 3000

app.use(express.json())

//rotas
app.use("/fruits", fruitRoutes)

app.listen(port, () => {
    console.log(`O servidor está rodando em http://localhost:${port}`);

})

