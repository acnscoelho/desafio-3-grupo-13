const authService = require('../services/authService');

/**
 * Middleware para verificar autenticação JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso não fornecido',
      code: 'TOKEN_MISSING'
    });
  }

  const result = authService.verifyToken(token);
  
  if (!result.valid) {
    return res.status(401).json({
      success: false,
      message: result.message,
      code: 'INVALID_TOKEN'
    });
  }

  // Adicionar informações do usuário ao request
  req.user = result.user;
  next();
};

/**
 * Middleware para verificar se o usuário é administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  if (req.user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

/**
 * Middleware para verificar se o usuário é professor ou admin
 */
const requireProfessorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado',
      code: 'NOT_AUTHENTICATED'
    });
  }

  if (req.user.type !== 'professor' && req.user.type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas professores e administradores podem acessar este recurso',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireProfessorOrAdmin
}; 