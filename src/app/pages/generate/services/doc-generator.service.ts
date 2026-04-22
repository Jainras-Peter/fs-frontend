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
    return this.http.post<any>(`${this.baseUrl}/pdf-generator?documentTo=${encodeURIComponent(documentTo)}`, payload);
  }
}
