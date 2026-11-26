
document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // MENU LATERAL MOBILE
    // ========================================

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', (event) => {

            const clicouNoMenu = sidebar.contains(event.target);
            const clicouNoBotao = menuToggle.contains(event.target);

            if (!clicouNoMenu && !clicouNoBotao) {
                sidebar.classList.remove('open');
            }

        });

    }


    // ========================================
    // INDICADORES DO PAINEL
    // ========================================

    async function carregarIndicadores() {

        try {

            const resposta = await fetch(
                'http://127.0.0.1:3001/administrador/indicadores',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );

            if (!resposta.ok) {
                throw new Error('Não foi possível carregar os indicadores.');
            }

            const dados = await resposta.json();

            document.getElementById('totalAlunos').textContent =
                dados.totalAlunos;

            document.getElementById('totalDisciplinas').textContent = dados.totalDisciplinas;

            document.getElementById('totalAulas').textContent =
                dados.totalAulas;

            document.getElementById('totalAssinaturas').textContent =
                dados.totalAssinaturas;

        } catch (erro) {

            console.error('Erro ao carregar indicadores:', erro.message);

        }

    }

    // A conexão será ativada quando criarmos a rota no backend.
    carregarIndicadores();

});
