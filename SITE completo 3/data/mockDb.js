const adm = {
    usuario: "admin",
    senha: "123"
};

const produtos = [
    {
        nome: "colar",
        categoria: "acessórios",
        preco: 50.00
    },
    {
        nome: "brinco",
        categoria: "acessórios",
        preco: 30.00
    },
    {
        nome: "pulseira",
        categoria: "acessórios",
        preco: 40.00
    }
];

const termoDeBusca = "r"; 

const resultado = produtos
    .filter(produto => produto.nome.toLowerCase().includes(termoDeBusca.toLowerCase()))
    .sort((a, b) => b.nome.localeCompare(a.nome)); // O segredo do decrescente está aqui (b antes de a)

console.log(resultado);