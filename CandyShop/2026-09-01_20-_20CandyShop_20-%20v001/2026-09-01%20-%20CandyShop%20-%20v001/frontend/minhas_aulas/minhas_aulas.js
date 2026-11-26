
const disciplinas = [
    {
        id: 1,
        nome: 'Matemática',
        descricao: 'Funções, geometria, álgebra e mais.',
        icone: '∑',
        cor: 'blue',
        topicos: [
            {
                id: 101,
                nome: 'Funções',
                aulas: [
                    { id: 1001, nome: 'Introdução às funções' },
                    { id: 1002, nome: 'Função afim: conceitos e gráficos' },
                    { id: 1003, nome: 'Função quadrática' }
                ]
            },
            {
                id: 102,
                nome: 'Geometria',
                aulas: [
                    { id: 1004, nome: 'Geometria plana' },
                    { id: 1005, nome: 'Áreas e perímetros' }
                ]
            }
        ]
    },
    {
        id: 2,
        nome: 'Português',
        descricao: 'Gramática, interpretação e literatura.',
        icone: 'A',
        cor: 'purple',
        topicos: [
            {
                id: 201,
                nome: 'Gramática',
                aulas: [
                    { id: 2001, nome: 'Classes gramaticais' },
                    { id: 2002, nome: 'Sintaxe' }
                ]
            },
            {
                id: 202,
                nome: 'Interpretação de textos',
                aulas: [
                    { id: 2003, nome: 'Compreensão textual' },
                    { id: 2004, nome: 'Gêneros textuais' }
                ]
            }
        ]
    },
    {
        id: 3,
        nome: 'Física',
        descricao: 'Mecânica, termologia, óptica e mais.',
        icone: '⚛',
        cor: 'green',
        topicos: [
            {
                id: 301,
                nome: 'Mecânica',
                aulas: [
                    { id: 3001, nome: 'Movimento uniforme' },
                    { id: 3002, nome: 'Leis de Newton' }
                ]
            },
            {
                id: 302,
                nome: 'Óptica geométrica',
                aulas: [
                    { id: 3003, nome: 'Fundamentos da óptica' },
                    { id: 3004, nome: 'Espelhos esféricos' }
                ]
            }
        ]
    },
    {
        id: 4,
        nome: 'Química',
        descricao: 'Química geral, orgânica e físico-química.',
        icone: '⚗',
        cor: 'orange',
        topicos: [
            {
                id: 401,
                nome: 'Química geral',
                aulas: [
                    { id: 4001, nome: 'Estrutura atômica' },
                    { id: 4002, nome: 'Tabela periódica' }
                ]
            },
            {
                id: 402,
                nome: 'Ligações químicas',
                aulas: [
                    { id: 4003, nome: 'Ligação iônica e covalente' },
                    { id: 4004, nome: 'Geometria molecular' }
                ]
            }
        ]
    },
    {
        id: 5,
        nome: 'Biologia',
        descricao: 'Citologia, genética, ecologia e mais.',
        icone: '♧',
        cor: 'green',
        topicos: [
            {
                id: 501,
                nome: 'Citologia',
                aulas: [
                    { id: 5001, nome: 'Introdução à célula' },
                    { id: 5002, nome: 'Organelas celulares' }
                ]
            },
            {
                id: 502,
                nome: 'Genética',
                aulas: [
                    { id: 5003, nome: 'Primeira lei de Mendel' },
                    { id: 5004, nome: 'Hereditariedade' }
                ]
            }
        ]
    },
    {
        id: 6,
        nome: 'História',
        descricao: 'História geral e história do Brasil.',
        icone: '◷',
        cor: 'orange',
        topicos: [
            {
                id: 601,
                nome: 'História do Brasil',
                aulas: [
                    { id: 6001, nome: 'Brasil colonial' },
                    { id: 6002, nome: 'Independência do Brasil' }
                ]
            },
            {
                id: 602,
                nome: 'História geral',
                aulas: [
                    { id: 6003, nome: 'Antiguidade clássica' },
                    { id: 6004, nome: 'Idade Média' }
                ]
            }
        ]
    },
    {
        id: 7,
        nome: 'Geografia',
        descricao: 'Geografia física, humana e do Brasil.',
        icone: '◎',
        cor: 'blue',
        topicos: [
            {
                id: 701,
                nome: 'Geografia física',
                aulas: [
                    { id: 7001, nome: 'Relevo e estrutura geológica' },
                    { id: 7002, nome: 'Clima e vegetação' }
                ]
            },
            {
                id: 702,
                nome: 'Geografia humana',
                aulas: [
                    { id: 7003, nome: 'População e demografia' },
                    { id: 7004, nome: 'Urbanização' }
                ]
            }
        ]
    },
    {
        id: 8,
        nome: 'Filosofia',
        descricao: 'Pensamento filosófico e seus autores.',
        icone: '✎',
        cor: 'purple',
        topicos: [
            {
                id: 801,
                nome: 'Filosofia antiga',
                aulas: [
                    { id: 8001, nome: 'Pré-socráticos' },
                    { id: 8002, nome: 'Sócrates e Platão' }
                ]
            },
            {
                id: 802,
                nome: 'Filosofia moderna',
                aulas: [
                    { id: 8003, nome: 'Racionalismo' },
                    { id: 8004, nome: 'Empirismo' }
                ]
            }
        ]
    },
    {
        id: 9,
        nome: 'Sociologia',
        descricao: 'Sociedade, cultura e relações sociais.',
        icone: '◈',
        cor: 'blue',
        topicos: [
            {
                id: 901,
                nome: 'Fundamentos da sociologia',
                aulas: [
                    { id: 9001, nome: 'O surgimento da sociologia' },
                    { id: 9002, nome: 'Émile Durkheim' }
                ]
            },
            {
                id: 902,
                nome: 'Sociedade e cultura',
                aulas: [
                    { id: 9003, nome: 'Cultura e identidade' },
                    { id: 9004, nome: 'Desigualdade social' }
                ]
            }
        ]
    },
    {
        id: 10,
        nome: 'Inglês',
        descricao: 'Leitura, interpretação e vocabulário.',
        icone: '文',
        cor: 'green',
        topicos: [
            {
                id: 1001,
                nome: 'Interpretação de textos',
                aulas: [
                    { id: 10001, nome: 'Reading comprehension' },
                    { id: 10002, nome: 'Text genres' }
                ]
            },
            {
                id: 1002,
                nome: 'Gramática',
                aulas: [
                    { id: 10003, nome: 'Verb tenses' },
                    { id: 10004, nome: 'Pronouns' }
                ]
            }
        ]
    }
];

