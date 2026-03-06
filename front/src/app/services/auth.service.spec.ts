import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: any;
  const API_URL = 'http://localhost:9090';

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('doit envoyer un POST avec Basic auth et stocker le token', () => {
      service.login('admin', 'password').subscribe();

      const req = httpMock.expectOne(`${API_URL}/token`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('admin:password'));
      req.flush('jwt-token-value', { status: 200, statusText: 'OK' });

      expect(localStorage.getItem('auth_token')).toBe('jwt-token-value');
      expect(service.isAuthenticated()).toBe(true);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/notes']);
    });

    it('doit ne pas stocker de token si le login echoue', () => {
      service.login('wrong', 'wrong').subscribe({
        error: () => {},
      });

      const req = httpMock.expectOne(`${API_URL}/token`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('doit supprimer le token et rediriger vers login', () => {
      localStorage.setItem('auth_token', 'some-token');

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('doit retourner null quand aucun token', () => {
      expect(service.getToken()).toBeNull();
    });

    it('doit retourner le token quand il existe', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });
  });
});
