import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InfoToDocPayload {
  Template: string;
  Filename: string;
  data: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class InfoToDocService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/infotodoc`;

  generateDocument(payload: InfoToDocPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/billoflading`, payload);
  }
}
