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
    email: 'aluno1@universidade.edu.br',
    password: '123456'
  });
  console.log('Resultado:', JSON.stringify(loginSuccess, null, 2));
  console.log('');

  // Teste 2: Login com credenciais inválidas
  console.log('2️⃣ Testando login com credenciais inválidas...');
  const loginInvalid = await makeRequest('POST', '/api/auth/login', {
    email: 'aluno1@universidade.edu.br',
    password: 'senha_errada'
  });
  console.log('Resultado:', JSON.stringify(loginInvalid, null, 2));
  console.log('');

  // Teste 3: Verificar status da conta
  console.log('3️⃣ Verificando status da conta...');
  const accountStatus = await makeRequest('GET', '/api/auth/status?email=aluno1@universidade.edu.br');
  console.log('Resultado:', JSON.stringify(accountStatus, null, 2));
  console.log('');

  // Teste 4: Lembrar senha
  console.log('4️⃣ Testando funcionalidade de lembrar senha...');
  const rememberPassword = await makeRequest('POST', '/api/auth/remember-password', {
    email: 'aluno2@universidade.edu.br'
  });
  console.log('Resultado:', JSON.stringify(rememberPassword, null, 2));
  console.log('');

  // Teste 5: Login com outro aluno
  console.log('5️⃣ Testando login com outro aluno...');
  const aluno2Login = await makeRequest('POST', '/api/auth/login', {
    email: 'aluno2@universidade.edu.br',
    password: '654321'
  });
  console.log('Resultado:', JSON.stringify(aluno2Login, null, 2));
  console.log('');

  // Teste 6: Login com terceiro aluno
  console.log('6️⃣ Testando login com terceiro aluno...');
  const aluno3Login = await makeRequest('POST', '/api/auth/login', {
    email: 'aluno3@universidade.edu.br',
    password: '987654'
  });
  console.log('Resultado:', JSON.stringify(aluno3Login, null, 2));
  console.log('');

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