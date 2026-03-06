import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'http://localhost:9090'; // Base URL
  private readonly tokenKey = 'auth_token';
  
  // Signal to track authentication state reactively
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor() {}

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.post(this.apiUrl + '/token', {}, { headers, responseType: 'text' }).pipe(
      tap(token => {
        this.setToken(token);
        this.isAuthenticated.set(true);
        this.router.navigate(['/notes']);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
