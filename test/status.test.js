const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('GET /status ', () => {
    it ('Deve retornar 200 quando informar usuário válido', async () => {
        const email = 'aluno2@universidade.edu.br';
        const resposta = await request(process.env.BASE_URL)
            .get('/api/auth/status')   
            .query({ email });    
        expect(resposta.status).to.equal(200);
        expect(resposta.body.success).to.equal(true);
        expect(resposta.body.email).to.be.a('string');
        expect(resposta.body.isBlocked).to.be.a('boolean');
        expect(resposta.body.failedAttempts).to.be.a('number');
        expect(resposta.body.blockedUntil === null || typeof resposta.body.blockedUntil === 'string').to.be.true;
        expect(resposta.body.attemptsLeft).to.be.a('number');
    })

    it ('Deve retornar 400 quando informar usuário inválido', async () => {
        const email = 'aluno111@universidade.edu.br';
        const resposta = await request(process.env.BASE_URL)
            .get('/api/auth/status')   
            .query({ email });    
        expect(resposta.status).to.equal(400);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Usuário não encontrado');
        expect(resposta.body.code).to.be.a('string');
    })

    it ('Deve retornar 405 quando enviar método POST não permitido para este endpoint', async () => {
        const email = 'aluno2@universidade.edu.br';
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/status')   
            .query({ email });    
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método POST não permitido para este endpoint');
        expect(resposta.body.code).to.be.a('string');
        expect(resposta.body.allowedMethods).to.deep.equal(['GET']);
    })

    it ('Deve retornar 405 quando enviar método PUT não permitido para este endpoint', async () => {
        const email = 'aluno2@universidade.edu.br';
        const resposta = await request(process.env.BASE_URL)
            .put('/api/auth/status')   
            .query({ email });    
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método PUT não permitido para este endpoint');
        expect(resposta.body.code).to.be.a('string');
        expect(resposta.body.allowedMethods).to.deep.equal(['GET']);
    })

    it ('Deve retornar 405 quando enviar método DELETE não permitido para este endpoint', async () => {
        const email = 'aluno2@universidade.edu.br';
        const resposta = await request(process.env.BASE_URL)
            .del('/api/auth/status')   
            .query({ email });    
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método DELETE não permitido para este endpoint');
        expect(resposta.body.code).to.be.a('string');
        expect(resposta.body.allowedMethods).to.deep.equal(['GET']);
    })
})