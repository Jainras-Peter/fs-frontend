import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

export interface Shipment {
  id?: string;
  shipment_id: string;
  shipper_id: string;
  mode: string;
  cargo_type: string;
  goods_description: string;
  packages_count: number;
  gross_weight: number;
  net_weight: number;
  volume: number;
  marks_and_numbers: string;
  measurement: string;
  origin: string;
  destination: string;
  desired_delivery_date: string;
  special_requirements: string;
  mbl_number?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.booking;

  getShipmentList(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.apiUrl}/shipments`);
  }

  createShipment(shipment: Partial<Shipment>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shipments`, shipment);
  }

  updateShipment(id: string, shipment: Partial<Shipment>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/shipments/${id}`, shipment);
  }

  deleteShipment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/shipments/${id}`);
  }

  syncBooking(mblNumber: string, shipmentId: string, mode: string, carrierName: string, estimatedDeparture: string, estimatedArrival: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/syncBooking`, {
      mbl_number: mblNumber,
      shipment_ids: [shipmentId],
      mode,
      carrier_name: carrierName,
      estimated_departure: estimatedDeparture,
      estimated_arrival: estimatedArrival
    });
  }
}
