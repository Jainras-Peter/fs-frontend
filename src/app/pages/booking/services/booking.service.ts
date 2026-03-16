import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shipper {
  id?: string;
  shipper_id: string;
  shipper_name: string;
  shipper_address: string;
  shipper_contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  // Defaulting to process.env.apiURL or localhost:5000 if not available
  private apiUrl = 'http://localhost:5000/api/booking';

  getShipperList(): Observable<Shipper[]> {
    return this.http.get<Shipper[]>(`${this.apiUrl}/shipperlist`);
  }

  addShipper(shipper: Shipper): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addshipper`, shipper);
  }

  updateShipper(id: string, shipper: Partial<Shipper>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateshipper/${id}`, shipper);
  }

  deleteShipper(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteshipper/${id}`);
  }
}
