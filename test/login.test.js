const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postLogin = require('../fixtures/postLogin.json');
const loginResponse = require('../fixtures/loginResponse.json');
const blockedResponse = require('../fixtures/blockedResponse.json');

describe('POST /login', () => {
    it('Deve retornar 200 quando e-mail e senha forem enviados', async ()=> {
        // Arrange (Preparar)
        const bodyLogin = { ...postLogin };
        const respostaEsperada = { ...loginResponse };
            
        // Act (Agir)
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);
            
        // Assert (Verificar)
        expect(resposta.status).to.equal(200);
        
        // Validar valores fixos usando o fixture
        expect(resposta.body.success).to.equal(respostaEsperada.success);
        expect(resposta.body.message).to.equal(respostaEsperada.message);
        expect(resposta.body.user.email).to.equal(respostaEsperada.user.email);
        
        // Validar tipos dos campos dinâmicos
        expect(resposta.body.token).to.be.a('string').and.to.not.be.empty;
        expect(resposta.body.user.id).to.be.a('number');
        expect(resposta.body.user.name).to.be.a('string');
        expect(resposta.body.user.type).to.be.a('string');
    })

    
it('Deve retornar 400 quando informar credencial de senha inválida', async ()=> {

        const bodyLogin = { ...postLogin };
        bodyLogin.email = 'aluno3@universidade.edu.br'

        const resposta4 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        if(resposta4.status === 400) 
        {
            expect(resposta4.status).to.equal(400);
            expect(resposta4.body.success).to.equal(false);
            expect(resposta4.body.message).to.equal('Email ou senha inválidos. Tentativas restantes: ' + resposta4.body.attemptsLeft);
            expect(resposta4.body.code).to.equal('INVALID_CREDENTIALS');
            expect(resposta4.body.attemptsLeft).to.be.a('number');
        }
        else {
                expect(resposta4.status).to.equal(423);
             }
    })

    it('Deve retornar 405 quando enviar método PUT não permitido para este endpoint', async ()=> {
        const bodyLogin = { ...postLogin };

        const resposta5 = await request(process.env.BASE_URL)
            .put('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta5.status).to.equal(405);
        expect(resposta5.body.success).to.equal(false);
        expect(resposta5.body.message).to.equal('Método PUT não permitido para este endpoint');
        expect(resposta5.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta5.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it('Deve retornar 405 quando enviar método GET não permitido para este endpoint', async ()=> {
        const bodyLogin = { ...postLogin };

        const resposta6 = await request(process.env.BASE_URL)
            .get('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta6.status).to.equal(405);
        expect(resposta6.body.success).to.equal(false);
        expect(resposta6.body.message).to.equal('Método GET não permitido para este endpoint');
        expect(resposta6.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta6.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it('Deve retornar 405 quando enviar método DELETE não permitido para este endpoint', async ()=> {
        const bodyLogin = { ...postLogin };

        const resposta7 = await request(process.env.BASE_URL)
            .delete('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta7.status).to.equal(405);
        expect(resposta7.body.success).to.equal(false);
        expect(resposta7.body.message).to.equal('Método DELETE não permitido para este endpoint');
        expect(resposta7.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta7.body.allowedMethods).to.deep.equal(["POST"]);
    })

it('Deve retornar 423 quando for bloqueado após 3 tentativas de login com credenciais inválidas', async ()=> {
    // Arrange (Preparar)
    const bodyLogin = { ...postLogin };
    bodyLogin.email = 'aluno2@universidade.edu.br'
    const respostaEsperada = { ...blockedResponse };
    let ultimaResposta;

    // Act (Agir) - Fazer 3 tentativas de login
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
        ultimaResposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);
    }

    // Assert (Verificar) - A terceira tentativa deve resultar em bloqueio
    expect(ultimaResposta.status).to.equal(423);
    expect(ultimaResposta.body.success).to.equal(respostaEsperada.success);
    expect(ultimaResposta.body.message).to.equal(respostaEsperada.message);
    expect(ultimaResposta.body.code).to.equal(respostaEsperada.code);
    });

})
