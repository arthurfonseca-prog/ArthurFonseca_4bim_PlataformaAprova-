function adminMiddleware(req, res, next) {

    // Verifica se existe alguém logado
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: 'Você precisa estar logado.'
        });
    }

    // Verifica se o usuário é administrador
    if (req.session.usuario.tipo_usuario !== 'admin') {
        return res.status(403).json({
            mensagem: 'Acesso permitido somente ao administrador.'
        });
    }

    next();
}

module.exports = adminMiddleware;