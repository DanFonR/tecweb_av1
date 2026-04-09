// Gerenciador de Itens (Armazenamento em Memória da Sessão)
const Armazenamento = {
    getItens() {
        const itens = localStorage.getItem('lista_itens');

        return itens ? JSON.parse(itens) : [];
    },

    salvarItem(nome) {
        const itens = this.getItens();

        if (itens.some(item => item === nome)) return false;

        itens.push(String(nome));
        localStorage.setItem('lista_itens', JSON.stringify(itens));

        return true;
    },

    deletarItem(nome) {
        const itens = this.getItens();
        const novoItens = itens.filter(item => item !== nome);

        localStorage.setItem('lista_itens', JSON.stringify(novoItens));
    }
};

// Lógica para a página de Cadastro
const formCadastro = document.getElementById('cadastro-itens');
const inputItem = document.getElementById('item');
const botoesSugestoes = document.getElementsByClassName('botao-sugestao');

function registrarItem(event) {
    if (!inputItem) return;

    let valorTemp;

    if (event.type === 'submit') {
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

if (formCadastro) formCadastro.addEventListener('submit', (event) => {event.preventDefault(); registrarItem(event);});
if (inputItem) inputItem.addEventListener('keydown', (event) => (event.code === 'Enter') && formCadastro.submit());
if (botoesSugestoes.length !== 0)
    for (const botao of botoesSugestoes)
        botao.addEventListener('click', registrarItem);

// Lógica para a página de Listagem
function removerElementoItem(elementoItem, texto) {
    Armazenamento.deletarItem(texto);
    if (Armazenamento.getItens().length === 0)
        elementoItem.parentElement.innerHTML = '<li>Nenhum item cadastrado.</li>';

    elementoItem.remove();
    alert(`"${texto}" foi removido!`);
}

function formatarItem(texto) {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'checkbox';
    input.id = `item-${crypto.randomUUID()}`;

    label.setAttribute('for', input.id);
    label.textContent = texto;

    input.addEventListener('change', () => removerElementoItem(li, texto));

    li.appendChild(input);
    li.appendChild(label);

    return li;
}

function listarItens(elementoLista, qtd = -1) {
    const itens = Armazenamento.getItens();

    if (qtd === -1) qtd = itens.length;
    const min = Math.min(qtd, itens.length);

    if (itens.length === 0) {
        elementoLista.innerHTML = '<li>Nenhum item cadastrado.</li>';
    }
    else for (let ind = 0; ind < min; ind++)
        elementoLista.appendChild(formatarItem(itens[ind]));
}

const listaItens = document.getElementById('lista');
const resumoItens = document.getElementById('lista-resumo');
const qtd = 5;

if (listaItens) {
    window.onload = () => listarItens(listaItens);
    listaItens.addEventListener('change', () => {
        listaItens.innerHTML = '';
        listarItens(listaItens, qtd);
    });
}
if (resumoItens) {
    window.onload = () => listarItens(resumoItens, qtd);
    resumoItens.addEventListener('change', () => {
        resumoItens.innerHTML = '';
        listarItens(resumoItens, qtd);
    });
}
