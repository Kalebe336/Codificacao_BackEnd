const app = {
    render() {
        let prods = DB.get('produtos');
        const busca = document.getElementById('buscaProd').value.toLowerCase();
        const cat = document.getElementById('filtroCat').value;
        const ordem = document.getElementById('filtroOrdem').value;

        prods = prods.filter(p => p.nome.toLowerCase().includes(busca) && (cat === "" || p.categoria === cat));
        prods.sort((a, b) => ordem === 'asc' ? a.preco - b.preco : b.preco - a.preco);

        const container = document.getElementById('listaProdutos');
        container.innerHTML = prods.map(p => {
            // Cálculo da média de estrelas
            const totalNotas = p.avaliacoes.reduce((a, b) => a + b, 0);
            const media = p.avaliacoes.length > 0 ? Math.round(totalNotas / p.avaliacoes.length) : 0;
            
            return `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 card-prod shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between">
                            <small class="text-muted">${p.categoria}</small>
                            <small class="${p.estoque <= 3 ? 'text-danger fw-bold' : 'text-secondary'}">Estoque: ${p.estoque}</small>
                        </div>
                        <h6 class="fw-bold my-1">${p.nome}</h6>
                        <div class="star mb-2" onclick="app.prepararAvaliacao(${p.id})" data-bs-toggle="modal" data-bs-target="#modalAvaliar" title="Clique para avaliar">
                            ${'★'.repeat(media)}${'☆'.repeat(5 - media)} 
                            <small class="text-muted">(${p.avaliacoes.length})</small>
                        </div>
                        <p class="text-success fw-bold flex-grow-1">R$ ${p.preco.toFixed(2)}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-sm btn-dark" onclick="app.addCarrinho(${p.id})">Comprar</button>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-secondary" onclick="app.editarProduto(${p.id})" data-bs-toggle="modal" data-bs-target="#modalGerenciar">✏️</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="app.excluirProduto(${p.id})">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    // CARRINHO E COMPRA
    addCarrinho(id) {
        const prods = DB.get('produtos');
        const produto = prods.find(p => p.id === id);

        if (produto.estoque <= 0) {
            alert("⚠️ Produto esgotado!");
            return;
        }

        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        cart.push(id);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        this.updateCartCount();
        
        // MENSAGEM DE VALIDAÇÃO (Toast ou Alert)
        alert(`✅ ${produto.nome} adicionado ao carrinho!`);
    },

    updateCartCount() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        document.getElementById('cart-count').innerText = cart.length;
    },

    abrirCarrinho() {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const prods = DB.get('produtos');
        const list = document.getElementById('cart-items-list');
        if (cart.length === 0) { list.innerHTML = "<p class='text-center'>Carrinho vazio</p>"; return; }
        
        let total = 0;
        list.innerHTML = cart.map(id => {
            const p = prods.find(x => x.id == id);
            total += p.preco;
            return `<div class="d-flex justify-content-between border-bottom py-1"><span>${p.nome}</span><b>R$ ${p.preco.toFixed(2)}</b></div>`;
        }).join('') + `<div class="text-end fw-bold mt-2 fs-5">Total: R$ ${total.toFixed(2)}</div>`;
    },

    finalizarPedido() {
        if (!sessionStorage.getItem('session_user')) {
            alert("⚠️ Bloqueado: Faça login para finalizar sua compra!");
            bootstrap.Modal.getInstance(document.getElementById('modalCarrinho')).hide();
            auth.toggleLoginForm();
            return;
        }

        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        let prods = DB.get('produtos');

        // ATUALIZAÇÃO DO ESTOQUE
        cart.forEach(cartId => {
            const idx = prods.findIndex(p => p.id == cartId);
            if (idx !== -1 && prods[idx].estoque > 0) {
                prods[idx].estoque -= 1; // Deduz 1 unidade
            }
        });

        DB.set('produtos', prods); // Salva o novo estoque no LocalStorage
        alert("🎉 Compra finalizada! O estoque foi atualizado.");
        
        sessionStorage.removeItem('cart');
        this.render(); // Atualiza a tela para mostrar o novo estoque
        this.updateCartCount();
        bootstrap.Modal.getInstance(document.getElementById('modalCarrinho')).hide();
    },

    // GESTÃO E AVALIAÇÃO
    prepararAvaliacao(id) {
        document.getElementById('avaliarProdId').value = id;
    },

    salvarAvaliacao() {
        const id = document.getElementById('avaliarProdId').value;
        const nota = parseInt(document.getElementById('notaEstrela').value);
        let prods = DB.get('produtos');
        const idx = prods.findIndex(p => p.id == id);

        if (idx !== -1) {
            prods[idx].avaliacoes.push(nota); // Adiciona a nova nota
            DB.set('produtos', prods); // Salva no LocalStorage
            
            alert("⭐ Obrigado pela avaliação!");
            bootstrap.Modal.getInstance(document.getElementById('modalAvaliar')).hide();
            this.render(); // RE-RENDERIZA PARA ATUALIZAR AS ESTRELAS NA TELA
        }
    },

    salvarProduto() {
        const id = document.getElementById('prodId').value;
        let prods = DB.get('produtos');

        const p = {
            id: id ? parseInt(id) : Date.now(),
            nome: document.getElementById('prodNome').value,
            preco: parseFloat(document.getElementById('prodPreco').value),
            estoque: parseInt(document.getElementById('prodEstoque').value),
            categoria: document.getElementById('prodCat').value,
            desc: document.getElementById('prodDesc').value,
            avaliacoes: id ? prods.find(x => x.id == id).avaliacoes : [5]
        };

        if (id) {
            const idx = prods.findIndex(x => x.id == id);
            prods[idx] = p;
        } else {
            prods.push(p);
        }

        DB.set('produtos', prods);
        bootstrap.Modal.getInstance(document.getElementById('modalGerenciar')).hide();
        this.render();
    },

    editarProduto(id) {
        const p = DB.get('produtos').find(x => x.id == id);
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodNome').value = p.nome;
        document.getElementById('prodPreco').value = p.preco;
        document.getElementById('prodEstoque').value = p.estoque;
        document.getElementById('prodCat').value = p.categoria;
        document.getElementById('prodDesc').value = p.desc;
        document.getElementById('tituloModal').innerText = "Editar Produto";
    },

    excluirProduto(id) {
        if(confirm("Excluir este produto?")) {
            DB.set('produtos', DB.get('produtos').filter(x => x.id != id));
            this.render();
        }
    },

    limparForm() {
        document.getElementById('prodId').value = "";
        document.querySelectorAll('#modalGerenciar input, #modalGerenciar textarea').forEach(i => i.value = "");
        document.getElementById('tituloModal').innerText = "Novo Produto";
    }
};

const bot = {
    pergunta() {
        const i = document.getElementById('chat-input');
        const b = document.getElementById('chat-body');
        const m = i.value.toLowerCase();
        let r = "Tente 'entrega', 'pagamento' ou 'admin'.";
        if (m.includes("entrega")) r = "Entregamos em até 5 dias.";
        if (m.includes("pagamento")) r = "Aceitamos Pix e Cartão.";
        if (m.includes("admin")) r = "User: admin | Pass: 123";
        
        b.innerHTML += `<div class='text-end'><b>Você:</b> ${i.value}</div>`;
        b.innerHTML += `<div class='text-primary'><b>Bot:</b> ${r}</div>`;
        i.value = "";
        b.scrollTop = b.scrollHeight;
    }
};

function toggleChat() {
    const c = document.getElementById('chatbot-window');
    c.style.display = c.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    app.render();
    app.updateCartCount();
});