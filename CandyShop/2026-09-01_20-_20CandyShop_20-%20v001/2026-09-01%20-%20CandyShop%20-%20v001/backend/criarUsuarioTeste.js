
const { query, pool } = require('./database');
const bcrypt = require('bcrypt');

async function criarUsuarioTeste() {

    const nome = 'Usuario Teste';
    const email = 'teste@aprova.com';
    const senha = 'Aprova@123';

    // Gera o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco
    const resultado = await query(`
        INSERT INTO usuario (nome, email, senha_hash, tipo_usuario)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET senha_hash = EXCLUDED.senha_hash
        RETURNING id_usuario, nome, email, tipo_usuario
    `, [nome, email, senhaHash, 'aluno']);

    console.log('Usuário de teste criado/atualizado:');
    console.log(resultado.rows[0]);

}

criarUsuarioTeste()
    .catch(error => console.error('Erro:', error))
    .finally(() => pool.end());
