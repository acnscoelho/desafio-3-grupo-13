const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { loginLimiter, passwordReminderLimiter } = require('../middleware/rateLimit');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "professor@universidade.edu.br"
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica se o login foi bem-sucedido
 *         message:
 *           type: string
 *           description: Mensagem de resposta
 *         token:
 *           type: string
 *           description: Token JWT (apenas em caso de sucesso)
 *         user:
 *           type: object
 *           description: Dados do usuário (apenas em caso de sucesso)
 *         attemptsLeft:
 *           type: number
 *           description: Tentativas restantes (apenas em caso de falha)
 *     RememberPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "professor@universidade.edu.br"
 *     AccountStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         email:
 *           type: string
 *         isBlocked:
 *           type: boolean
 *         failedAttempts:
 *           type: number
 *         blockedUntil:
 *           type: string
 *           format: date-time
 *         attemptsLeft:
 *           type: number
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login no sistema
 *     description: Autentica um usuário com email e senha. Bloqueia a conta após 3 tentativas inválidas.
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "professor@universidade.edu.br"
 *                     name:
 *                       type: string
 *                       example: "João Silva"
 *                     type:
 *                       type: string
 *                       example: "professor"
 *       400:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email ou senha inválidos. Tentativas restantes: 2"
 *                 code:
 *                   type: string
 *                   example: "INVALID_CREDENTIALS"
 *                 attemptsLeft:
 *                   type: number
 *                   example: 2
 *       423:
 *         description: Conta bloqueada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos."
 *                 code:
 *                   type: string
 *                   example: "ACCOUNT_BLOCKED"
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const result = await authService.login(email, password);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      const statusCode = result.code === 'ACCOUNT_BLOCKED' ? 423 : 400;
      return res.status(statusCode).json(result);
    }

  } catch (error) {
    console.error('Erro no endpoint de login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/auth/remember-password:
 *   post:
 *     summary: Solicitar lembrança de senha
 *     description: Envia um email de recuperação de senha (simulado)
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RememberPasswordRequest'
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email de recuperação enviado"
 *       400:
 *         description: Email não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email não encontrado no sistema"
 *                 code:
 *                   type: string
 *                   example: "EMAIL_NOT_FOUND"

 */
router.post('/remember-password', passwordReminderLimiter, (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
        code: 'MISSING_EMAIL'
      });
    }

    const result = authService.rememberPassword(email);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro no endpoint de lembrança de senha:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Verificar status da conta
 *     description: Verifica se uma conta está bloqueada e quantas tentativas falhadas possui
 *     tags: [Login]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: Email do usuário
 *         example: "professor@universidade.edu.br"
 *     responses:
 *       200:
 *         description: Status da conta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountStatusResponse'
 *       400:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *                 code:
 *                   type: string
 *                   example: "USER_NOT_FOUND"
 */
router.get('/status', (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
        code: 'MISSING_EMAIL'
      });
    }

    const result = authService.getAccountStatus(email);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }

  } catch (error) {
    console.error('Erro no endpoint de status da conta:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Listar todos os usuários (Apenas Admin)
 *     description: Retorna a lista de todos os usuários cadastrados no sistema. Somente usuários com perfil de administrador estão autorizados a acessar este endpoint.
 *     tags: [Administração]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       email:
 *                         type: string
 *                         example: "professor@universidade.edu.br"
 *                       name:
 *                         type: string
 *                         example: "João Silva"
 *                       type:
 *                         type: string
 *                         example: "professor"
 *                       isBlocked:
 *                         type: boolean
 *                         example: false
 *                       failedAttempts:
 *                         type: number
 *                         example: 0
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - apenas administradores
 */
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = authService.getAllUsers();
    
    return res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 