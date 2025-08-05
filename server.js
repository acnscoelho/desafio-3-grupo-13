const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Importações locais
const authRoutes = require('./src/routes/auth');
const swaggerSpecs = require('./src/config/swagger');
const { apiLimiter } = require('./src/middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3002'
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Login Acadêmico - Sistema Universitário',
    version: '1.0.0',
    description: 'API REST para autenticação de usuários em sistema acadêmico universitário',
    endpoints: {
      auth: '/api/auth',
      docs: '/api/docs'
    },
    users: {
      aluno1: 'aluno1@universidade.edu.br / 123456',
      aluno2: 'aluno2@universidade.edu.br / 654321',
      aluno3: 'aluno3@universidade.edu.br / 987654'
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Login Acadêmico - Documentação'
}));

// Middleware para tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    code: 'ENDPOINT_NOT_FOUND',
    availableEndpoints: {
      root: 'GET /',
      health: 'GET /health',
      auth: {
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        rememberPassword: 'POST /api/auth/remember-password',
        status: 'GET /api/auth/status',
        users: 'GET /api/auth/users'
      },
      docs: 'GET /api/docs'
    }
  });
});

// Middleware para tratamento de erros globais
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor iniciado com sucesso!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Endpoints de autenticação: http://localhost:${PORT}/api/auth`);
  console.log('');
  console.log('👥 Usuários de teste:');
  console.log('   Aluno 1: aluno1@universidade.edu.br / 123456');
  console.log('   Aluno 2: aluno2@universidade.edu.br / 654321');
  console.log('   Aluno 3: aluno3@universidade.edu.br / 987654');
  console.log('');
  console.log('⚠️  ATENÇÃO: Esta API é destinada apenas para estudos de teste de software.');
  console.log('   Não utilize em ambiente de produção.');
});

// Tratamento de sinais para graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido SIGTERM. Encerrando servidor...');
  process.exit(0);
});

module.exports = app; 