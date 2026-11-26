
DROP TABLE IF EXISTS
    progresso_aula,
    material,
    tipo_material,
    aula,
    topico,
    disciplina,
    assinatura,
    opcao_plano,
    plano,
    perfil,
    curso,
    usuario
CASCADE;
CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL
        CHECK (tipo_usuario IN ('aluno', 'admin')),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 2. PERFIL
-- Relação 1:1 opcional: cada perfil pertence a um único usuário.
-- A aplicação deverá criar o perfil quando necessário.
CREATE TABLE perfil (
    id_perfil INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    foto TEXT,
    nome_exibicao VARCHAR(80),
    CONSTRAINT fk_perfil_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
);

-- 3. PLANO E OPÇÕES DE DURAÇÃO
CREATE TABLE plano (
    id_plano INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    descricao TEXT
);

CREATE TABLE opcao_plano (
    id_opcao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_plano INTEGER NOT NULL,
    duracao_meses INTEGER NOT NULL CHECK (duracao_meses > 0),
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    CONSTRAINT fk_opcao_plano
        FOREIGN KEY (id_plano)
        REFERENCES plano (id_plano),
    CONSTRAINT uq_duracao_por_plano
        UNIQUE (id_plano, duracao_meses)
);

-- 4. ASSINATURAS
CREATE TABLE assinatura (
    id_assinatura INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_opcao INTEGER NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA'
        CHECK (status IN ('ATIVA', 'EXPIRADA', 'CANCELADA')),
    CONSTRAINT fk_assinatura_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario),
    CONSTRAINT fk_assinatura_opcao
        FOREIGN KEY (id_opcao)
        REFERENCES opcao_plano (id_opcao),
    CONSTRAINT ck_periodo_assinatura
        CHECK (data_fim > data_inicio)
);

-- Impede duas assinaturas marcadas como ATIVA para o mesmo usuário.
-- A aplicação também deve atualizar o status quando a assinatura vencer.
CREATE UNIQUE INDEX uq_assinatura_ativa_usuario
    ON assinatura (id_usuario)
    WHERE status = 'ATIVA';

-- 5. CURSO, DISCIPLINAS, TÓPICOS E AULAS
CREATE TABLE curso (
    id_curso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT
);

CREATE TABLE disciplina (
    id_disciplina INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_curso INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    CONSTRAINT fk_disciplina_curso
        FOREIGN KEY (id_curso)
        REFERENCES curso (id_curso),
    CONSTRAINT uq_disciplina_no_curso
        UNIQUE (id_curso, nome)
);

CREATE TABLE topico (
    id_topico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_disciplina INTEGER NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL CHECK (ordem > 0),
    CONSTRAINT fk_topico_disciplina
        FOREIGN KEY (id_disciplina)
        REFERENCES disciplina (id_disciplina),
    CONSTRAINT uq_ordem_topico_disciplina
        UNIQUE (id_disciplina, ordem),
    CONSTRAINT uq_nome_topico_disciplina
        UNIQUE (id_disciplina, nome)
);

CREATE TABLE aula (
    id_aula INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_topico INTEGER NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    video_url TEXT,
    ordem INTEGER NOT NULL CHECK (ordem > 0),
    CONSTRAINT fk_aula_topico
        FOREIGN KEY (id_topico)
        REFERENCES topico (id_topico),
    CONSTRAINT uq_ordem_aula_topico
        UNIQUE (id_topico, ordem)
);

