const { query } = require('../database');
const bcrypt = require('bcrypt');

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const resultado = await query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const usuario = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            tipo_usuario: usuario.tipo_usuario
        };

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            tipo_usuario: usuario.tipo_usuario
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);

        return res.status(500).json({
            mensagem: 'Erro interno ao realizar login.'
        });
    }
}

// Encerra a sessão do usuário
function logout(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            console.error('Erro ao encerrar sessão:', erro);

            return res.status(500).json({
                mensagem: 'Não foi possível encerrar a sessão.'
            });
        }

        res.clearCookie('connect.sid', {
            path: '/'
        });

        return res.status(200).json({
            mensagem: 'Logout realizado com sucesso.'
        });
    });
}

module.exports = {
    login,
    logout
};