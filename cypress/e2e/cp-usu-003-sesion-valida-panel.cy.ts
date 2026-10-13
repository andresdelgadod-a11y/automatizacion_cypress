describe('CP-USU-003: Inicio válido y verificación de panel', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth/login')
  })

  it('Ingresa con credenciales correctas y muestra panel de usuario', () => {
    cy.fixture('datos-prueba').then((datos) => {
      // La app muestra un alert de bienvenida al iniciar sesión
      const alerta = cy.stub().as('alerta')
      cy.on('window:alert', alerta)

      // Ingresar credenciales válidas
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for')
        .then((id) => cy.get(`#${id}`).type(datos.usuario_valido2.correo))

      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for')
        .then((id) => cy.get(`#${id}`).type(datos.usuario_valido2.contraseña, { log: false }))

      cy.get('button[type="submit"]').click()

      // Redirige al panel del ciudadano
      cy.url({ timeout: 15000 }).should('include', '/ciudadano/panel')

      
      // Elementos reales del panel
      cy.contains('h1', 'Mis denuncias', { timeout: 10000 }).should('be.visible')
      cy.contains('Bienvenido,').should('be.visible')
      cy.contains('Total denuncias').should('be.visible')
      cy.contains('Crear denuncia').should('be.visible')
    })
  })
})