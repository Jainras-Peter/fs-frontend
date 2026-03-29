import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocGeneratorService {
  private http = inject(HttpClient);
  /** Go backend API (Gin server runs on port 5000). */
  private readonly baseUrl = 'http://localhost:5000/api/v1';

  generateHbl(payload: any, documentTo: string): Observable<any> {
    // The Go backend expects DocumentTo inside the JSON body, not as a query param.
    const augmentedPayload = { ...payload, documentTo };
    return this.http.post<any>(`${this.baseUrl}/pdf-generator`, augmentedPayload);
  }
}