-- 6. MATERIAIS
-- id_aula aceita NULL para permitir materiais gerais do curso.
CREATE TABLE tipo_material (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE material (
    id_material INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_aula INTEGER,
    id_tipo INTEGER NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    arquivo TEXT NOT NULL,
    data_publicacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_material_aula
        FOREIGN KEY (id_aula)
        REFERENCES aula (id_aula),
    CONSTRAINT fk_material_tipo
        FOREIGN KEY (id_tipo)
        REFERENCES tipo_material (id_tipo)
);

-- 7. PROGRESSO
-- Chave primária composta: o mesmo usuário só tem um registro por aula.
CREATE TABLE progresso_aula (
    id_usuario INTEGER NOT NULL,
    id_aula INTEGER NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    data_conclusao TIMESTAMP,
    PRIMARY KEY (id_usuario, id_aula),
    CONSTRAINT fk_progresso_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario),
    CONSTRAINT fk_progresso_aula
        FOREIGN KEY (id_aula)
        REFERENCES aula (id_aula),
    CONSTRAINT ck_data_conclusao
        CHECK (
            (concluida = FALSE AND data_conclusao IS NULL)
            OR
            (concluida = TRUE AND data_conclusao IS NOT NULL)
        )
);

-- Índices auxiliares para consultas frequentes pelas chaves estrangeiras.
CREATE INDEX idx_assinatura_usuario ON assinatura (id_usuario);
CREATE INDEX idx_disciplina_curso ON disciplina (id_curso);
CREATE INDEX idx_topico_disciplina ON topico (id_disciplina);
CREATE INDEX idx_aula_topico ON aula (id_topico);
CREATE INDEX idx_material_aula ON material (id_aula);
CREATE INDEX idx_material_tipo ON material (id_tipo);
CREATE INDEX idx_progresso_aula ON progresso_aula (id_aula);

INSERT INTO usuario
    (id_usuario, nome, email, senha_hash, tipo_usuario)
OVERRIDING SYSTEM VALUE
VALUES
    (1,  'Administrador Aprova+', 'admin@aprova.com.br', '$2b$10$tK.Eziy65IHfKJYRGEYdnuPKBB5WnzYU0HD2ohWwovVZo419.ke6u', 'admin'),
    (2,  'Ana Clara Martins',      'aluno1@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (3,  'Bruno Henrique Souza',   'bruno.souza@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (4,  'Camila Oliveira Lima',  'camila.lima@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (5,  'Daniel Costa Ribeiro',  'daniel.ribeiro@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (6,  'Eduarda Ferreira Alves','eduarda.alves@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (7,  'Felipe Santos Rocha',   'felipe.rocha@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (8,  'Gabriela Mendes Silva', 'gabriela.silva@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (9,  'Heitor Almeida Nunes',  'heitor.nunes@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno'),
    (10, 'Isabela Carvalho Dias', 'isabela.dias@aprova.com.br', '$2b$10$q4SCtxVlf5P3U3/rypoAY.77q.MJgWCU9lUudnwxRjSFepuSAI2pu', 'aluno');

-- 2. PERFIS (relação 1:1: um perfil para cada usuário)
INSERT INTO perfil (id_perfil, id_usuario, foto, nome_exibicao)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1,  'https://placehold.co/200x200?text=Admin', 'Equipe Aprova+'),
    (2, 2,  'https://placehold.co/200x200?text=Ana', 'Ana Clara'),
    (3, 3,  'https://placehold.co/200x200?text=Bruno', 'Bruno'),
    (4, 4,  'https://placehold.co/200x200?text=Camila', 'Camila'),
    (5, 5,  'https://placehold.co/200x200?text=Daniel', 'Daniel'),
    (6, 6,  'https://placehold.co/200x200?text=Eduarda', 'Eduarda'),
    (7, 7,  'https://placehold.co/200x200?text=Felipe', 'Felipe'),
    (8, 8,  'https://placehold.co/200x200?text=Gabriela', 'Gabriela'),
    (9, 9,  'https://placehold.co/200x200?text=Heitor', 'Heitor'),
    (10, 10, 'https://placehold.co/200x200?text=Isabela', 'Isabela');

-- 3. PLANOS
INSERT INTO plano (id_plano, nome, descricao)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'Essencial', 'Acesso aos conteúdos fundamentais.'),
    (2, 'Reforço', 'Revisão de conteúdos escolares.'),
    (3, 'ENEM', 'Preparação direcionada ao ENEM.'),
    (4, 'Vestibulares', 'Preparação para vestibulares.'),
    (5, 'Matemática', 'Trilha de estudos de Matemática.'),
    (6, 'Linguagens', 'Trilha de estudos de Linguagens.'),
    (7, 'Ciências da Natureza', 'Trilha de Ciências da Natureza.'),
    (8, 'Ciências Humanas', 'Trilha de Ciências Humanas.'),
    (9, 'Intensivo', 'Revisão intensiva para provas.'),
    (10, 'Completo', 'Acesso ampliado às trilhas de estudo.');

-- 4. OPÇÕES DE PLANO (10 registros)
INSERT INTO opcao_plano (id_opcao, id_plano, duracao_meses, preco)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 1, 29.90),
    (2, 2, 1, 39.90),
    (3, 3, 1, 49.90),
    (4, 4, 3, 129.90),
    (5, 5, 3, 99.90),
    (6, 6, 3, 99.90),
    (7, 7, 6, 189.90),
    (8, 8, 6, 189.90),
    (9, 9, 6, 219.90),
    (10, 10, 12, 399.90);

-- 5. ASSINATURAS (10 registros; somente uma ativa por usuário)
INSERT INTO assinatura
    (id_assinatura, id_usuario, id_opcao, data_inicio, data_fim, status)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 2,  3,  '2026-11-01', '2026-12-01', 'ATIVA'),
    (2, 3,  1,  '2026-10-15', '2026-11-15', 'EXPIRADA'),
    (3, 3,  4,  '2026-11-16', '2027-02-16', 'ATIVA'),
    (4, 4,  2,  '2026-11-02', '2026-12-02', 'ATIVA'),
    (5, 5,  5,  '2026-10-20', '2027-01-20', 'ATIVA'),
    (6, 6,  6,  '2026-11-03', '2027-02-03', 'ATIVA'),
    (7, 7,  7,  '2026-11-04', '2027-05-04', 'ATIVA'),
    (8, 8,  8,  '2026-11-05', '2027-05-05', 'ATIVA'),
    (9, 9,  9,  '2026-11-06', '2027-05-06', 'ATIVA'),
    (10, 10, 10, '2026-11-07', '2027-11-07', 'ATIVA');

