erDiagram
    %% Definição de Entidades com Atributos
    
    USUARIO {
        int id_usuario PK
        varchar nome
        varchar email
        varchar matricula
        varchar perfil_acesso
        int id_setor FK
    }
    
    SETOR {
        int id_setor PK
        varchar nome_setor
        varchar sigla
        varchar responsavel
    }
    
    DOCUMENTO {
        int id_documento PK
        varchar titulo
        varchar tipo_documento
        datetime data_criacao
        int versao
        varchar caminho_arquivo
        int id_usuario_criador FK
        int id_setor FK
    }
    
    PPC {
        int id_ppc PK
        int id_documento FK
        varchar codigo_curso
        varchar nome_curso
        int carga_horaria
    }
    
    FLUXO_APROVACAO {
        int id_fluxo PK
        int id_documento FK
        varchar status
        datetime data_solicitacao
        datetime data_conclusao
    }
    
    LOG_ACESSO {
        int id_log PK
        int id_usuario FK
        int id_documento FK
        varchar tipo_acao
        datetime data_hora
        varchar ip_origem
    }
    
    %% Relacionamentos com Cardinalidade
    
    %% Usuario N:1 Setor
    USUARIO }o--|| SETOR : "pertence_a"
    
    %% Documento N:1 Usuario (criador)
    DOCUMENTO }o--|| USUARIO : "criado_por"
    
    %% Documento N:1 Setor
    DOCUMENTO }o--|| SETOR : "vinculado_a"
    
    %% PPC 1:1 Documento (herança)
    PPC ||--|| DOCUMENTO : "herda_de"
    
    %% FluxoAprovacao N:1 Documento
    FLUXO_APROVACAO }o--|| DOCUMENTO : "referencia"
    
    %% LogAcesso N:1 Usuario
    LOG_ACESSO }o--|| USUARIO : "registra_usuario"
    
    %% LogAcesso N:1 Documento
    LOG_ACESSO }o--|| DOCUMENTO : "registra_documento"
