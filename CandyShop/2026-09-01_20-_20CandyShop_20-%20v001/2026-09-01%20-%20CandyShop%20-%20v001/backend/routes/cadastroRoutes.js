
const express = require('express');
const router = express.Router();

const cadastroController = require('../controllers/cadastroController');

// Realiza o cadastro de um novo aluno
router.post('/', cadastroController.cadastrar);

module.exports = router;
