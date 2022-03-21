import signup from '../support/pages/signup'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    context('quando o usuário é novato', function () {
        const user = {
            name: 'Odirlei Alves',
            email: 'dilei@samuraibs.com',
            password: 'pwd123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

        })

        it('Deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

            //cy.intercept('POST', '/users', {
            //    statusCode: 200
            //}).as('postUser')

            //cy.wait('@postUser')

            //cy.wait{1000} Função para pegar o Toaster
            //cy.get('body')
        })
    })

    context('Quando o email já existe', function () {
        const user = {
            name: 'Wilson Alves',
            email: 'wa@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

        })

        it('Não deve cadastrar o usuário', function () {
            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })

    })

    context('Quando o email é incorreto', function () {
        const user = {
            name: 'Maria Paula Olsen',
            email: 'olsen.yahoo.com',
            password: 'pwd123',
        }

        it('Deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('Quando a senha é muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']
        
        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('Não deve cadastrar com a senha: ' + p, function () {
                const user = { name: 'Jason Friday', email: 'friday@gmail.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function() {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    
    })

    context('Quando não preencho nenhum dos campos', function() {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function() {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert) {
            it('Deve exibir ' + alert.toLowerCase(), function() {
                signupPage.alertHaveText(alert)
            })
        })
    })

})