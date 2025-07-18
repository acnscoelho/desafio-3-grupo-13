const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const postRememberPassword = require('../fixtures/postRememberPassword.json');

describe('POST /rememberPassword ', () => {
    it ('Deve retornar 200 quando quando e-mail de recuperação de senha for enviado', async () => {
        const bodyRememberPassword = { ...postRememberPassword } //clone
        
        const resposta = await request(process.env.BASE_URL)
            .post('/api/auth/remember-password')
            .set('Content-Type', 'application/json')
            .send(bodyRememberPassword)
        expect(resposta.status).to.equal(200);
        console.log(resposta.body)
    })
})