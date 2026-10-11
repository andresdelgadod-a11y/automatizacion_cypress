describe('CP-USU-001: Registro con datos válidos', () => {
  beforeEach(() => {
    cy.visit('/auth/registro')
  })

  it('Registra usuario y valida la respuesta', () => {
    // Generar correo único para cada ejecución
    const correoPrueba = `prueba_${Date.now()}@ejemplo.com`
    const contraseña = "ClaveNueva123*"

    // Llenar campos por etiqueta visible
    cy.contains('label', 'Nombre completo')
      .invoke('attr', 'for').then(id => cy.get(`#${id}`).type('Juan Pérez Prueba'))

    cy.contains('label', 'Correo electrónico')
      .invoke('attr', 'for').then(id => cy.get(`#${id}`).type(correoPrueba))

    cy.contains('label', 'Contraseña')
      .invoke('attr', 'for').then(id => cy.get(`#${id}`).type(contraseña))

    cy.contains('label', 'Confirmar contraseña')
      .invoke('attr', 'for').then(id => cy.get(`#${id}`).type(contraseña))

    // Enviar formulario
    cy.get('button[type="submit"]').click()

    // Esperar respuesta y verificar resultado
    cy.get('body', { timeout: 15000 }).then(($body) => {
      if ($body.text().includes('Error al registrar')) {
        // Si falla, capturamos el error exacto
        cy.log('⚠️ Error del servidor — revisa la consola del backend')
        // Para el informe, marcamos qué validación falta
        throw new Error('El registro falla en el servidor — revisar requisitos de contraseña')
      } else {
        // Éxito: redirección o mensaje de confirmación
        cy.url({ timeout: 15000 }).should('not.include', '/registro')
      }
    })
  })
})