import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração para ler JSON no corpo das requisições
app.use(express.json());

// Mock de dados (Simulando o Banco de Dados na memória)
let chats = [
  {
    id: "order-101",
    orderStatus: "A caminho",
    driver: { name: "Carlos Silva", phone: "(11) 99999-8888" },
    customer: { name: "Ana Souza" },
    messages: [
      { id: 1, sender: "system", text: "Pedido retirado pelo entregador.", timestamp: "20:15" },
      { id: 2, sender: "driver", text: "Olá Ana, estou a caminho do seu endereço!", timestamp: "20:16" },
      { id: 3, sender: "customer", text: "Legal, Carlos! O interfone está com defeito, pode me ligar quando chegar?", timestamp: "20:18" }
    ]
  },
  {
    id: "order-102",
    orderStatus: "Preparando",
    driver: null,
    customer: { name: "Bruno Lima" },
    messages: [
      { id: 1, sender: "system", text: "Pedido confirmado pelo restaurante.", timestamp: "20:30" }
    ]
  }
];

// --- ROTAS DA API ---

// 1. Listar todos os chats/pedidos ativos
app.get('/api/chats', (req, res) => {
  res.json(chats);
});

// 2. Buscar os detalhes de um chat específico pelo ID do pedido
app.get('/api/chats/:orderId', (req, res) => {
  const chat = chats.find(c => c.id === req.params.orderId);
  if (!chat) {
    return res.status(404).json({ error: "Chat/Pedido não encontrado." });
  }
  res.json(chat);
});

// 3. Enviar uma nova mensagem em um chat
app.post('/api/chats/:orderId/messages', (req, res) => {
  const { orderId } = req.params;
  const { sender, text } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ error: "Os campos 'sender' e 'text' são obrigatórios." });
  }

  const chat = chats.find(c => c.id === orderId);
  if (!chat) {
    return res.status(404).json({ error: "Chat não encontrado." });
  }

  // Gerando um timestamp simples (HH:MM)
  const now = new Date();
  const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMessage = {
    id: chat.messages.length + 1,
    sender,
    text,
    timestamp
  };

  chat.messages.push(newMessage);
  res.status(201).json(newMessage);
});

// --- SERVIR INTERFACE FRONT-END (OPCIONAL) ---
// Configuração para servir arquivos estáticos de uma pasta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});