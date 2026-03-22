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

  /**
   * Invokes POST /pdf-generator?documentTo=... on the Go backend.
   * `documentTo` matches the "To" document type (e.g. House BL, Forwarder BL).
   * The backend forwards to the PDF generator with the same query param.
   */
  generateHbl(payload: any, documentTo: string): Observable<any> {
    const params = new HttpParams().set('documentTo', documentTo);
    return this.http.post<any>(`${this.baseUrl}/pdf-generator`, payload, { params });
  }
}

