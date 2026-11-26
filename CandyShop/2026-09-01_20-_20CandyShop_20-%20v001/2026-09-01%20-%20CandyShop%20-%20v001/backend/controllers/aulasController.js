const { query } = require('../database');


// ========================================
// LISTAR TODAS AS AULAS
// ========================================

async function listarAulas(req, res) {

    try {

        const resultado = await query(`
            SELECT
                a.id_aula,
                a.id_topico,
                a.titulo,
                a.descricao,
                a.video_url,
                a.imagem_url,
                a.ordem,
                t.id_disciplina,
                t.nome AS nome_topico,
                d.nome AS nome_disciplina

            FROM aula a

            INNER JOIN topico t
                ON a.id_topico = t.id_topico

            INNER JOIN disciplina d
                ON t.id_disciplina = d.id_disciplina

            ORDER BY d.nome, t.ordem, a.ordem
        `);

        return res.status(200).json({
            aulas: resultado.rows
        });

    } catch (erro) {

        console.error('Erro ao listar aulas:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao carregar as aulas.'
        });

    }

}


// ========================================
// LISTAR DISCIPLINAS
// ========================================

async function listarDisciplinas(req, res) {

    try {

        const resultado = await query(`
            SELECT id_disciplina, nome
            FROM disciplina
            ORDER BY nome
        `);

        return res.status(200).json({
            disciplinas: resultado.rows
        });

    } catch (erro) {

        console.error('Erro ao listar disciplinas:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao carregar as disciplinas.'
        });

    }

}


// ========================================
// LISTAR TÓPICOS DE UMA DISCIPLINA
// ========================================

async function listarTopicos(req, res) {

    try {

        const { idDisciplina } = req.params;

        const resultado = await query(`
            SELECT id_topico, nome
            FROM topico
            WHERE id_disciplina = $1
            ORDER BY ordem, nome
        `, [idDisciplina]);

        return res.status(200).json({
            topicos: resultado.rows
        });

    } catch (erro) {

        console.error('Erro ao listar tópicos:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao carregar os tópicos.'
        });

    }

}


// ========================================
// CADASTRAR AULA
// ========================================

async function cadastrarAula(req, res) {

    try {

        const {
            id_topico,
            titulo,
            descricao,
            video_url,
            ordem
        } = req.body;

        if (
            !id_topico ||
            !titulo ||
            !video_url ||
            !ordem
        ) {

            return res.status(400).json({
                mensagem: 'Preencha todos os campos obrigatórios.'
            });

        }

        // Verifica se o link é válido e pertence ao YouTube
        let url;

        try {
            url = new URL(video_url);
        } catch {
            return res.status(400).json({
                mensagem: 'Informe um link válido do YouTube.'
            });
        }

        if (
            !['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname)
        ) {

            return res.status(400).json({
                mensagem: 'O link informado precisa ser do YouTube.'
            });

        }

        if (
            !Number.isInteger(Number(ordem)) ||
            Number(ordem) < 1
        ) {

            return res.status(400).json({
                mensagem: 'A ordem da aula deve ser um número inteiro positivo.'
            });

        }

        // Verifica se o tópico existe
        const topico = await query(`
            SELECT id_topico
            FROM topico
            WHERE id_topico = $1
        `, [id_topico]);

        if (topico.rows.length === 0) {

            return res.status(404).json({
                mensagem: 'O tópico selecionado não foi encontrado.'
            });

        }

        // Caminho da imagem enviada
        const imagemUrl = req.file
            ? `/imagens/aulas/${req.file.filename}`
            : null;

        const resultado = await query(`
            INSERT INTO aula (
                id_topico,
                titulo,
                descricao,
                video_url,
                ordem,
                imagem_url
            )

            VALUES ($1, $2, $3, $4, $5, $6)

            RETURNING *
        `, [
            id_topico,
            titulo.trim(),
            descricao || '',
            video_url.trim(),
            Number(ordem),
            imagemUrl
        ]);

        return res.status(201).json({
            mensagem: 'Aula cadastrada com sucesso!',
            aula: resultado.rows[0]
        });

    } catch (erro) {

        console.error('Erro ao cadastrar aula:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar a aula.'
        });

    }

}


// ========================================
// EDITAR AULA
// ========================================

async function editarAula(req, res) {

    try {

        const { id } = req.params;

        const {
            id_topico,
            titulo,
            descricao,
            video_url,
            ordem
        } = req.body;

        if (
            !id_topico ||
            !titulo ||
            !video_url ||
            !ordem
        ) {

            return res.status(400).json({
                mensagem: 'Preencha todos os campos obrigatórios.'
            });

        }

        let url;

        try {
            url = new URL(video_url);
        } catch {
            return res.status(400).json({
                mensagem: 'Informe um link válido do YouTube.'
            });
        }

        if (
            !['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'].includes(url.hostname)
        ) {

            return res.status(400).json({
                mensagem: 'O link informado precisa ser do YouTube.'
            });

        }

        if (
            !Number.isInteger(Number(ordem)) ||
            Number(ordem) < 1
        ) {

            return res.status(400).json({
                mensagem: 'A ordem da aula deve ser um número inteiro positivo.'
            });

        }

        const topico = await query(`
            SELECT id_topico
            FROM topico
            WHERE id_topico = $1
        `, [id_topico]);

        if (topico.rows.length === 0) {

            return res.status(404).json({
                mensagem: 'O tópico selecionado não foi encontrado.'
            });

        }

        let resultado;

        if (req.file) {

            const imagemUrl = `/imagens/aulas/${req.file.filename}`;

            resultado = await query(`
                UPDATE aula

                SET
                    id_topico = $1,
                    titulo = $2,
                    descricao = $3,
                    video_url = $4,
                    ordem = $5,
                    imagem_url = $6

                WHERE id_aula = $7

                RETURNING *
            `, [
                id_topico,
                titulo.trim(),
                descricao || '',
                video_url.trim(),
                Number(ordem),
                imagemUrl,
                id
            ]);

        } else {

            resultado = await query(`
                UPDATE aula

                SET
                    id_topico = $1,
                    titulo = $2,
                    descricao = $3,
                    video_url = $4,
                    ordem = $5

                WHERE id_aula = $6

                RETURNING *
            `, [
                id_topico,
                titulo.trim(),
                descricao || '',
                video_url.trim(),
                Number(ordem),
                id
            ]);

        }

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensagem: 'Aula não encontrada.'
            });

        }

        return res.status(200).json({
            mensagem: 'Aula atualizada com sucesso!',
            aula: resultado.rows[0]
        });

    } catch (erro) {

        console.error('Erro ao editar aula:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar a aula.'
        });

    }

}


// ========================================
// EXCLUIR AULA
// ========================================

async function excluirAula(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            DELETE FROM aula
            WHERE id_aula = $1
            RETURNING id_aula
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensagem: 'Aula não encontrada.'
            });

        }

        return res.status(200).json({
            mensagem: 'Aula excluída com sucesso!'
        });

    } catch (erro) {

        console.error('Erro ao excluir aula:', erro);

        return res.status(500).json({
            mensagem: 'Não foi possível excluir a aula. Verifique se ela está vinculada a outros registros.'
        });

    }

}


module.exports = {
    listarAulas,
    listarDisciplinas,
    listarTopicos,
    cadastrarAula,
    editarAula,
    excluirAula
};