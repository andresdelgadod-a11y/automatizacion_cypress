// CP-DEN-004: Consultar denuncias registradas del ciudadano
describe('CP-DEN-004: Consultar detalle de denuncia', () => {
  beforeEach(() => {
    cy.fixture('datos-prueba').then((datos) => {
      cy.visit('/auth/login')
      cy.get('#correo').type(datos.usuario_valido.correo)
      cy.get('#contrasena').type(datos.usuario_valido.contrasena, { log: false })
      cy.get('button[type="submit"]').click()

      cy.url({ timeout: 15000 }).should('include', '/ciudadano/panel')
    })
  })

  it('Muestra la información de las denuncias del usuario', () => {
    cy.contains('h1', 'Mis denuncias', { timeout: 10000 }).should('be.visible')

    cy.get('h3', { timeout: 10000 }).first().should('be.visible').and('not.be.empty')

    cy.contains('Prioridad:').should('be.visible')

    cy.contains('Editar').should('be.visible')
    cy.contains('Eliminar').should('be.visible')
  })
})