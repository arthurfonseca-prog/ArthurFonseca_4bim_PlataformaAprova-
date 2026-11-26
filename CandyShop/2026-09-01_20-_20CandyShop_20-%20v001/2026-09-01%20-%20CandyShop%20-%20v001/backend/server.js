

const cors = require('cors');

const express = require('express');
const path = require('path');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

// Carrega as variáveis do .env que está dentro de backend
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// Conexão com o PostgreSQL
const { query, pool } = require('./database');

// Importação das rotas
const area_inicialRoutes = require('./routes/area_inicialRoutes');
const interfaceRoutes = require('./routes/interfaceRoutes');
const loginRoutes = require('./routes/loginRoutes.js');
const cadastroRoutes = require('./routes/cadastroRoutes');
const minhas_aulasRoutes = require('./routes/minhas_aulasRoutes');
const administradorRoutes = require('./routes/administradorRoutes');
const aulasRoutes = require('./routes/aulasRoutes');
const app = express();

// Verifica se a chave da sessão foi configurada
if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET não definida no arquivo .env');
}
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

// Permite receber dados JSON
app.use(express.json());

// Configuração das sessões
app.use(session({
    store: new PgSession({
        pool: pool,
        createTableIfMissing: true
    }),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Arquivos estáticos
app.use('/imagens', express.static(path.join(__dirname, '../imagens')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Registro das rotas

app.use('/area_inicial', area_inicialRoutes);
app.use('/interface', interfaceRoutes);
app.use('/login', loginRoutes);
app.use('/cadastro', cadastroRoutes);
app.use('/minhas_aulas', minhas_aulasRoutes);
app.use('/administrador', administradorRoutes);
app.use('/aulas', aulasRoutes);
// Porta do servidor
const PORT = process.env.PORT || 3001;

// Inicialização
app.listen(PORT, async () => {
    console.log(`Servidor executando na porta ${PORT}`);

    try {
        await query('SELECT 1');
        console.log('Banco de dados conectado com sucesso!');
    } catch (error) {
        console.error('Falha na conexão com o banco:', error.message);
    }
});
