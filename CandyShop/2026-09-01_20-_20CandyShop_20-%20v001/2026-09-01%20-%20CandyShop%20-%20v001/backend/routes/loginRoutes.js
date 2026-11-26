const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

// Rota para realizar login
router.post('/', loginController.login);

// Rota para realizar logout
router.post('/logout', loginController.logout);

module.exports = router;