-- 6. CURSOS
INSERT INTO curso (id_curso, nome, descricao)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'Matemática do Zero', 'Fundamentos de Matemática com aulas passo a passo.'),
    (2, 'Português e Interpretação', 'Gramática, leitura e interpretação textual.'),
    (3, 'Física para o ENEM', 'Conceitos e exercícios de Física para o ENEM.'),
    (4, 'Química Essencial', 'Fundamentos de Química e resolução de questões.'),
    (5, 'Biologia Geral', 'Citologia, genética, ecologia e fisiologia.'),
    (6, 'História do Brasil', 'Principais períodos e acontecimentos da história brasileira.'),
    (7, 'Geografia em Foco', 'Geografia física, humana e atualidades.'),
    (8, 'Redação Nota 1000', 'Planejamento, argumentação e estrutura da redação.'),
    (9, 'Inglês para Provas', 'Vocabulário e interpretação de textos em inglês.'),
    (10, 'Filosofia e Sociologia', 'Conceitos fundamentais das Ciências Humanas.');

-- 7. DISCIPLINAS (uma disciplina vinculada a cada curso)
INSERT INTO disciplina (id_disciplina, id_curso, nome)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 'Fundamentos matemáticos'),
    (2, 2, 'Língua Portuguesa'),
    (3, 3, 'Mecânica'),
    (4, 4, 'Química geral'),
    (5, 5, 'Citologia'),
    (6, 6, 'Brasil Colônia'),
    (7, 7, 'Geografia física'),
    (8, 8, 'Produção textual'),
    (9, 9, 'Reading comprehension'),
    (10, 10, 'Pensamento social');

