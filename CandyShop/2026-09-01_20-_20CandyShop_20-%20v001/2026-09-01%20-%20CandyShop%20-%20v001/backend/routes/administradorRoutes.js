
const express = require('express');
const router = express.Router();

const adminMiddleware = require('../Middleware/adminMiddleware');

const {
    carregarIndicadores
} = require('../controllers/administradorController');

// Protege as rotas administrativas
router.use(adminMiddleware);

// Indicadores do painel
router.get('/indicadores', carregarIndicadores);

module.exports = router;
