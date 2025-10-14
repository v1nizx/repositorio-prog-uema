-- Criação das tabelas baseadas no diagrama ER

CREATE TABLE setor (
    id_setor SERIAL PRIMARY KEY,
    nome_setor VARCHAR(100) NOT NULL,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    responsavel VARCHAR(100)
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    perfil_acesso VARCHAR(20) NOT NULL CHECK (perfil_acesso IN ('Administrador', 'Editor', 'Consultor')),
    id_setor INTEGER NOT NULL,
    FOREIGN KEY (id_setor) REFERENCES setor(id_setor) ON DELETE RESTRICT
);

CREATE TABLE documento (
    id_documento SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    versao INTEGER DEFAULT 1,
    caminho_arquivo VARCHAR(500) NOT NULL,
    id_usuario_criador INTEGER NOT NULL,
    id_setor INTEGER NOT NULL,
    FOREIGN KEY (id_usuario_criador) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_setor) REFERENCES setor(id_setor) ON DELETE RESTRICT
);

CREATE TABLE ppc (
    id_ppc SERIAL PRIMARY KEY,
    id_documento INTEGER NOT NULL UNIQUE,
    codigo_curso VARCHAR(20) NOT NULL,
    nome_curso VARCHAR(150) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE
);

CREATE TABLE fluxo_aprovacao (
    id_fluxo SERIAL PRIMARY KEY,
    id_documento INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pendente', 'Aprovado', 'Rejeitado')),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE
);

CREATE TABLE log_acesso (
    id_log SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_documento INTEGER NOT NULL,
    tipo_acao VARCHAR(50) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origem VARCHAR(45),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE
);

-- Índices para otimização de consultas
CREATE INDEX idx_documento_usuario ON documento(id_usuario_criador);
CREATE INDEX idx_documento_setor ON documento(id_setor);
CREATE INDEX idx_log_usuario ON log_acesso(id_usuario);
CREATE INDEX idx_log_documento ON log_acesso(id_documento);
CREATE INDEX idx_log_data_hora ON log_acesso(data_hora);
