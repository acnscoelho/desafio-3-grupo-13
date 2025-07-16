const rateLimit = require('express-rate-limit');

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

/**
 * Rate limiter para solicitações de lembrança de senha
 * Limita a 3 solicitações por email por hora
 */
const passwordReminderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 solicitações
  message: {
    success: false,
    message: 'Muitas solicitações de lembrança de senha. Tente novamente em 1 hora.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  }
});

module.exports = {
  loginLimiter,
  apiLimiter,
  passwordReminderLimiter
}; 