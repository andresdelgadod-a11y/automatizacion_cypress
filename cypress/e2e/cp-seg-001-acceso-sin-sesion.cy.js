// CP-SEG-001: Acceso sin sesión -> redirección a inicio de sesión
describe('CP-SEG-001: Protección de rutas sin sesión', () => {
  const rutasProtegidas = [
    '/ciudadano/panel',
    '/revisor/panel',
    '/admin/panel',
  ]

  rutasProtegidas.forEach((ruta) => {
    it(`Redirige a login al intentar entrar a ${ruta} sin sesión`, () => {
      cy.visit(ruta, { failOnStatusCode: false })

      cy.url({ timeout: 10000 }).should('include', '/auth/login')
      cy.contains('Inicia sesión en tu cuenta').should('be.visible')
      cy.get('#correo').should('be.visible')
    })
  })
})