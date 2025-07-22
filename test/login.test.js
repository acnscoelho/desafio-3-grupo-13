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

        it('Deve retornar 423 quando for bloqueado após 3 tentativas de login com credenciais inválidas', async ()=> {
        const bodyLogin = { ...postLogin };
        bodyLogin.password = '987654'

        const resposta1 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta1.status).to.equal(400);
        expect(resposta1.body.code).to.equal('INVALID_CREDENTIALS');

        const resposta2 = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin);

        expect(resposta2.status).to.equal(400);
        expect(resposta2.body.code).to.equal('INVALID_CREDENTIALS');

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
