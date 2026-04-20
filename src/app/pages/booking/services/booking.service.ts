import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

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
  private apiUrl = API_CONFIG.booking;

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

  getStatusDetails(): Observable<StatusDetail[]> {
    return this.http.get<StatusDetail[]>(`${this.apiUrl}/statusdetails`);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatestatus/${id}`, { status });
  }

  createBooking(mblNumber: string, mode: string, shipmentIds: string[], carrierName: string, estimatedDeparture: string, estimatedArrival: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/syncBooking`, {
      mbl_number: mblNumber,
      mode,
      shipment_ids: shipmentIds,
      carrier_name: carrierName,
      estimated_departure: estimatedDeparture,
      estimated_arrival: estimatedArrival
    });
  }
}

export interface StatusDetail {
  id: string;
  mbl_number: string;
  shipment_ids: string[];
  status: string;
  created_at: string;
}
