const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postRememberPassword = require('../fixtures/postRememberPassword.json');

describe('POST /rememberPassword ', () => {
    it ('Deve retornar 200 quando e-mail de recuperação de senha for enviado', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone
        
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)
        expect(resposta.status).to.equal(200);
        expect(resposta.body.success).to.equal(true);
        expect(resposta.body.message).to.equal('Email de recuperação enviado');
        expect(resposta.body.message).to.be.a('string');
    })

    it ('Deve retornar 405 quando método inválido para este endpoint - get', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone

        const resposta = await request(process.env.BASE_URL)
            .get('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)        
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método GET não permitido para este endpoint');
        expect(resposta.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it ('Deve retornar 405 quando método inválido para este endpoint - put', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone

        const resposta = await request(process.env.BASE_URL)
            .put('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método PUT não permitido para este endpoint');
        expect(resposta.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it ('Deve retornar 405 quando método inválido para este endpoint - patch', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone

        const resposta = await request(process.env.BASE_URL)
            .patch('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)        
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método PATCH não permitido para este endpoint');
        expect(resposta.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it ('Deve retornar 405 quando método inválido para este endpoint - delete', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone

        const resposta = await request(process.env.BASE_URL)
            .delete('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)
        
        expect(resposta.status).to.equal(405);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Método DELETE não permitido para este endpoint');
        expect(resposta.body.code).to.equal('METHOD_NOT_ALLOWED');
        expect(resposta.body.allowedMethods).to.deep.equal(["POST"]);
    })

    it ('Deve retornar 400 quando email vazio', async () => {
        const bodyEmptyEmail = { ...postRememberPassword}; //clone
        bodyEmptyEmail.email = ""

        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyEmptyEmail)
        
        expect(resposta.status).to.equal(400);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Email é obrigatório');
        expect(resposta.body.code).to.equal('MISSING_EMAIL');
    })

    it ('Deve retornar 400 quando email inválido', async () => {
        const bodyInvalidEmail = { ...postRememberPassword}; //clone
        bodyInvalidEmail.email = "invalido@email.edu.br"

        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyInvalidEmail)
        
        expect(resposta.status).to.equal(400);
        expect(resposta.body.success).to.equal(false);
        expect(resposta.body.message).to.equal('Email não encontrado no sistema');
        expect(resposta.body.code).to.equal('EMAIL_NOT_FOUND');
    })

})