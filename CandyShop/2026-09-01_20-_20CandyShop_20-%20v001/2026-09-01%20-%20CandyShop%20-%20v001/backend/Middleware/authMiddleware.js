function authMiddleware(req, res, next) {

    // Verifica se existe um usuário na sessão
    if (!req.session.usuario) {

        return res.status(401).json({
            mensagem: 'Você precisa fazer login para acessar esta página.'
        });

    }

    // Se estiver logado, permite continuar
    next();
}

module.exports = authMiddleware;