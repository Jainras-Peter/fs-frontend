import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocGeneratorService {
  private http = inject(HttpClient);
  /** fs-generator API (Express server runs on port 3000) */
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  /**
   * Invokes POST /generate on the fs-generator backend.
   * @param payload Request body (e.g. _id, shipment_id, hbl_number, hbl).
   * @param params Optional query params (e.g. documentTo, required by the backend).
   */
  generateHbl(payload: any, params?: { documentTo?: string }): Observable<any> {
    const url = params?.documentTo
      ? `${this.baseUrl}/generate?documentTo=${encodeURIComponent(params.documentTo)}`
      : `${this.baseUrl}/generate`;
    return this.http.post<any>(url, payload)  }
}

