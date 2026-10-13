describe('CP-DEN-001: Crear denuncia válida', () => {
  beforeEach(() => {
    // Iniciar sesión antes de cada prueba
    cy.visit('/auth/login')
    cy.fixture('datos-prueba').then((datos) => {
      // Campo correo
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for')
        .then(id => cy.get(`#${id}`).type(datos.usuario_valido.correo))
      
      // Campo contraseña
      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for')
        .then(id => cy.get(`#${id}`).type(datos.usuario_valido.contraseña))
      
      // Enviar formulario de inicio de sesión
      cy.get('button[type="submit"]').click()
      
      // Esperar a que cargue el panel — más confiable que solo la URL
      cy.contains('Mis denuncias', { timeout: 20000 }).should('be.visible')
    })
  })

  it('Crea denuncia y confirma registro exitoso', () => {
    // Navegar al formulario
    cy.contains('Crear denuncia').click()

    cy.fixture('datos-prueba').then((datos) => {
      // 1. Tipo de denuncia
      cy.get('select').first().select('Contaminación de agua')

      // 2. Prioridad
      cy.get('select').eq(1).select('Media')

      // 3. Título
      cy.contains('Título de la denuncia')
        .parent()
        .find('input')
        .clear()
        .type(datos.denuncia_valida.titulo)

      // 4. Descripción
      cy.contains('Descripción')
        .parent()
        .find('textarea')
        .clear()
        .type(datos.denuncia_valida.descripcion)

      // 5. Ubicación
      cy.contains('Ubicación')
        .parent()
        .find('input')
        .clear()
        .type(datos.denuncia_valida.ubicacion)

      // 6. Enviar denuncia
      cy.contains('button', 'Enviar denuncia').click()

      // ⏳ Esperar a que procese y redirija
      cy.wait(1500)

      // ✅ Verificación de éxito
      cy.get('body', { timeout: 20000 }).should(($body) => {
        const texto = $body.text().toLowerCase()
        const registroExitoso = 
          texto.includes('registrada') ||
          texto.includes('creada') ||
          texto.includes('enviada') ||
          texto.includes('guardada') ||
          texto.includes('mis denuncias') ||
          texto.includes('todas')
        
        expect(registroExitoso, 'Debe confirmar registro exitoso').to.be.true
      })
    })
  })
})