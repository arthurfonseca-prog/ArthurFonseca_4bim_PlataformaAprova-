const express = require('express');
const router = express.Router();

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const adminMiddleware = require('../Middleware/adminMiddleware');

const {
    listarAulas,
    listarDisciplinas,
    listarTopicos,
    cadastrarAula,
    editarAula,
    excluirAula
} = require('../controllers/aulasController');


// ========================================
// CONFIGURAÇÃO DO UPLOAD
// ========================================

// Cria a pasta de imagens caso ela ainda não exista
const pastaImagens = path.join(
    __dirname,
    '../../imagens/aulas'
);

fs.mkdirSync(pastaImagens, {
    recursive: true
});


// ========================================
// ARMAZENAMENTO DAS IMAGENS
// ========================================

const armazenamento = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, pastaImagens);
    },

    filename: (req, file, cb) => {

        const extensao = path.extname(file.originalname).toLowerCase();

        const nomeArquivo =
            `aula-${Date.now()}-${Math.round(Math.random() * 1000000)}${extensao}`;

        cb(null, nomeArquivo);

    }

});


// ========================================
// VALIDAÇÃO DAS IMAGENS
// ========================================

const upload = multer({

    storage: armazenamento,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato inválido. Envie uma imagem JPG, PNG ou WEBP.'));
        }

    }

});


// Trata os erros do Multer e retorna JSON
function receberImagem(req, res, next) {

    upload.single('imagem')(req, res, (erro) => {

        if (erro) {

            return res.status(400).json({
                mensagem: erro.message
            });

        }

        next();

    });

}


// ========================================
// PROTEÇÃO DAS ROTAS
// ========================================

router.use(adminMiddleware);


// ========================================
// ROTAS DE CONSULTA
// ========================================

router.get('/', listarAulas);

router.get('/disciplinas', listarDisciplinas);

router.get('/topicos/:idDisciplina', listarTopicos);


// ========================================
// ROTAS DE CADASTRO E EDIÇÃO
// ========================================

router.post('/', receberImagem, cadastrarAula);

router.put('/:id', receberImagem, editarAula);


// ========================================
// ROTA DE EXCLUSÃO
// ========================================

router.delete('/:id', excluirAula);


module.exports = router;