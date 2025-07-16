const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Função para fazer requisições com tratamento de erro
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: error.message };
  }
}

// Função para testar cenários
async function runTests() {
  console.log('🧪 Iniciando testes da API Login Acadêmico\n');

  // Teste 1: Login com sucesso
  console.log('1️⃣ Testando login com sucesso...');
  const loginSuccess = await makeRequest('POST', '/api/auth/login', {
    email: 'professor@universidade.edu.br',
    password: 'senha123'
  });
  console.log('Resultado:', JSON.stringify(loginSuccess, null, 2));
  console.log('');

  // Teste 2: Login com credenciais inválidas
  console.log('2️⃣ Testando login com credenciais inválidas...');
  const loginInvalid = await makeRequest('POST', '/api/auth/login', {
    email: 'professor@universidade.edu.br',
    password: 'senha_errada'
  });
  console.log('Resultado:', JSON.stringify(loginInvalid, null, 2));
  console.log('');

  // Teste 3: Verificar status da conta
  console.log('3️⃣ Verificando status da conta...');
  const accountStatus = await makeRequest('GET', '/api/auth/status?email=professor@universidade.edu.br');
  console.log('Resultado:', JSON.stringify(accountStatus, null, 2));
  console.log('');

  // Teste 4: Lembrar senha
  console.log('4️⃣ Testando funcionalidade de lembrar senha...');
  const rememberPassword = await makeRequest('POST', '/api/auth/remember-password', {
    email: 'aluno@universidade.edu.br'
  });
  console.log('Resultado:', JSON.stringify(rememberPassword, null, 2));
  console.log('');

  // Teste 5: Login com admin
  console.log('5️⃣ Testando login com administrador...');
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'admin@universidade.edu.br',
    password: 'admin123'
  });
  console.log('Resultado:', JSON.stringify(adminLogin, null, 2));
  console.log('');

  // Teste 6: Listar usuários (apenas admin)
  if (adminLogin.success && adminLogin.token) {
    console.log('6️⃣ Testando listagem de usuários (apenas admin)...');
    const listUsers = await makeRequest('GET', '/api/auth/users', null, adminLogin.token);
    console.log('Resultado:', JSON.stringify(listUsers, null, 2));
    console.log('');
  }

  // Teste 7: Logout
  if (loginSuccess.success && loginSuccess.token) {
    console.log('7️⃣ Testando logout...');
    const logout = await makeRequest('POST', '/api/auth/logout', null, loginSuccess.token);
    console.log('Resultado:', JSON.stringify(logout, null, 2));
    console.log('');
  }

  console.log('✅ Testes concluídos!');
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { makeRequest, runTests }; 