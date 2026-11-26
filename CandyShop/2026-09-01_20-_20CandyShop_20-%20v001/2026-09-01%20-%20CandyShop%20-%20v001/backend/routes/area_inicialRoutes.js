
const express = require('express');
const router = express.Router();

const areaInicialController = require('../controllers/area_inicialController');

const authMiddleware = require('../Middleware/authMiddleware');
const assinaturaMiddleware = require('../Middleware/assinaturaMiddleware');

// Resumo da página inicial
router.get(
    '/resumo',
    authMiddleware,
    areaInicialController.obterResumo
);

// Cursos e conteúdos
router.get(
    '/cursos',
    authMiddleware,
    assinaturaMiddleware,
    areaInicialController.listarCursos
);

router.get(
    '/disciplinas/:idCurso',
    authMiddleware,
    assinaturaMiddleware,
    areaInicialController.listarDisciplinas
);

router.get(
    '/topicos/:idDisciplina',
    authMiddleware,
    assinaturaMiddleware,
    areaInicialController.listarTopicos
);

router.get(
    '/aulas/:idTopico',
    authMiddleware,
    assinaturaMiddleware,
    areaInicialController.listarAulas
);

// Materiais
router.get(
    '/materiais',
    authMiddleware,
    assinaturaMiddleware,
    areaInicialController.listarMateriais
);

// Perfil
router.get(
    '/perfil',
    authMiddleware,
    areaInicialController.obterPerfil
);

module.exports = router;
