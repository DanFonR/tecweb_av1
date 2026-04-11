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

function animarElemento(elemento, classe, tempo = 1000) {
    elemento.classList.toggle(classe);

    if (tempo !== 0)
        setTimeout(() => elemento.classList.toggle(classe), tempo);
}

function registrarItem(event) {
    if (!inputItem) return;

    let valorTemp;

    if (event.type === 'submit') {
        event.preventDefault();
        valorTemp = inputItem.value;
    }
    else valorTemp = event.currentTarget.textContent;

    const valor = valorTemp.trim();

    if (!valor) {
        animarElemento(event.currentTarget, "input-empty");
        return;
    };

    const estilos = ["input-error", "input-ok"];
    const foiSalvo = Armazenamento.salvarItem(valor);

    inputItem.value = '';
    animarElemento(event.currentTarget, estilos[Number(foiSalvo)]);
}

if (formCadastro) formCadastro.addEventListener('submit', registrarItem);

if (botoesSugestoes.length !== 0)
    for (const botao of botoesSugestoes)
        botao.addEventListener('click', registrarItem);

// Lógica para a página de Listagem
function removerElementoItem(elementoItem, texto, elementoPai, qtd = -1) {
    Armazenamento.deletarItem(texto);

    animarElemento(elementoItem, "under-deletion", 0);
    elementoItem.addEventListener('animationend', () => {
        elementoItem.remove();
        listarItens(elementoPai, qtd);
    });
}

function formatarItem(texto, modoResumo = false) {
    const li = document.createElement('li');

    if (!modoResumo) {
        const input = document.createElement('input');
        const label = document.createElement('label');

        li.classList.add("deletable-li");

        input.type = 'checkbox';
        input.id = `item-${crypto.randomUUID()}`;

        label.setAttribute('for', input.id);
        label.textContent = texto;

        input.addEventListener('change', () => (
            removerElementoItem(li, texto, li.parentElement)
        ));

        li.appendChild(input);
        li.appendChild(label);
    } else {
        li.textContent = texto;
        li.classList.add("resumo-item");
    }

    return li;
}

function listarItens(elementoLista, qtd = -1, modoResumo = false) {
    const itens = Armazenamento.getItens();

    if (qtd === -1) qtd = itens.length;
    const min = Math.min(qtd, itens.length);

    elementoLista.innerHTML = '';

    if (itens.length === 0) {
        elementoLista.innerHTML = '<li>Nenhum item cadastrado.</li>';
        return;
    }

    for (let ind = 0; ind < min; ind++)
        elementoLista.appendChild(formatarItem(itens[ind], modoResumo));
}

const listaItens = document.getElementById('lista');
const resumoItens = document.getElementById('lista-resumo');
const qtd = 8;

if (listaItens) window.onload = () => listarItens(listaItens);
if (resumoItens) window.onload = () => listarItens(resumoItens, qtd, true);
