const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');
const methodNotAllowed = require('../middleware/methodNotAllowed');


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
 *           example: "aluno1@universidade.edu.br"
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: "123456"
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
 *           example: "aluno1@universidade.edu.br"
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
 *                       example: "aluno1@universidade.edu.br"
 *                     name:
 *                       type: string
 *                       example: "Aluno 1"
 *                     type:
 *                       type: string
 *                       example: "aluno"
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
 *       405:
 *         description: Método não permitido
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
 *                   example: "Método não permitido para este endpoint"
 *                 code:
 *                   type: string
 *                   example: "METHOD_NOT_ALLOWED"
 *                 allowedMethods:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["POST"]
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
 *     description: Envia um email de recuperação de senha.
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
 *       405:
 *         description: Método não permitido
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
 *                   example: "Método não permitido para este endpoint"
 *                 code:
 *                   type: string
 *                   example: "METHOD_NOT_ALLOWED"
 *                 allowedMethods:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["POST"]
 */
router.post('/remember-password', (req, res) => {
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
 *         example: "aluno1@universidade.edu.br"
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
 *       405:
 *         description: Método não permitido
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
 *                   example: "Método não permitido para este endpoint"
 *                 code:
 *                   type: string
 *                   example: "METHOD_NOT_ALLOWED"
 *                 allowedMethods:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["GET"]
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

// Retorno 405 para métodos não permitidos
router.get('/login', methodNotAllowed(['POST']));
router.put('/login', methodNotAllowed(['POST']));
router.delete('/login', methodNotAllowed(['POST']));
router.patch('/login', methodNotAllowed(['POST']));

router.get('/remember-password', methodNotAllowed(['POST']));
router.put('/remember-password', methodNotAllowed(['POST']));
router.delete('/remember-password', methodNotAllowed(['POST']));
router.patch('/remember-password', methodNotAllowed(['POST']));

router.post('/status', methodNotAllowed(['GET']));
router.put('/status', methodNotAllowed(['GET']));
router.delete('/status', methodNotAllowed(['GET']));
router.patch('/status', methodNotAllowed(['GET']));


module.exports = router; 