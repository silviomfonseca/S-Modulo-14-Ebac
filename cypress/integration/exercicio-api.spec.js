/// <reference types="cypress" />
//var faker = require('faker-br');
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it.only('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)      
               
           })
     });
    
     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body.usuarios[1].nome).to.equal('Gabriel Amorim')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nome = `AlunoQA ${Math.floor(Math.random() * 100000000)}`
          let email = `emailQa${Math.floor(Math.random() * 100000000)}@uol.com`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nome,
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.status).to.equal(201)
          })

     });
     
     it('Deve editar um usuário previamente cadastrado', () => {
          let nome = `mario e Luigi ${Math.floor(Math.random() * 100000000)}`
          let email = `nintendoss${Math.floor(Math.random() * 100000000)}@uol.com`
          cy.users(nome, email, "123", "true")
          .then(response => {
              let id = response.body._id

              cy.request({
                 method: 'PUT',
                 url: `usuarios/${id}`,
                 headers: { authorization: token },
                 body:
                 {
                 "nome": nome,
                 "email": email,
                 "password": "teste@!",
                 "administrador": "true"
                         }
               }).then(response => {
               expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nome = `sonic ${Math.floor(Math.random() * 100000000)}`
          let email = `sonic${Math.floor(Math.random() * 100000000)}@sega.com.br`
        cy.users(nome, email, "testeDelete", "true")
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        });
     });

     it('Deve validar email errado', () => {
     cy.request({
          method: 'POST',
          url: 'login',
          body:{
             email:  "fulano@qa.com",
             password: "qwe123"
          } ,
          failOnStatusCode: false
     }) .then((response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).to.equal('Email e/ou senha inválidos')
     })
     
     });

});
