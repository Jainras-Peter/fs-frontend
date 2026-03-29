import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Userservice {
  constructor() { }

  login(credentials: any): Observable<any> {
    // Placeholder for API call
    return of({ success: true, message: 'Login successful' });
  }

  signup(userData: any): Observable<any> {
    // Placeholder for API call
    return of({ success: true, message: 'Signup successful' });
  }
}
