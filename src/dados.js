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
const inputItem = document.getElementById('item');

function registrarItem(event) {
    if (!inputItem) return;

    let valorTemp;

    if (event.type === 'submit') {
        event.preventDefault(); // Evita recarregamento da página

        valorTemp = inputItem.value;
    }
    else valorTemp = event.currentTarget.textContent;

    const valor = valorTemp.trim();

    if (!valor) {
        alert('Nenhum valor inserido!');
        return;
    };

    const mensagens = [`"${valor}" já existe!`, `"${valor}" cadastrado com sucesso!`];
    const foiSalvo = Armazenamento.salvarItem(valor);

    inputItem.value = '';
    alert(mensagens[Number(foiSalvo)]);
}

if (formCadastro) formCadastro.addEventListener('submit', registrarItem);
if (inputItem) inputItem.addEventListener('keydown', (event) => (event.code === 'Enter') && formCadastro.submit());

// Lógica para a página de Listagem
function formatarItem(texto) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'checkbox';
    input.id = `item-${crypto.randomUUID()}`;

    label.setAttribute('for', input.id);
    label.textContent = texto;

    input.addEventListener('change', () => {
        li.remove();
        Armazenamento.deletarItem(texto);
    });

    li.appendChild(input);
    li.appendChild(label);

    return li;
}

const listaItens = document.getElementById('lista');

if (listaItens) {
    const itens = Armazenamento.getItens();

    if (itens.length === 0)
        listaItens.innerHTML = '<li>Nenhum item cadastrado.</li>';
    else
        itens.forEach((item) => listaItens.appendChild(formatarItem(item)));
}
