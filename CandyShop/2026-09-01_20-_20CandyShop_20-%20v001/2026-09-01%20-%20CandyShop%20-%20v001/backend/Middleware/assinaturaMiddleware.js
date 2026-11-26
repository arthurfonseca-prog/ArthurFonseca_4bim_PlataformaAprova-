
const { query } = require('../database');

async function assinaturaMiddleware(req, res, next) {
    try {
        const idUsuario = req.session.usuario.id_usuario;

        // Atualiza assinaturas cujo prazo já terminou
        await query(
            `UPDATE assinatura
             SET status = 'EXPIRADA'
             WHERE id_usuario = $1
               AND status = 'ATIVA'
               AND data_fim < CURRENT_DATE`,
            [idUsuario]
        );

        // Procura uma assinatura válida
        const resultado = await query(
            `SELECT
                id_assinatura,
                data_inicio,
                data_fim,
                status
             FROM assinatura
             WHERE id_usuario = $1
               AND status = 'ATIVA'
               AND data_inicio <= CURRENT_DATE
               AND data_fim >= CURRENT_DATE
             LIMIT 1`,
            [idUsuario]
        );

        // Se não encontrar assinatura válida, bloqueia
        if (resultado.rowCount === 0) {
            return res.status(403).json({
                mensagem: 'Sua assinatura expirou ou não foi encontrada. Renove seu acesso para continuar.'
            });
        }

        // Guarda os dados da assinatura na requisição
        req.assinatura = resultado.rows[0];

        next();

    } catch (erro) {
        console.error('Erro ao verificar assinatura:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao verificar sua assinatura.'
        });
    }
}

module.exports = assinaturaMiddleware;
