
const { query } = require('../database');

async function carregarIndicadores(req, res) {
    try {

        // Quantidade de alunos cadastrados
        const alunos = await query(`
            SELECT COUNT(*) AS total
            FROM usuario
            WHERE tipo_usuario = 'aluno'
        `);

        // Quantidade de disciplinas
        const disciplinas = await query(`
            SELECT COUNT(*) AS total
            FROM disciplina
        `);

        // Quantidade de aulas
        const aulas = await query(`
            SELECT COUNT(*) AS total
            FROM aula
        `);

        // Quantidade de assinaturas ativas e dentro da validade
        const assinaturas = await query(`
            SELECT COUNT(*) AS total
            FROM assinatura
            WHERE status = 'ATIVA'
            AND data_inicio <= CURRENT_DATE
            AND data_fim >= CURRENT_DATE
        `);

        return res.status(200).json({
            totalAlunos: Number(alunos.rows[0].total),
            totalDisciplinas: Number(disciplinas.rows[0].total),
            totalAulas: Number(aulas.rows[0].total),
            totalAssinaturas: Number(assinaturas.rows[0].total)
        });

    } catch (erro) {
        console.error('Erro ao carregar indicadores:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao carregar indicadores administrativos.'
        });
    }
}

module.exports = {
    carregarIndicadores
};
