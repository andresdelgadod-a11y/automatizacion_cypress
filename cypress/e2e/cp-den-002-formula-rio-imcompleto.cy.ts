describe('CP-DEN-002: Validar formulario incompleto y cerrar sesión', () => {
  beforeEach(() => {
    // Iniciar sesión
    cy.visit('http://localhost:3000/auth/login');

    cy.fixture('datos-prueba').then((datos) => {
      cy.contains('label', 'Correo electrónico')
        .invoke('attr', 'for')
        .then((id) => {
          expect(id).to.be.a('string');
          cy.get(`#${id}`).type(datos.usuario_valido2.correo);
        });

      cy.contains('label', 'Contraseña')
        .invoke('attr', 'for')
        .then((id) => {
          expect(id).to.be.a('string');
          cy.get(`#${id}`).type(datos.usuario_valido2.contraseña);
        });

      cy.get('button[type="submit"]').click();

      // El ciudadano es redirigido a su panel
      cy.url({ timeout: 15000 }).should('include', '/ciudadano/panel');
    });
  });

  it('Rechaza envío con campos obligatorios vacíos y cierra sesión', () => {
    // Los tipos de denuncia se cargan desde la API; hay que esperarlos
    cy.intercept('GET', '/api/tipos-demanda').as('tipos');
    cy.intercept('POST', '/api/denuncias').as('crearDenuncia');

    cy.visit('http://localhost:3000/denuncias/crear');
    cy.wait('@tipos');

    // Llenar solo algunos campos y dejar otros obligatorios vacíos
    cy.get('select').first().select('Contaminación de agua');
    cy.get('select').eq(1).select('Alta');

    // Título y descripción se dejan vacíos a propósito

    // Intentar enviar
    cy.contains('button', 'Enviar denuncia').click();

    // Comprobar que permanece en la página
    cy.url({ timeout: 5000 }).should('include', '/denuncias/crear');

    // El formulario usa "required" nativo: el navegador marca los campos
    // como inválidos y no escribe ningún texto en la página
    cy.get('#titulo:invalid').should('exist');
    cy.get('#descripcion:invalid').should('exist');

    // No se debe haber enviado nada al backend
    cy.get('@crearDenuncia.all').should('have.length', 0);

    // Cerrar sesión: primero se abre el menú del usuario (botón con ▼)
    cy.contains('header button', '▼').click();
    cy.contains('button', 'Cerrar sesión').click();

    // La app redirige a la página de inicio, no al login
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/');
    cy.contains('Iniciar sesión').should('be.visible');
  });
});