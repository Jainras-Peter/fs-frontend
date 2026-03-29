import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/users';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() { }

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('fwd_token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('fwd_token', res.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    localStorage.removeItem('fwd_token');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
}
