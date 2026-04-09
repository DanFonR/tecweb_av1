// Gerenciador de Itens (Armazenamento em Memória da Sessão)
const Armazenamento = {
    getItens() {
        const itens = localStorage.getItem('lista_itens');

        return itens ? JSON.parse(itens) : [];
    },

    salvarItem(nome) {
        const itens = this.getItens();

        if (itens.some(item => item === nome)) return false;

        itens.push(nome);
        localStorage.setItem('lista_itens', JSON.stringify(itens));

        return true;
    },

    deletarItem(nome) {
        const itens = this.getItens();
        const novoItens = itens.filter(item => item !== nome);

        localStorage.setItem('lista-itens', JSON.stringify(novoItens));
    }
};

// Lógica para a página de Cadastro
const formCadastro = document.getElementById('cadastro-itens');
if (formCadastro) {
    const inputItem = document.getElementById('item');
    
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        const valor = inputItem.value.trim();
        
        if (valor) {
            Armazenamento.salvarItem(valor);
            inputItem.value = '';
            alert('Item "' + valor + '" cadastrado com sucesso!');
        }
    });
}

// Lógica para a página de Listagem
const listaUl = document.getElementById('lista');
if (listaUl) {
    const itens = Armazenamento.getItens();
    
    if (itens.length === 0) {
        listaUl.innerHTML = '<li>Nenhum item cadastrado.</li>';
    } else {
        itens.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listaUl.appendChild(li);
        });
    }
}