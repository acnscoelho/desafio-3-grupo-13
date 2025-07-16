/**
 * Middleware para retornar erro 405 (Method Not Allowed)
 * @param {Array} allowedMethods - Array com os métodos HTTP permitidos
 */
const methodNotAllowed = (allowedMethods) => {
  return (req, res) => {
    res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido para este endpoint`,
      code: 'METHOD_NOT_ALLOWED',
      allowedMethods: allowedMethods
    });
  };
};

module.exports = methodNotAllowed; 