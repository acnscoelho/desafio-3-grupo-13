const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dados em memória (simulando banco de dados)
const users = [
  {
    id: 1,
    email: 'aluno1@universidade.edu.br',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    name: 'Aluno 1',
    type: 'aluno',
    course: 'Engenharia de Software',
    registration: '2023001',
    failedAttempts: 0,
    isBlocked: false,
    blockedUntil: null
  },
  {
    id: 2,
    email: 'aluno2@universidade.edu.br',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 654321
    name: 'Aluno 2',
    type: 'aluno',
    course: 'Ciência da Computação',
    registration: '2023002',
    failedAttempts: 0,
    isBlocked: false,
    blockedUntil: null
  },
  {
    id: 3,
    email: 'aluno3@universidade.edu.br',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 987654
    name: 'Aluno 3',
    type: 'aluno',
    course: 'Sistemas de Informação',
    registration: '2023003',
    failedAttempts: 0,
    isBlocked: false,
    blockedUntil: null
  }
];

// Tokens ativos (em memória)
const activeTokens = new Set();

class AuthService {
  /**
   * Realiza o login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object} Resultado do login
   */
  async login(email, password) {
    try {
      // Buscar usuário pelo email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          message: 'Email ou senha inválidos',
          code: 'INVALID_CREDENTIALS'
        };
      }

      // Verificar se a conta está bloqueada
      if (user.isBlocked) {
        if (user.blockedUntil && new Date() < user.blockedUntil) {
          return {
            success: false,
            message: `Conta bloqueada até ${user.blockedUntil.toLocaleString()}`,
            code: 'ACCOUNT_BLOCKED'
          };
        } else {
          // Desbloquear conta se o tempo expirou
          user.isBlocked = false;
          user.failedAttempts = 0;
          user.blockedUntil = null;
        }
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        // Incrementar tentativas falhadas
        user.failedAttempts += 1;
        
        // Bloquear conta após 3 tentativas
        if (user.failedAttempts >= 3) {
          user.isBlocked = true;
          user.blockedUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
          
          return {
            success: false,
            message: 'Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos.',
            code: 'ACCOUNT_BLOCKED'
          };
        }
        
        return {
          success: false,
          message: `Email ou senha inválidos. Tentativas restantes: ${3 - user.failedAttempts}`,
          code: 'INVALID_CREDENTIALS',
          attemptsLeft: 3 - user.failedAttempts
        };
      }

      // Login bem-sucedido - resetar tentativas falhadas
      user.failedAttempts = 0;
      user.isBlocked = false;
      user.blockedUntil = null;

      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          type: user.type 
        },
        process.env.JWT_SECRET || 'chave_secreta_jwt_para_estudos',
        { expiresIn: '24h' }
      );

      // Adicionar token à lista de tokens ativos
      activeTokens.add(token);

      // Preparar dados do usuário para retorno (sem senha)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        ...(user.department && { department: user.department }),
        ...(user.course && { course: user.course }),
        ...(user.registration && { registration: user.registration })
      };

      return {
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: userData
      };

    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Realiza o logout do usuário
   * @param {string} token - Token JWT
   * @returns {Object} Resultado do logout
   */
  logout(token) {
    try {
      if (activeTokens.has(token)) {
        activeTokens.delete(token);
        return {
          success: true,
          message: 'Logout realizado com sucesso'
        };
      }
      
      return {
        success: false,
        message: 'Token inválido ou já expirado',
        code: 'INVALID_TOKEN'
      };
    } catch (error) {
      console.error('Erro no logout:', error);
      return {
        success: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Verifica se um token é válido
   * @param {string} token - Token JWT
   * @returns {Object} Resultado da verificação
   */
  verifyToken(token) {
    try {
      if (!activeTokens.has(token)) {
        return {
          valid: false,
          message: 'Token inválido ou expirado'
        };
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_jwt_para_estudos');
      
      return {
        valid: true,
        user: decoded
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Token inválido'
      };
    }
  }

  /**
   * Solicita lembrança de senha
   * @param {string} email - Email do usuário
   * @returns {Object} Resultado da solicitação
   */
  rememberPassword(email) {
    try {
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          message: 'Email não encontrado no sistema',
          code: 'EMAIL_NOT_FOUND'
        };
      }

      // Em um sistema real, aqui seria enviado um email
      // Para demonstração, retornamos uma mensagem simulada
      return {
        success: true,
        message: 'Email de recuperação enviado'
      };

    } catch (error) {
      console.error('Erro na solicitação de lembrança de senha:', error);
      return {
        success: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Verifica o status da conta do usuário
   * @param {string} email - Email do usuário
   * @returns {Object} Status da conta
   */
  getAccountStatus(email) {
    try {
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        };
      }

      return {
        success: true,
        email: user.email,
        isBlocked: user.isBlocked,
        failedAttempts: user.failedAttempts,
        blockedUntil: user.blockedUntil,
        attemptsLeft: user.isBlocked ? 0 : 3 - user.failedAttempts
      };

    } catch (error) {
      console.error('Erro ao verificar status da conta:', error);
      return {
        success: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Obtém todos os usuários (para demonstração)
   * @returns {Array} Lista de usuários
   */
  getAllUsers() {
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      isBlocked: user.isBlocked,
      failedAttempts: user.failedAttempts
    }));
  }
}

module.exports = new AuthService(); 