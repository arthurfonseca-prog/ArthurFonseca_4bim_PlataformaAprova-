
const bcrypt = require('bcrypt');
const { pool } = require('../database');

async function cadastrar(req, res) {
    console.log('CHEGOU AO CADASTRO CONTROLLER');

    const { nome, email, senha, plano, pagamento } = req.body;

    // Verifica se os campos foram preenchidos
    if (!nome || !email || !senha || !plano || !pagamento) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    // Relaciona a opção escolhida à duração em meses
    const duracoes = {
        trimestral: 3,
        semestral: 6,
        anual: 12
    };

    const duracao = duracoes[plano];

    if (!duracao) {
        return res.status(400).json({
            mensagem: 'Opção de plano inválida.'
        });
    }

    // Normaliza os dados
    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (!nomeNormalizado || !emailNormalizado) {
        return res.status(400).json({
            mensagem: 'Nome e e-mail são obrigatórios.'
        });
    }

    let conexao;

    try {
        // Gera o hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        conexao = await pool.connect();

        await conexao.query('BEGIN');

        // Verifica se o e-mail já está cadastrado
        const usuarioExistente = await conexao.query(
            `SELECT id_usuario
             FROM usuario
             WHERE email = $1`,
            [emailNormalizado]
        );

        if (usuarioExistente.rowCount > 0) {
            await conexao.query('ROLLBACK');

            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        // Busca a opção escolhida dentro do plano Aprova+ Completo
        const opcaoResult = await conexao.query(
            `SELECT op.id_opcao
             FROM opcao_plano op
             INNER JOIN plano p
                ON p.id_plano = op.id_plano
             WHERE p.id_plano = 10
               AND op.duracao_meses = $1`,
            [duracao]
        );

        if (opcaoResult.rowCount === 0) {
            await conexao.query('ROLLBACK');

            return res.status(400).json({
                mensagem: 'A opção de assinatura selecionada não está disponível.'
            });
        }

        const idOpcao = opcaoResult.rows[0].id_opcao;

        // Cria o usuário
        const usuarioResult = await conexao.query(
            `INSERT INTO usuario (
                nome,
                email,
                senha_hash,
                tipo_usuario
            )
            VALUES ($1, $2, $3, 'aluno')
            RETURNING id_usuario`,
            [nomeNormalizado, emailNormalizado, senhaHash]
        );

        const idUsuario = usuarioResult.rows[0].id_usuario;

        // Cria o perfil
        await conexao.query(
            `INSERT INTO perfil (
                id_usuario,
                nome_exibicao
            )
            VALUES ($1, $2)`,
            [idUsuario, nomeNormalizado]
        );

        // Cria a assinatura
        await conexao.query(
            `INSERT INTO assinatura (
                id_usuario,
                id_opcao,
                data_inicio,
                data_fim,
                status
            )
            VALUES (
                $1,
                $2,
                CURRENT_DATE,
                (CURRENT_DATE + ($3 * INTERVAL '1 month'))::date,
                'ATIVA'
            )`,
            [idUsuario, idOpcao, duracao]
        );

       await conexao.query('COMMIT');

// Confirma se o usuário realmente permanece no banco
const verificacao = await conexao.query(
    `SELECT id_usuario, nome, email
     FROM public.usuario
     WHERE id_usuario = $1`,
    [idUsuario]
);

console.log('CADASTRO SALVO NO BANCO!');
console.log('ID DO USUÁRIO:', idUsuario);
console.log('BANCO UTILIZADO:', (await conexao.query(
    'SELECT current_database() AS banco'
)).rows[0].banco);

console.log('USUÁRIO ENCONTRADO APÓS COMMIT:', verificacao.rows);

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            id_usuario: idUsuario
        });

    } catch (erro) {
        if (conexao) {
            await conexao.query('ROLLBACK');
        }

        console.error('Erro ao cadastrar usuário:', erro);

        return res.status(500).json({
            mensagem: 'Não foi possível realizar o cadastro.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
}

module.exports = {
    cadastrar
};