const container = document.getElementById('subjectsContainer');

function carregarDisciplinas() {
    container.innerHTML = '';

    disciplinas.forEach(disciplina => {
        const card = document.createElement('details');
        card.className = 'subject-card';

        const topicosHTML = disciplina.topicos.map(topico => {
            const aulasHTML = topico.aulas.map(aula => `
                <a class="lesson-link"
                   href="../assistir_aula/assistir_aula.html?id=${aula.id}">
                    <span class="lesson-play">▶</span>
                    <span>${aula.nome}</span>
                    <span class="lesson-arrow">→</span>
                </a>
            `).join('');

            return `
                <details class="topic-item">
                    <summary>${topico.nome}</summary>
                    <div class="topic-lessons">
                        ${aulasHTML}
                    </div>
                </details>
            `;
        }).join('');

        card.innerHTML = `
            <summary class="subject-summary">
                <div class="subject-icon ${disciplina.cor}">
                    ${disciplina.icone}
                </div>

                <div class="subject-info">
                    <h3>${disciplina.nome}</h3>
                    <p>${disciplina.descricao}</p>
                </div>

                <span class="subject-arrow">⌄</span>
            </summary>

            <div class="subject-topics">
                ${topicosHTML}
            </div>
        `;

        container.appendChild(card);
    });
}

carregarDisciplinas();