-- 8. TÓPICOS (um tópico vinculado a cada disciplina)
INSERT INTO topico (id_topico, id_disciplina, nome, descricao, ordem)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 'Operações básicas', 'Adição, subtração, multiplicação e divisão.', 1),
    (2, 2, 'Interpretação de texto', 'Estratégias para compreender diferentes textos.', 1),
    (3, 3, 'Movimento uniforme', 'Conceitos de velocidade e deslocamento.', 1),
    (4, 4, 'Estrutura atômica', 'Partículas fundamentais e modelos atômicos.', 1),
    (5, 5, 'Organelas celulares', 'Estrutura e função das organelas.', 1),
    (6, 6, 'Período colonial', 'Sociedade e economia no Brasil Colônia.', 1),
    (7, 7, 'Clima e vegetação', 'Elementos climáticos e formações vegetais.', 1),
    (8, 8, 'Estrutura da redação', 'Introdução, desenvolvimento e conclusão.', 1),
    (9, 9, 'Reading strategies', 'Técnicas de leitura e compreensão em inglês.', 1),
    (10, 10, 'Cultura e sociedade', 'Conceitos introdutórios das Ciências Humanas.', 1);

-- 9. AULAS (uma aula vinculada a cada tópico)
INSERT INTO aula (id_aula, id_topico, titulo, descricao, video_url, ordem)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 'As quatro operações', 'Introdução às operações fundamentais.', 'https://www.youtube.com/watch?v=8jP2x0Q1-example', 1),
    (2, 2, 'Como interpretar textos', 'Leitura ativa e identificação de ideias centrais.', 'https://www.youtube.com/watch?v=8jP2x0Q2-example', 1),
    (3, 3, 'Introdução ao movimento uniforme', 'Velocidade constante e função horária.', 'https://www.youtube.com/watch?v=8jP2x0Q3-example', 1),
    (4, 4, 'Conhecendo o átomo', 'Prótons, nêutrons e elétrons.', 'https://www.youtube.com/watch?v=8jP2x0Q4-example', 1),
    (5, 5, 'A célula e suas organelas', 'Visão geral das estruturas celulares.', 'https://www.youtube.com/watch?v=8jP2x0Q5-example', 1),
    (6, 6, 'Panorama do Brasil Colônia', 'Contexto histórico da colonização.', 'https://www.youtube.com/watch?v=8jP2x0Q6-example', 1),
    (7, 7, 'Elementos do clima', 'Temperatura, umidade e pressão atmosférica.', 'https://www.youtube.com/watch?v=8jP2x0Q7-example', 1),
    (8, 8, 'Como construir uma introdução', 'Tema, tese e contextualização.', 'https://www.youtube.com/watch?v=8jP2x0Q8-example', 1),
    (9, 9, 'Finding the main idea', 'Identificação da ideia principal de um texto.', 'https://www.youtube.com/watch?v=8jP2x0Q9-example', 1),
    (10, 10, 'O que é cultura?', 'Introdução ao conceito de cultura.', 'https://www.youtube.com/watch?v=8jP2x0Q10-example', 1);

-- 10. TIPOS DE MATERIAL
INSERT INTO tipo_material (id_tipo, nome)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 'PDF'),
    (2, 'Slides'),
    (3, 'Resumo'),
    (4, 'Lista de exercícios'),
    (5, 'Mapa mental'),
    (6, 'Artigo'),
    (7, 'Infográfico'),
    (8, 'Planilha'),
    (9, 'Podcast'),
    (10, 'Material complementar');

-- 11. MATERIAIS (10 registros)
INSERT INTO material
    (id_material, id_aula, id_tipo, titulo, descricao, arquivo)
