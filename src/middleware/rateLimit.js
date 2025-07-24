const rateLimit = require('express-rate-limit');
const authService = require('../services/authService');

/**
 * Middleware para checar bloqueio de conta antes do rate limiter
 */
const checkAccountBlocked = async (req, res, next) => {
  const email = req.body && req.body.email;
  if (!email) return next();
  const status = await authService.getAccountStatus(email);
  if (status && status.isBlocked && status.blockedUntil && new Date() < new Date(status.blockedUntil)) {
    return res.status(423).json({
      success: false,
      message: 'Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos.',
      code: 'ACCOUNT_BLOCKED'
    });
  }
  next();
};

/**
 * Rate limiter para tentativas de login
 * Limita a 5 tentativas por IP por 15 minutos
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usar IP + email para rate limiting mais específico
    return req.ip + ':' + (req.body.email || 'unknown');
  }
});

/**
 * Rate limiter geral para a API
 * Limita a 100 requisições por IP por 15 minutos
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  apiLimiter,
  checkAccountBlocked
}; 