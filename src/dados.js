// Gerenciador de Itens (Armazenamento em Memória da Sessão)
const Storage = {
    getItens() {
        const itens = sessionStorage.getItem('lista_itens');
        return itens ? JSON.parse(itens) : [];
    },
    salvarItem(nome) {
        const itens = this.getItens();
        itens.push(nome);
        sessionStorage.setItem('lista_itens', JSON.stringify(itens));
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
            Storage.salvarItem(valor);
            inputItem.value = '';
            alert('Item "' + valor + '" cadastrado com sucesso!');
        }
    });
}

// Lógica para a página de Listagem
const listaUl = document.getElementById('lista');
if (listaUl) {
    const itens = Storage.getItens();
    
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