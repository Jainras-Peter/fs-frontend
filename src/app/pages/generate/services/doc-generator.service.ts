import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DocGeneratorService {
  private http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.v1;

  generateHbl(payload: any, documentTo: string): Observable<any> {
    // The Go backend expects DocumentTo inside the JSON body, not as a query param.
    const augmentedPayload = { ...payload, documentTo };
    return this.http.post<any>(`${this.baseUrl}/pdf-generator`, augmentedPayload);
  }
}
