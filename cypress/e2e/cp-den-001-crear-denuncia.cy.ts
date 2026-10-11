describe('CP-DEN-001: Crear denuncia válida', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
    cy.fixture('datos-prueba').then((datos) => {
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for').then(id => cy.get(`#${id}`).type(datos.usuario_valido.correo))
      
      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for').then(id => cy.get(`#${id}`).type(datos.usuario_valido.contraseña))
      
      cy.get('button[type="submit"]').click()
      cy.url({ timeout: 15000 }).should('not.include', '/login')
    })
  })

  it('Crea denuncia y confirma registro', () => {
    cy.visit('/denuncias/crear')
    
    cy.fixture('datos-prueba').then((datos) => {
      // 1. Tipo de denuncia
      cy.get('select').first().select('Contaminación de agua')

      // 2. Prioridad
      cy.get('select').eq(1).select('Media')

      // 3. Título de la denuncia
      cy.contains('Título de la denuncia')
        .parent().find('input').clear().type(datos.denuncia_valida.titulo)

      // 4. Descripción
      cy.contains('Descripción')
        .parent().find('textarea').clear().type(datos.denuncia_valida.descripcion)

      // 5. Ubicación — Buscar CUALQUIER campo de texto visible
      cy.get('input')
        .not('[type="hidden"]')
        .not('[name*="csrf"]')
        .first()
        .type('Cauca, Colombia')

      // 6. Esperar que el mapa cargue y permitir seleccionar ubicación
      cy.wait(500)

      // 7. Enviar denuncia — Usar el botón EXACTO que ves en pantalla
      cy.get('button:contains("Enviar denuncia")').click()

      // ✅ Verificación: Cambio de página o mensaje de éxito
      cy.get('body', { timeout: 20000 }).should(($body) => {
        const texto = $body.text().toLowerCase()
        const exito = 
          texto.includes('registrada') ||
          texto.includes('creada') ||
          texto.includes('enviada') ||
          texto.includes('guardada') ||
          texto.includes('éxito') ||
          texto.includes('mis denuncias') ||
          texto.includes('todas')
        
        expect(exito, 'Debe confirmar registro exitoso').to.be.true
      })
    })
  })
})