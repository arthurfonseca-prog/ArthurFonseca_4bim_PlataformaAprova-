const bcrypt = require('bcrypt');
const { query } = require('./database');

async function atualizarSenhaAdmin() {
    try {
        // Escolha sua nova senha e coloque aqui.
        const novaSenha = 'arthurgabrielAdmin';

        // Gera o hash da senha
        const senhaHash = await bcrypt.hash(novaSenha, 10);

        // Atualiza somente a senha do administrador
        const resultado = await query(
            `UPDATE usuario
             SET senha_hash = $1
             WHERE email = $2
             AND tipo_usuario = 'admin'
             RETURNING id_usuario, nome, email, tipo_usuario`,
            [senhaHash, 'admin@aprova.com.br']
        );

        if (resultado.rows.length === 0) {
            console.log('Administrador não encontrado. Nenhuma alteração realizada.');
            return;
        }

        console.log('Senha do administrador atualizada!');
        console.log(resultado.rows[0]);

    } catch (erro) {
        console.error('Erro ao atualizar senha:', erro);
    } finally {
        process.exit();
    }
}

atualizarSenhaAdmin();