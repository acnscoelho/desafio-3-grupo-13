# API Login Acadêmico - Sistema Universitário

## Descrição

API REST desenvolvida em JavaScript com Express para autenticação de usuários em um sistema acadêmico universitário. Esta API foi criada para estudos de teste de software e não é destinada para produção.

## Funcionalidades

- ✅ **Login com sucesso**: Autenticação válida de usuários
- ✅ **Login inválido**: Tratamento de credenciais incorretas
- ✅ **Bloqueio de conta**: Bloqueia a conta após 3 tentativas de login inválidas
- ✅ **Lembrar senha**: Funcionalidade para recuperação de senha
- ✅ **Verificar status da conta**: Consulta o status do usuário (bloqueio, tentativas restantes, etc.)

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

## Testes Automatizados

Este projeto utiliza **Mocha**, **Chai** e **Supertest** para garantir a qualidade e a confiabilidade da API por meio de testes automatizados.

### Instalação das dependências de teste
Se ainda não instalou as dependências de desenvolvimento para testes, execute:

```bash
npm install --save-dev mocha@11.7.1 chai@4.3.6 supertest@7.1.3
```

### Como executar os testes

1. Certifique-se de que a API está rodando em um terminal:
   ```bash
   npm start
   ```
2. Em outro terminal, execute os testes com:
   ```bash
   npm test
   ```

Os testes são executados automaticamente sobre a API local, validando os principais fluxos e regras de negócio.

### Estrutura dos testes
Os arquivos de teste estão localizados na pasta `test/`:

- `test/login.test.js`: Testa os cenários de login, incluindo sucesso, falha e bloqueio de conta após três tentativas inválidas.
- `test/rememberPassword.test.js`: Testa o fluxo de recuperação de senha, incluindo cenários de sucesso e falha.
- `test/status.test.js`: Testa o fluxo de verificação do status da conta do usuário, incluindo cenários de sucesso e falha.

### Cenários de Teste Cobertos

#### Login (`test/login.test.js`)
- Login com sucesso utilizando credenciais válidas
- Login com senha incorreta
- Bloqueio da conta após três tentativas inválidas
- Retorno de erro para métodos HTTP não permitidos (GET, PUT, DELETE) no endpoint de login

#### Recuperação de Senha (`test/rememberPassword.test.js`)
- Solicitação de recuperação de senha com e-mail válido
- Retorno de erro para métodos HTTP não permitidos (GET, PUT, PATCH, DELETE) no endpoint de recuperação de senha
- Retorno de erro quando o e-mail está vazio
- Retorno de erro quando o e-mail é inválido (não cadastrado)

#### Status da Conta (`test/status.test.js`)
- Consulta de status com usuário válido
- Consulta de status com usuário inexistente
- Retorno de erro para métodos HTTP não permitidos (POST, PUT, DELETE) no endpoint de status

### Ferramentas utilizadas
- **Mocha (11.7.1)**: Framework de execução dos testes.
- **Chai (4.3.6)**: Biblioteca de asserções para validação dos resultados.
- **Supertest (7.1.3)**: Utilitário para testar requisições HTTP na API.

---

## Créditos

Este projeto foi desenvolvido em grupo durante a mentoria de [Julio de Lima].

**Participantes do grupo:**
- [Ana Cláudia Coelho](https://github.com/acnscoelho)
- [Emanuele Fraga](https://github.com/emanuelefraga)
- [Ludmila Ávila](https://github.com/ludmilavila)
- [Wedney Silva](https://github.com/Wedney18)

## Observações Importantes

⚠️ **ATENÇÃO**: Esta API é destinada apenas para estudos de teste de software. Não utilize em ambiente de produção.

- Dados armazenados em memória (não persistem após reinicialização)
- Sem validações robustas de produção
- Configurações de segurança básicas para demonstração

## Licença

MIT 