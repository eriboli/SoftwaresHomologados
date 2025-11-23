
let cardContainer = document.querySelector('.card-container');
let campoBusca = document.querySelector('input[type="text"]');
let artigos = [];

async function carregarDados() {
    try {
        let response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados: ' + response.statusText);
        }
        artigos = await response.json();
        exibirCards(artigos);
    } catch (error) {
        console.error('Falha na requisição:', error);
        cardContainer.innerHTML = '<p>Não foi possível carregar os artigos. Tente novamente mais tarde.</p>';
    }
}


function exibirCards(listaDeArtigos) {
    cardContainer.innerHTML = '';

    if (listaDeArtigos.length === 0) {
        cardContainer.innerHTML = '<p>Nenhum artigo encontrado para o termo buscado.</p>';
        return;
    }

    listaDeArtigos.forEach(artigo => {
        let card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <h2>${artigo.software}</h2>
            <p>${artigo.versao}</p>
            <p>${artigo.descricao}</p>
            <a href="${artigo.link}" target="_blank">Donwload</a>
        `;
        cardContainer.appendChild(card);
    });
}

function iniciarBusca() {
    let termoBusca = campoBusca.value.toLowerCase();
    if (!termoBusca) {
        exibirCards(artigos);
        return;
    }

    let resultadoBusca = artigos.filter(artigo => 
        artigo.software.toLowerCase().includes(termoBusca) || 
        artigo.descricao.toLowerCase().includes(termoBusca)
    );

    exibirCards(resultadoBusca);
}

function incluiSoftware() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-button">&times;</button>
            <h2>Cadastrar Novo Software</h2>
            <form id="form-novo-software">
                <label for="software">Software:</label>
                <input type="text" id="software" name="software" required>
                
                <label for="versao">Versão:</label>
                <input type="text" id="versao" name="versao" required>
                
                <label for="descricao">Descrição:</label>
                <textarea id="descricao" name="descricao" required></textarea>
                
                <label for="link">Link:</label>
                <input type="url" id="link" name="link" required>
                
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => {
        document.body.removeChild(modalOverlay);
    };

    modalOverlay.querySelector('.close-button').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    const form = modalOverlay.querySelector('#form-novo-software');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const novoSoftware = {
            software: form.elements.software.value,
            versao: form.elements.versao.value,
            descricao: form.elements.descricao.value,
            link: form.elements.link.value
        };

        artigos.push(novoSoftware);
        exibirCards(artigos);
        
        console.log('Novo software adicionado à lista em memória. Para persistir os dados, seria necessário um backend para atualizar o arquivo data.json.');

        closeModal();
    });
}

// Adiciona um listener para buscar ao pressionar Enter no campo de busca
campoBusca.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        iniciarBusca();
    }
});

// Carrega os dados iniciais quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarDados);


