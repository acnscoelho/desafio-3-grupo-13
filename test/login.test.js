const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postLogin = require('../fixtures/postLogin.json');

describe('POST /login', () => {
    it('Deve retornar 200 quando e-mail e senha forem enviados', async ()=> {
        const bodyLogin = { ...postLogin };
            
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);
            
        expect(resposta.status).to.equal(200);
        expect(resposta.body.success).to.equal(true);
        expect(resposta.body.message).to.equal('Login realizado com sucesso');
        expect(resposta.body).to.have.property('token').that.is.a('string');
        expect(resposta.body).to.have.property('user').that.is.an('object');
        expect(resposta.body.user).to.have.property('id').that.is.a('number');
        expect(resposta.body.user).to.have.property('email').that.is.a('string');
        expect(resposta.body.user).to.have.property('name').that.is.a('string');
        expect(resposta.body.user).to.have.property('type').that.is.a('string');
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
        const bodyLogin = { ...postLogin };
        bodyLogin.email = 'aluno2@universidade.edu.br'

        const resposta1 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);
            
        const resposta2 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);
            
        const resposta3 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta3.status).to.equal(423);
        expect(resposta3.body.success).to.equal(false);
        expect(resposta3.body.message).to.equal('Conta bloqueada após 3 tentativas de login com credenciais inválidas. Bloqueio por 5 minutos.');
        expect(resposta3.body.code).to.equal('ACCOUNT_BLOCKED');
    });

})
