describe('CP-USU-002: Inicio con credenciales inválidas', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('Rechaza acceso y muestra mensaje de error', () => {
    cy.fixture('datos-prueba').then((datos) => {
      // Ingresar credenciales incorrectas
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for').then(id => {
          cy.get(`#${id}`).type(datos.credenciales_invalidas.correo)
        })

      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for').then(id => {
          cy.get(`#${id}`).type(datos.credenciales_invalidas.contraseña)
        })

      // Enviar formulario
      cy.get('button[type="submit"]').click()

      // ✅ Verificar que se queda en login
      cy.url({ timeout: 10000 }).should('include', '/login')

      // ✅ Aceptar CUALQUIER mensaje de error
      cy.get('body', { timeout: 10000 }).should(($body) => {
        const texto = $body.text().toLowerCase()
        const hayError = 
          texto.includes('credenciales') ||
          texto.includes('inválidas') ||
          texto.includes('error') ||
          texto.includes('no existe') ||
          texto.includes('incorrecto') ||
          texto.includes('fallido')
        
        expect(hayError, 'Debe mostrar mensaje de error').to.be.true
      })
    })
  })
})