describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('h1.login-heading').should('contain', 'Sign in');
    cy.get('#username').should('exist');
    cy.get('#password').should('exist');
    cy.get('button[type="submit"]').contains('Sign In').should('be.disabled');
  });

  it('should enable submit button when fields are filled', () => {
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should keep submit disabled when only username is filled', () => {
    cy.get('#username').type('testuser');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should keep submit disabled when only password is filled', () => {
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show error message on invalid credentials', () => {
    cy.intercept('POST', 'http://localhost:9090/token', {
      statusCode: 401,
      body: 'Unauthorized',
    }).as('loginRequest');

    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('should login and redirect to notes page', () => {
    cy.intercept('POST', 'http://localhost:9090/token', {
      statusCode: 200,
      body: 'fake-jwt-token',
    }).as('loginRequest');

    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: [],
    }).as('getNotes');

    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/notes');
  });

  it('should store token in localStorage after login', () => {
    cy.intercept('POST', 'http://localhost:9090/token', {
      statusCode: 200,
      body: 'my-jwt-token',
    }).as('loginRequest');

    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: [],
    }).as('getNotes');

    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.window().its('localStorage').invoke('getItem', 'auth_token').should('eq', 'my-jwt-token');
  });

  it('should show error on network failure', () => {
    cy.intercept('POST', 'http://localhost:9090/token', {
      forceNetworkError: true,
    }).as('loginRequest');

    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
});

describe('Note List Page', () => {
  const mockNotes = [
    { id: 1, title: 'First Note', content: 'Content of the first note' },
    { id: 2, title: 'Second Note', content: 'Content of the second note that is longer than fifty characters to test truncation' },
  ];

  it('should display a list of notes', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list app-note').should('have.length', 2);
    cy.get('router-outlet + app-note-list .note-title').first().should('contain', 'First Note');
    cy.get('router-outlet + app-note-list .note-title').last().should('contain', 'Second Note');
  });

  it('should truncate long note content to 50 characters', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list .note-preview').last().invoke('text').then((text) => {
      expect(text).to.include('…');
    });
  });

  it('should not truncate short note content', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list .note-preview').first().invoke('text').then((text) => {
      expect(text).to.not.include('…');
    });
  });

  it('should show empty state when no notes exist', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: [],
    }).as('getNotes');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list .empty-state').should('contain', 'No notes yet');
  });

  it('should navigate to note detail on click', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.intercept('GET', 'http://localhost:9090/notes/1', {
      statusCode: 200,
      body: mockNotes[0],
    }).as('getNoteDetail');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list .note-card').first().click();
    cy.url().should('include', '/notes/1');
  });

  it('should delete a note from the list', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.intercept('DELETE', 'http://localhost:9090/notes/1', {
      statusCode: 200,
      body: {},
    }).as('deleteNote');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list app-note').should('have.length', 2);
    cy.get('router-outlet + app-note-list .delete-btn').first().click();

    cy.wait('@deleteNote');
    cy.get('router-outlet + app-note-list app-note').should('have.length', 1);
  });

  it('should keep note in list when delete fails', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: mockNotes,
    }).as('getNotes');

    cy.intercept('DELETE', 'http://localhost:9090/notes/1', {
      statusCode: 500,
      body: 'Server Error',
    }).as('deleteNote');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list .delete-btn').first().click();

    cy.wait('@deleteNote');
    cy.get('router-outlet + app-note-list app-note').should('have.length', 2);
  });

  it('should handle server error on loading notes', () => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getNotes');

    cy.visit('/notes');
    cy.wait('@getNotes');

    cy.get('router-outlet + app-note-list app-note').should('have.length', 0);
  });
});

describe('Note Detail Page', () => {
  const mockNote = { id: 1, title: 'Test Note', content: 'This is the full content of the test note' };

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:9090/notes', {
      statusCode: 200,
      body: [mockNote],
    }).as('getNotes');

    cy.intercept('GET', 'http://localhost:9090/notes/1', {
      statusCode: 200,
      body: mockNote,
    }).as('getNoteDetail');
  });

  it('should display note title and content', () => {
    cy.visit('/notes/1');
    cy.wait('@getNoteDetail');

    cy.get('.detail-page .note-title').should('contain', 'Test Note');
    cy.get('.detail-page .note-content').should('contain', 'This is the full content of the test note');
  });

  it('should navigate back to notes list', () => {
    cy.visit('/notes/1');
    cy.wait('@getNoteDetail');

    cy.get('.back-link').contains('Back to board').click();
    cy.url().should('include', '/notes');
  });

  it('should show loading state before note loads', () => {
    cy.intercept('GET', 'http://localhost:9090/notes/2', {
      statusCode: 200,
      body: { id: 2, title: 'Delayed', content: 'Delayed content' },
      delay: 500,
    }).as('getDelayedNote');

    cy.visit('/notes/2');
    cy.contains('Loading note').should('exist');
    cy.wait('@getDelayedNote');
    cy.get('.detail-page .note-title').should('contain', 'Delayed');
  });

  it('should handle 404 when note does not exist', () => {
    cy.intercept('GET', 'http://localhost:9090/notes/999', {
      statusCode: 404,
      body: 'Not Found',
    }).as('getNoteNotFound');

    cy.visit('/notes/999');
    cy.wait('@getNoteNotFound');

    cy.get('.detail-page .note-card').should('not.exist');
  });
});