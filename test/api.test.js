const { app } = require('../server.js')
const request = require('supertest')
const { expect } = require('chai');

describe('Login Academico', () => {
    it('Login com sucesso', async ()=> {
        // Arrange (Preparar)
        const res = await request(app)
        // Act (Agir)
            .post('/api/auth/login')
            .send({ email: 'aluno1@universidade.edu.br', password: '123456' });
        // Assert (Verificar)
       expect(res.status).to.equal(200);
       expect(res.body).to.have.property('token').that.is.a('string');
       expect(res.body).to.have.property('user').that.is.an('object');
       expect(res.body.user).to.have.property('id').that.is.a('number');
       expect(res.body.user).to.have.property('email').that.is.a('string');
       expect(res.body.user).to.have.property('name').that.is.a('string');
    })

    it.skip('Login inválido', () => {

    })

    it.skip('Bloquear senha após 3 tentativas', () => {
        
    })

    it.skip('Lembrar senha', () => {
        
    })


})