import express from 'express';
import fruitRoutes from './routes/fruitRoutes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Montagem das rotas de frutas
app.use('/fruits', fruitRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'API de Frutas' }));

// Middleware de erro (deve vir por último)
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de frutas rodando em http://localhost:${PORT}`);
});

export default app;