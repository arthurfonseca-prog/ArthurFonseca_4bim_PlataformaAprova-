const { query } = require('../database');

async function obterResumo(req, res) {

    try {
        const idUsuario = req.session.usuario.id_usuario;

        const resultado = await query(`
            SELECT
                u.nome,
                p.nome AS nome_exibicao,
                pl.nome AS plano,
                a.data_fim,
                a.status,

                (SELECT COUNT(*)
                 FROM progresso_aula pa
                 WHERE pa.id_usuario = u.id_usuario
                 AND pa.concluida = TRUE) AS aulas_concluidas

            FROM usuario u

            LEFT JOIN perfil p
                ON p.id_usuario = u.id_usuario

            LEFT JOIN assinatura a
                ON a.id_usuario = u.id_usuario
                AND a.status = 'ATIVA'

            LEFT JOIN opcao_plano op
                ON op.id_opcao = a.id_opcao

            LEFT JOIN plano pl
                ON pl.id_plano = op.id_plano

            WHERE u.id_usuario = $1
        `, [idUsuario]);

        return res.json(resultado.rows[0]);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao carregar o resumo da área inicial.'
        });
    }
}async function listarCursos(req, res) {

    try {
        const resultado = await query(`
            SELECT
                id_curso,
                nome,
                descricao
            FROM curso
            ORDER BY id_curso
        `);

        return res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao listar os cursos.'
        });
    }
}async function listarDisciplinas(req, res) {

    try {
        const idCurso = req.params.idCurso;

        const resultado = await query(`
            SELECT
                id_disciplina,
                nome
            FROM disciplina
            WHERE id_curso = $1
            ORDER BY id_disciplina
        `, [idCurso]);

        return res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao listar as disciplinas.'
        });
    }
}async function listarTopicos(req, res) {

    try {
        const idDisciplina = req.params.idDisciplina;

        const resultado = await query(`
            SELECT
                id_topico,
                nome,
                descricao,
                ordem
            FROM topico
            WHERE id_disciplina = $1
            ORDER BY ordem
        `, [idDisciplina]);

        return res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao listar os tópicos.'
        });
    }
}async function listarAulas(req, res) {

    try {
        const idTopico = req.params.idTopico;
        const idUsuario = req.session.usuario.id_usuario;

        const resultado = await query(`
            SELECT
                a.id_aula,
                a.titulo,
                a.descricao,
                a.video_url,
                a.ordem,
                COALESCE(pa.concluida, FALSE) AS concluida

            FROM aula a

            LEFT JOIN progresso_aula pa
                ON pa.id_aula = a.id_aula
                AND pa.id_usuario = $2

            WHERE a.id_topico = $1
            ORDER BY a.ordem
        `, [idTopico, idUsuario]);

        return res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao listar as aulas.'
        });
    }
}async function listarMateriais(req, res) {

    try {
        const resultado = await query(`
            SELECT
                m.id_material,
                m.titulo,
                m.descricao,
                m.arquivo,
                tm.nome AS tipo_material,
                a.titulo AS aula,
                t.nome AS topico,
                d.nome AS disciplina

            FROM material m

            INNER JOIN tipo_material tm
                ON tm.id_tipo = m.id_tipo

            LEFT JOIN aula a
                ON a.id_aula = m.id_aula

            LEFT JOIN topico t
                ON t.id_topico = a.id_topico

            LEFT JOIN disciplina d
                ON d.id_disciplina = t.id_disciplina

            ORDER BY m.data_publicacao DESC
        `);

        return res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao listar os materiais.'
        });
    }
}async function obterPerfil(req, res) {

    try {
        const idUsuario = req.session.usuario.id_usuario;

        const resultado = await query(`
            SELECT
                u.nome,
                u.email,
                u.data_cadastro,
                p.nome_exibicao,
                p.foto,
                pl.nome AS plano,
                a.data_inicio,
                a.data_fim,
                a.status

            FROM usuario u

            LEFT JOIN perfil p
                ON p.id_usuario = u.id_usuario

            LEFT JOIN assinatura a
                ON a.id_usuario = u.id_usuario
                AND a.status = 'ATIVA'

            LEFT JOIN opcao_plano op
                ON op.id_opcao = a.id_opcao

            LEFT JOIN plano pl
                ON pl.id_plano = op.id_plano

            WHERE u.id_usuario = $1
        `, [idUsuario]);

        return res.json(resultado.rows[0]);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao carregar o perfil.'
        });
    }
}module.exports = {
    obterResumo,
    listarCursos,
    listarDisciplinas,
    listarTopicos,
    listarAulas,
    listarMateriais,
    obterPerfil
};