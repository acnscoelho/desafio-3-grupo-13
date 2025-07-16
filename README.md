# API Login Acadêmico - Sistema Universitário

## Descrição

API REST desenvolvida em JavaScript com Express para autenticação de usuários em um sistema acadêmico universitário. Esta API foi criada para estudos de teste de software e não é destinada para produção.

## Funcionalidades

- ✅ **Login com sucesso**: Autenticação válida de usuários
- ✅ **Login inválido**: Tratamento de credenciais incorretas
- ✅ **Bloqueio de conta**: Bloqueia a conta após 3 tentativas de login inválidas
- ✅ **Lembrar senha**: Funcionalidade para recuperação de senha

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **Swagger** - Documentação da API
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/emanuelefraga/desafio-3-grupo-13.git
```
2. Instale as dependências:
```bash
npm install
```

## Executando o Projeto
```bash
npm start
```

## Endpoints da API

### Base URL
```
http://localhost:3001
```

### Endpoints Disponíveis

- `POST /api/auth/login` - Realizar login
- `POST /api/auth/remember-password` - Solicitar lembrança de senha
- `GET /api/auth/status` - Verificar status da conta

## Documentação Swagger

Acesse a documentação interativa da API em:
```
http://localhost:3001/api/docs
```

## Dados de Teste

### Usuários Cadastrados (em memória)

1. **Aluno 1**
   - Email: `aluno1@universidade.edu.br`
   - Senha: `123456`
   - Tipo: `aluno`
   - Curso: `Engenharia de Software`

2. **Aluno 2**
   - Email: `aluno2@universidade.edu.br`
   - Senha: `654321`
   - Tipo: `aluno`
   - Curso: `Ciência da Computação`

3. **Aluno 3**
   - Email: `aluno3@universidade.edu.br`
   - Senha: `987654`
   - Tipo: `aluno`
   - Curso: `Sistemas de Informação`

## Estrutura do Projeto

```
├── server.js              # Servidor principal
├── package.json           # Dependências e scripts
├── README.md             # Documentação
├── .gitignore           # Arquivos ignorados pelo Git
└── src/
    ├── routes/
    │   └── auth.js       # Rotas de autenticação
    ├── middleware/
    │   ├── auth.js       # Middleware de autenticação
    │   ├── rateLimit.js  # Limitação de taxa
    │   └── methodNotAllowed.js # Validação de métodos HTTP
    ├── services/
    │   └── authService.js # Lógica de negócio
    └── config/
        └── swagger.js    # Configuração Swagger
```

## Segurança

- Senhas criptografadas com bcrypt
- Rate limiting para prevenir ataques de força bruta
- Headers de segurança com Helmet
- Tokens JWT para autenticação
- Bloqueio automático após 3 tentativas inválidas

## Testes

Para executar os testes:
```bash
npm test
```

## Observações Importantes

⚠️ **ATENÇÃO**: Esta API é destinada apenas para estudos de teste de software. Não utilize em ambiente de produção.

- Dados armazenados em memória (não persistem após reinicialização)
- Sem validações robustas de produção
- Configurações de segurança básicas para demonstração

## Licença

MIT 