OVERRIDING SYSTEM VALUE
VALUES
    (1, 1, 1, 'Apostila de operações básicas', 'Material em PDF para acompanhar a aula.', 'https://placehold.co/600x800?text=Apostila+Matematica'),
    (2, 2, 3, 'Resumo de interpretação', 'Resumo dos principais conceitos da aula.', 'https://placehold.co/600x800?text=Resumo+Portugues'),
    (3, 3, 4, 'Exercícios de movimento uniforme', 'Questões para praticar o conteúdo.', 'https://placehold.co/600x800?text=Exercicios+Fisica'),
    (4, 4, 1, 'Apostila de estrutura atômica', 'Texto de apoio sobre modelos atômicos.', 'https://placehold.co/600x800?text=Apostila+Quimica'),
    (5, 5, 5, 'Mapa mental das organelas', 'Esquema visual das estruturas celulares.', 'https://placehold.co/600x800?text=Mapa+Biologia'),
    (6, 6, 2, 'Slides: Brasil Colônia', 'Apresentação utilizada na aula.', 'https://placehold.co/600x800?text=Slides+Historia'),
    (7, 7, 7, 'Infográfico sobre clima', 'Infográfico de elementos climáticos.', 'https://placehold.co/600x800?text=Infografico+Geografia'),
    (8, 8, 4, 'Proposta de redação', 'Atividade para praticar a introdução.', 'https://placehold.co/600x800?text=Proposta+Redacao'),
    (9, 9, 6, 'Texto para leitura em inglês', 'Texto complementar para interpretação.', 'https://placehold.co/600x800?text=Reading+English'),
    (10, 10, 10, 'Leitura complementar: cultura', 'Material adicional sobre cultura e sociedade.', 'https://placehold.co/600x800?text=Cultura+Sociedade');

-- 12. PROGRESSO (10 registros)
INSERT INTO progresso_aula (id_usuario, id_aula, concluida, data_conclusao)
VALUES
    (2, 1, TRUE,  '2026-11-10 14:30:00'),
    (2, 2, FALSE, NULL),
    (3, 3, TRUE,  '2026-11-11 10:15:00'),
    (3, 4, FALSE, NULL),
    (4, 5, TRUE,  '2026-11-12 16:00:00'),
    (5, 6, FALSE, NULL),
    (6, 7, TRUE,  '2026-11-13 09:20:00'),
    (7, 8, FALSE, NULL),
    (8, 9, TRUE,  '2026-11-14 11:45:00'),
    (9, 10, FALSE, NULL);

-- Atualiza as sequências das colunas IDENTITY após a inserção de IDs explícitos.
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), (SELECT MAX(id_usuario) FROM usuario));
SELECT setval(pg_get_serial_sequence('perfil', 'id_perfil'), (SELECT MAX(id_perfil) FROM perfil));
SELECT setval(pg_get_serial_sequence('plano', 'id_plano'), (SELECT MAX(id_plano) FROM plano));
SELECT setval(pg_get_serial_sequence('opcao_plano', 'id_opcao'), (SELECT MAX(id_opcao) FROM opcao_plano));
SELECT setval(pg_get_serial_sequence('assinatura', 'id_assinatura'), (SELECT MAX(id_assinatura) FROM assinatura));
SELECT setval(pg_get_serial_sequence('curso', 'id_curso'), (SELECT MAX(id_curso) FROM curso));
SELECT setval(pg_get_serial_sequence('disciplina', 'id_disciplina'), (SELECT MAX(id_disciplina) FROM disciplina));
SELECT setval(pg_get_serial_sequence('topico', 'id_topico'), (SELECT MAX(id_topico) FROM topico));
SELECT setval(pg_get_serial_sequence('aula', 'id_aula'), (SELECT MAX(id_aula) FROM aula));
SELECT setval(pg_get_serial_sequence('tipo_material', 'id_tipo'), (SELECT MAX(id_tipo) FROM tipo_material));
SELECT setval(pg_get_serial_sequence('material', 'id_material'), (SELECT MAX(id_material) FROM material));
