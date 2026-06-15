import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

// CONFIGURAÇÃO PARA LER json NO CORPO DAS REQUISIÇÕES

let chats = [
    {
        id: "order-101",
        orderStatus: "A caminho",
        driver:{ name: "Carlos Billagram", phone: "(11) 99999-9999" },
        customer:{ name: "Ana Souza"},
        mensagens:[
            { id:1, sender:"system", text:"Pedido em processo ...", timestamp:"20:15:00"},
            { id:2, sender:"driver", text:"Olá, sou Carlos, seu motorista. Estou a caminho do restaurante para pegar seu pedido.", timestamp:"20:16:00"},
           
        ]
    }
];

//LISTAR TODOS OS CHATS/ PEDIDOS ATIVOS

app.get('api/chats', (req, res) => {
    res.json(chats)
    const chat = chats.find (c=>c.id === req.params.orderId)

});

//BUSCAR OS DETALHES DE UM CHAT/ PEDIDO ESPECÍFICO

app.get('api/chats/:orderId', (req, res) => {
    
    const chat = chats.find (c=>c.id === req.params.orderId)
if(!chat){
    return res.status(404).json
}
});

//ADICIONAR UMA NOVA MENSAGEM A UM CHAT/ PEDIDO

app.post('api/chats/:orderId/messages', (req, res) => {
    const {orderId} = req.params; 
    const {sender, text} = req.body;
if(!sender || !text){
    return res.status(400).json({error: "Sender e text são obrigatórios"})}

const chat = chats.find (c=>c.id === orderId)
if(!chat){
    return res.status(404).json({error: "Chat não encontrado"})}
});

//GERANDO UM TIME STAMP SIMPLES

const now = new Date();
const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

const newMessage = {
    id: chat.mensagens.length + 1,
    sender,
    text,
    timestamp
};

const __filrname = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filrname);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: http://localhost:${PORT}`)
});

