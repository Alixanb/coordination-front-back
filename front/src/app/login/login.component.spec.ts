import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { By } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn().mockReturnValue(of('fake-token')),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit create', () => {
    expect(component).toBeTruthy();
  });

  it('doit avoir un formulaire invalide par defaut', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('doit avoir un formulaire valide apres saisie', () => {
    component.loginForm.setValue({ username: 'admin', password: 'password' });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('doit desactiver le bouton submit quand le form est invalide', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('doit activer le bouton submit quand le form est valide', () => {
    component.loginForm.setValue({ username: 'admin', password: 'password' });
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('doit appeler authService.login a la soumission', () => {
    component.loginForm.setValue({ username: 'admin', password: 'password' });
    component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalledWith('admin', 'password');
  });

  it('doit ne pas appeler authService.login quand le form est invalide', () => {
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('doit afficher un message erreur apres un login echoue', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
    component.loginForm.setValue({ username: 'wrong', password: 'wrong' });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.error).toBe('Invalid credentials');
    const errorEl = fixture.debugElement.query(By.css('.error-message'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Invalid credentials');
  });
});
