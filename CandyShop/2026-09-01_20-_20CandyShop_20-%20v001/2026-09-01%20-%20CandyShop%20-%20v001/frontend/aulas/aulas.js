
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // CONFIGURAÇÕES
    // ========================================

    const API_URL = 'http://127.0.0.1:3001/aulas';
    const SERVIDOR_URL = 'http://127.0.0.1:3001';

    const aulaForm = document.getElementById('aulaForm');
    const disciplinaSelect = document.getElementById('disciplina');
    const topicoSelect = document.getElementById('topico');
    const imagemInput = document.getElementById('imagem');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const formMessage = document.getElementById('formMessage');

    let aulasCadastradas = [];
    let imagemTemporaria = null;

    // ========================================
    // CAMINHO DAS IMAGENS
    // ========================================

    function enderecoImagem(caminho) {

        if (!caminho) return '';

        if (caminho.startsWith('http')) {
            return caminho;
        }

        return `${SERVIDOR_URL}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
    }

    // ========================================
    // MENU LATERAL MOBILE
    // ========================================

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {

            const clicouNoMenu = sidebar.contains(event.target);
            const clicouNoBotao = menuToggle.contains(event.target);

            if (!clicouNoMenu && !clicouNoBotao) {
                sidebar.classList.remove('open');
            }

        });

    }

    // ========================================
    // MENSAGENS
    // ========================================

    function mostrarMensagem(texto, tipo) {

        formMessage.textContent = texto;
        formMessage.className = `form-message ${tipo}`;

    }

    // ========================================
    // TRATAMENTO DE RESPOSTAS
    // ========================================

    async function processarResposta(resposta) {

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem || 'Ocorreu um erro na operação.'
            );
        }

        return dados;

    }

    // ========================================
    // CARREGAR DISCIPLINAS
    // ========================================

    async function carregarDisciplinas() {

        try {

            const resposta = await fetch(`${API_URL}/disciplinas`, {
                credentials: 'include'
            });

            const dados = await processarResposta(resposta);
            const disciplinas = dados.disciplinas || dados;

            disciplinaSelect.innerHTML =
                '<option value="">Selecione uma disciplina</option>';

            disciplinas.forEach(disciplina => {

                const option = document.createElement('option');

                option.value = disciplina.id_disciplina;
                option.textContent = disciplina.nome;

                disciplinaSelect.appendChild(option);

            });

        } catch (erro) {

            console.error('Erro ao carregar disciplinas:', erro);

            disciplinaSelect.innerHTML =
                '<option value="">Erro ao carregar disciplinas</option>';

        }

    }

    // ========================================
    // CARREGAR TÓPICOS
    // ========================================

    async function carregarTopicos(idDisciplina, idTopicoSelecionado = null) {

        topicoSelect.disabled = true;

        topicoSelect.innerHTML =
            '<option value="">Carregando tópicos...</option>';

        if (!idDisciplina) {

            topicoSelect.innerHTML =
                '<option value="">Selecione uma disciplina primeiro</option>';

            return;

        }

        try {

            const resposta = await fetch(
                `${API_URL}/topicos/${encodeURIComponent(idDisciplina)}`,
                {
                    credentials: 'include'
                }
            );

            const dados = await processarResposta(resposta);
            const topicos = dados.topicos || dados;

            topicoSelect.innerHTML =
                '<option value="">Selecione um tópico</option>';

            topicos.forEach(topico => {

                const option = document.createElement('option');

                option.value = topico.id_topico;
                option.textContent = topico.nome;

                topicoSelect.appendChild(option);

            });

            topicoSelect.disabled = false;

            if (idTopicoSelecionado) {
                topicoSelect.value = String(idTopicoSelecionado);
            }

        } catch (erro) {

            console.error('Erro ao carregar tópicos:', erro);

            topicoSelect.innerHTML =
                '<option value="">Erro ao carregar tópicos</option>';

        }

    }

    disciplinaSelect.addEventListener('change', () => {
        carregarTopicos(disciplinaSelect.value);
    });

    // ========================================
    // PRÉ-VISUALIZAÇÃO DA IMAGEM
    // ========================================

    function limparImagemTemporaria() {

        if (imagemTemporaria) {
            URL.revokeObjectURL(imagemTemporaria);
            imagemTemporaria = null;
        }

    }

    function mostrarImagem(url) {

        imagePreview.src = url;
        imagePreviewContainer.hidden = false;

    }

    imagemInput.addEventListener('change', () => {

        const arquivo = imagemInput.files[0];

        limparImagemTemporaria();

        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {

            mostrarMensagem('Selecione um arquivo de imagem válido.', 'error');

            imagemInput.value = '';
            return;

        }

        imagemTemporaria = URL.createObjectURL(arquivo);

        mostrarImagem(imagemTemporaria);

        mostrarMensagem('', '');

    });

    document.getElementById('removeImage').addEventListener('click', () => {

        imagemInput.value = '';

        limparImagemTemporaria();

        imagePreview.src = '';
        imagePreviewContainer.hidden = true;

    });

    // ========================================
    // CARREGAR AULAS CADASTRADAS
    // ========================================

    async function carregarAulas() {

        const lessonsList = document.getElementById('lessonsList');

        lessonsList.innerHTML = `
            <div class="empty-state">
                Carregando aulas...
            </div>
        `;

        try {

            const resposta = await fetch(API_URL, {
                credentials: 'include'
            });

            const dados = await processarResposta(resposta);

            aulasCadastradas = dados.aulas || dados;

            renderizarAulas();

        } catch (erro) {

            console.error('Erro ao carregar aulas:', erro);

            lessonsList.innerHTML = `
                <div class="empty-state">
                    Não foi possível carregar as aulas.
                </div>
            `;

        }

    }

    // ========================================
    // MOSTRAR AULAS NA TELA
    // ========================================

    function renderizarAulas() {

        const lessonsList = document.getElementById('lessonsList');

        lessonsList.innerHTML = '';

        if (!Array.isArray(aulasCadastradas) || aulasCadastradas.length === 0) {

            lessonsList.innerHTML = `
                <div class="empty-state">
                    Nenhuma aula cadastrada até o momento.
                </div>
            `;

            return;

        }

        aulasCadastradas.forEach(aula => {

            const card = document.createElement('article');
            card.className = 'lesson-card';

            const imagem = document.createElement('img');
            imagem.className = 'lesson-image';
            imagem.alt = 'Capa da aula';

            if (aula.imagem_url) {
                imagem.src = enderecoImagem(aula.imagem_url);
            } else {
                imagem.style.display = 'none';
            }

            imagem.onerror = () => {
                imagem.style.display = 'none';
            };

            const info = document.createElement('div');
            info.className = 'lesson-info';

            const titulo = document.createElement('h3');
            titulo.textContent = aula.titulo;

            const disciplina = document.createElement('p');
            disciplina.textContent =
                `Disciplina: ${aula.nome_disciplina || 'Não informada'}`;

            const topico = document.createElement('p');
            topico.textContent =
                `Tópico: ${aula.nome_topico || 'Não informado'}`;

            const ordem = document.createElement('p');
            ordem.textContent = `Ordem: ${aula.ordem}`;

            info.append(titulo, disciplina, topico, ordem);

            const actions = document.createElement('div');
            actions.className = 'lesson-actions';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'edit-button';
            editButton.textContent = 'Editar';

            editButton.addEventListener('click', () => {
                editarAula(aula.id_aula);
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Excluir';

            deleteButton.addEventListener('click', () => {
                excluirAula(aula.id_aula);
            });

            actions.append(editButton, deleteButton);

            card.append(imagem, info, actions);

            lessonsList.appendChild(card);

        });

    }

    // ========================================
    // CADASTRAR OU EDITAR AULA
    // ========================================

    aulaForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        if (!topicoSelect.value) {
            mostrarMensagem('Selecione um tópico para a aula.', 'error');
            return;
        }

        const idAula = document.getElementById('idAula').value;

        const dados = new FormData();

        dados.append('id_topico', topicoSelect.value);
        dados.append('titulo', document.getElementById('titulo').value.trim());
        dados.append('descricao', document.getElementById('descricao').value.trim());
        dados.append('video_url', document.getElementById('videoUrl').value.trim());
        dados.append('ordem', document.getElementById('ordem').value);

        if (imagemInput.files[0]) {
            dados.append('imagem', imagemInput.files[0]);
        }

        const submitButton = document.getElementById('submitButton');

        submitButton.disabled = true;
        submitButton.textContent = idAula ? 'Salvando...' : 'Cadastrando...';

        try {

            let resposta;

            if (idAula) {

                resposta = await fetch(`${API_URL}/${encodeURIComponent(idAula)}`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: dados
                });

            } else {

                resposta = await fetch(API_URL, {
                    method: 'POST',
                    credentials: 'include',
                    body: dados
                });

            }

            const resultado = await processarResposta(resposta);

            mostrarMensagem(
                resultado.mensagem ||
                (idAula ? 'Aula atualizada com sucesso!' : 'Aula cadastrada com sucesso!'),
                'success'
            );

            limparFormulario();

            await carregarAulas();

        } catch (erro) {

            console.error('Erro ao salvar aula:', erro);

            mostrarMensagem(erro.message, 'error');

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                document.getElementById('idAula').value
                    ? 'Salvar alterações'
                    : 'Cadastrar aula';

        }

    });

    // ========================================
    // EDITAR AULA
    // ========================================

    async function editarAula(idAula) {

        const aula = aulasCadastradas.find(item =>
            String(item.id_aula) === String(idAula)
        );

        if (!aula) {
            mostrarMensagem('Aula não encontrada.', 'error');
            return;
        }

        document.getElementById('idAula').value = aula.id_aula;

        document.getElementById('titulo').value = aula.titulo || '';
        document.getElementById('descricao').value = aula.descricao || '';
        document.getElementById('videoUrl').value = aula.video_url || '';
        document.getElementById('ordem').value = aula.ordem || 1;

        disciplinaSelect.value = String(aula.id_disciplina || '');

        await carregarTopicos(
            aula.id_disciplina,
            aula.id_topico
        );

        imagemInput.value = '';

        limparImagemTemporaria();

        if (aula.imagem_url) {
            mostrarImagem(enderecoImagem(aula.imagem_url));
        } else {
            imagePreview.src = '';
            imagePreviewContainer.hidden = true;
        }

        document.getElementById('formTitle').textContent = 'Editar aula';

        document.getElementById('submitButton').textContent =
            'Salvar alterações';

        document.getElementById('cancelEdit').hidden = false;

        mostrarMensagem('Editando aula selecionada.', 'success');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    // ========================================
    // EXCLUIR AULA
    // ========================================

    async function excluirAula(idAula) {

        const confirmar = confirm(
            'Tem certeza de que deseja excluir esta aula?'
        );

        if (!confirmar) return;

        try {

            const resposta = await fetch(
                `${API_URL}/${encodeURIComponent(idAula)}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const resultado = await processarResposta(resposta);

            alert(resultado.mensagem || 'Aula excluída com sucesso!');

            await carregarAulas();

        } catch (erro) {

            console.error('Erro ao excluir aula:', erro);

            alert(erro.message);

        }

    }

    // ========================================
    // LIMPAR FORMULÁRIO
    // ========================================

    function limparFormulario() {

        aulaForm.reset();

        document.getElementById('idAula').value = '';

        topicoSelect.innerHTML =
            '<option value="">Selecione uma disciplina primeiro</option>';

        topicoSelect.disabled = true;

        document.getElementById('formTitle').textContent =
            'Cadastrar nova aula';

        document.getElementById('submitButton').textContent =
            'Cadastrar aula';

        document.getElementById('cancelEdit').hidden = true;

        imagemInput.value = '';

        limparImagemTemporaria();

        imagePreview.src = '';
        imagePreviewContainer.hidden = true;

    }

    document.getElementById('cancelEdit').addEventListener('click', () => {

        limparFormulario();

        mostrarMensagem('', '');

    });

    // ========================================
    // ATUALIZAR LISTAGEM
    // ========================================

    document.getElementById('refreshButton').addEventListener('click', () => {
        carregarAulas();
    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    carregarDisciplinas();
    carregarAulas();

});
