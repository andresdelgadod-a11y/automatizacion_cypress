describe('CP-DEN-003: Listado y filtrado de denuncias', () => {
  beforeEach(() => {
    // Iniciar sesión como admin
    cy.visit('http://localhost:3000/auth/login')
    cy.fixture('datos-prueba').then((datos) => {
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for')
        .then((id) => cy.get(`#${id}`).type(datos.admin_valido.correo))

      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for')
        .then((id) => cy.get(`#${id}`).type(datos.admin_valido.contraseña, { log: false }))

      cy.get('button[type="submit"]').click()
    })

    // El admin aterriza directo en su panel
    cy.contains('h1', 'Panel de Administración', { timeout: 40000 }).should('be.visible')
    cy.location('pathname').should('eq', '/admin/panel')
  })

  it('Filtra y muestra solo los casos con estado "Tomaron el caso"', () => {
    // Contenedor del listado (el único .space-y-3 con scroll)
    const listado = 'div.space-y-3.overflow-y-auto'

    // Aplicar el filtro de estado
    cy.get('select').eq(0).select('tomaron_el_caso')

    // Cypress reintenta hasta que React actualice el listado:
    // deben aparecer casos tomados y desaparecer los "En revisión"
    cy.get(listado).should('contain.text', 'Caso tomado')
    cy.get(listado).should('not.contain.text', 'En revisión')

    // Cada tarjeta del listado debe ser un caso tomado
    cy.get(`${listado} > div`).each(($tarjeta) => {
      cy.wrap($tarjeta)
        .should('contain.text', 'Caso tomado')
        .and('not.contain.text', 'En revisión')
    })

    // El contador del título coincide con las tarjetas mostradas
    cy.get(`${listado} > div`).its('length').then((n) => {
      cy.contains('h2', `Gestión de denuncias (${n})`).should('be.visible')
    })
  })
})