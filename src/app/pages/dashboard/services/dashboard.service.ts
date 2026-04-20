import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

export interface DashboardDocument {
  id: string;
  filename: string;
  type: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardDetails {
  total_documents: number;
  total_hbls: number;
  recent_activity: number;
  data: DashboardDocument[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = API_CONFIG.dashboard;

  constructor(private http: HttpClient) { }

  getDetails(): Observable<DashboardDetails> {
    return this.http.get<DashboardDetails>(`${this.apiUrl}/details`);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
