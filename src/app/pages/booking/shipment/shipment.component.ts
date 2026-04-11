import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { BookingService, Shipper } from '../services/booking.service';
import { ShipmentService, Shipment } from '../services/shipment.service';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonModule, 
    TableModule, 
    ToastModule, 
    TooltipModule, 
    DialogModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './shipment.component.html'
})
export class ShipmentComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  shipments: Shipment[] = [];
  shippers: Shipper[] = [];
  
  // Add/Edit Popup state
  displayPopup = false;
  popupMode: 'add' | 'edit' = 'add';
  currentShipment: Shipment = this.getEmptyShipment();

  // Sync Booking Popup state
  displaySyncPopup = false;
  currentSyncShipment: Shipment = this.getEmptyShipment();
  syncMblNumber = '';
  syncCarrierName = '';
  syncEstimatedDeparture = '';
  syncEstimatedArrival = '';
  isMblSynced = false;

  ngOnInit() {
    this.loadShippers();
    this.loadShipments();
  }

  loadShippers() {
    this.bookingService.getShipperList().subscribe({
      next: (data) => {
        this.shippers = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.shippers = [];
        console.error('Failed to load shippers', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadShipments() {
    this.shipmentService.getShipmentList().subscribe({
      next: (data) => {
        this.shipments = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.shipments = [];
        console.error('Failed to load shipments', err);
        this.cdr.detectChanges();
      }
    });
  }

  getEmptyShipment(): Shipment {
    return {
      shipment_id: '',
      shipper_id: '',
      mode: '',
      cargo_type: '',
      goods_description: '',
      packages_count: 0,
      gross_weight: 0,
      net_weight: 0,
      volume: 0,
      marks_and_numbers: '',
      measurement: '',
      origin: '',
      destination: '',
      desired_delivery_date: '',
      special_requirements: ''
    };
  }

  openAddPopup() {
    this.popupMode = 'add';
    this.currentShipment = this.getEmptyShipment();
    this.displayPopup = true;
  }

  openEditPopup(shipment: Shipment) {
    this.popupMode = 'edit';
    this.currentShipment = { ...shipment };
    this.displayPopup = true;
  }

  openSyncPopup(shipment: Shipment) {
    this.currentSyncShipment = { ...shipment };
    this.syncMblNumber = shipment.mbl_number && shipment.mbl_number !== '-' ? shipment.mbl_number : '';
    this.isMblSynced = !!this.syncMblNumber;
    this.displaySyncPopup = true;
  }

  saveShipment() {
    // Validate required fields
    if (!this.currentShipment.shipper_id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select a shipper.',
        life: 3000
      });
      return;
    }

    if (!this.currentShipment.mode || this.currentShipment.mode === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select a mode (FCL or LCL).',
        life: 3000
      });
      return;
    }

    if (this.popupMode === 'add') {
      this.shipmentService.createShipment(this.currentShipment).subscribe({
        next: () => {
          this.displayPopup = false;
          this.loadShipments();
          this.messageService.add({
            severity: 'success',
            summary: 'Shipment Added',
            detail: 'Shipment was added successfully.',
            life: 3000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Add Failed',
            detail: err.error?.error || 'Unable to add shipment.',
            life: 4000
          });
        }
      });
    } else if (this.popupMode === 'edit' && this.currentShipment.shipment_id) {
      this.shipmentService.updateShipment(this.currentShipment.shipment_id, this.currentShipment).subscribe({
        next: () => {
          this.displayPopup = false;
          this.loadShipments();
          this.messageService.add({
            severity: 'success',
            summary: 'Shipment Updated',
            detail: 'Shipment was updated successfully.',
            life: 3000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err.error?.error || 'Unable to update shipment.',
            life: 4000
          });
        }
      });
    }
  }

  deleteShipment(shipment: Shipment) {
    if (shipment.shipment_id) {
      this.shipmentService.deleteShipment(shipment.shipment_id).subscribe({
        next: () => {
          this.loadShipments();
          this.messageService.add({
            severity: 'success',
            summary: 'Shipment Deleted',
            detail: 'Shipment was deleted successfully.',
            life: 3000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: err.error?.error || 'Unable to delete shipment.',
            life: 4000
          });
        }
      });
    }
  }

  confirmSync() {
    if (!this.syncMblNumber || !this.currentSyncShipment.shipment_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Please enter MBL number.',
        life: 3000
      });
      return;
    }

    // Validate that shipment has a mode set
    if (!this.currentSyncShipment.mode || this.currentSyncShipment.mode === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Shipment',
        detail: 'Shipment mode (FCL/LCL) is not set. Please set the mode before syncing.',
        life: 4000
      });
      return;
    }

    this.shipmentService.syncBooking(
      this.syncMblNumber,
      this.currentSyncShipment.shipment_id,
      this.syncCarrierName,
      this.syncEstimatedDeparture,
      this.syncEstimatedArrival
    ).subscribe({
      next: () => {
        this.displaySyncPopup = false;
        this.resetSyncFields();
        this.loadShipments();
        this.messageService.add({
          severity: 'success',
          summary: 'Booking Synced',
          detail: 'Master BL attached successfully.',
          life: 3000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Sync Failed',
          detail: err.error?.error || 'Unable to attach Master BL.',
          life: 4000
        });
      }
    });
  }

  resetSyncFields() {
    this.syncMblNumber = '';
    this.syncCarrierName = '';
    this.syncEstimatedDeparture = '';
    this.syncEstimatedArrival = '';
    this.isMblSynced = false;
  }
}
