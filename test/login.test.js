const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const loginData = require('../fixtures/loginData.json');

describe('POST /api/auth/login', () => {
    it('Deve retornar 200 quando e-mail e senha forem enviados', async ()=> {
        // Arrange (Preparar)
        const userCredentials = loginData.validUser;
            
        // Act (Agir)
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send(userCredentials);
            
        // Assert (Verificar)
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
})
