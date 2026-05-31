import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  error = '';

  readonly testAccounts = [
    { username: 'admin', password: 'password', role: 'Admin', hint: 'read + create' },
    { username: 'user',  password: 'password', role: 'User',  hint: 'read only' },
  ];

  fillCredentials(username: string, password: string) {
    this.loginForm.setValue({ username, password });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.authService.login(username, password).subscribe({
          error: (err) => {
            console.error('Login failed', err);
            this.error = 'Invalid credentials';
          }
        });
      }
    }
  }
}
