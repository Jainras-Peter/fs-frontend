import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BookingPopupComponent } from '../components/booking-popup/booking-popup.component';
import { BookingService, Shipper } from '../services/booking.service';

@Component({
  selector: 'app-shipper',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, ToastModule, TooltipModule, BookingPopupComponent],
  providers: [MessageService],
  templateUrl: './shipper.component.html'
})
export class ShipperComponent implements OnInit {
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  shippers: Shipper[] = [];
  isLoading = false;
  
  // Popup state
  displayPopup = false;
  popupMode: 'add' | 'edit' = 'add';
  currentShipper: Shipper = this.getEmptyShipper();

  ngOnInit() {
    this.loadShippers();
  }

  loadShippers() {
    this.isLoading = true;
    this.bookingService.getShipperList().subscribe({
      next: (data) => {
        this.shippers = Array.isArray(data) ? [...data] : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.shippers = [];
        this.isLoading = false;
        console.error('Failed to load shippers', err);
        this.cdr.detectChanges();
      }
    });
  }

  getEmptyShipper(): Shipper {
    return {
      shipper_id: '',
      shipper_name: '',
      shipper_address: '',
      shipper_contact: ''
    };
  }

  openAddPopup() {
    this.popupMode = 'add';
    this.currentShipper = this.getEmptyShipper();
    this.displayPopup = true;
  }

  openEditPopup(shipper: Shipper) {
    this.popupMode = 'edit';
    // clone to avoid modifying the table directly before save
    this.currentShipper = { ...shipper };
    this.displayPopup = true;
  }

  handleSave(shipperData: Shipper) {
    if (this.popupMode === 'add') {
      this.bookingService.addShipper(shipperData).subscribe({
        next: () => {
          this.loadShippers();
          this.messageService.add({
            severity: 'success',
            summary: 'Shipper Added',
            detail: `${shipperData.shipper_name} was added successfully.`,
            life: 3000
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Add Failed',
            detail: err.error?.error || 'Unable to add shipper.',
            life: 4000
          });
        }
      });
    } else if (this.popupMode === 'edit') {
      if (shipperData.id) {
        this.bookingService.updateShipper(shipperData.id, shipperData).subscribe({
          next: () => {
            this.loadShippers();
            this.messageService.add({
              severity: 'success',
              summary: 'Shipper Updated',
              detail: `${shipperData.shipper_name} was updated successfully.`,
              life: 3000
            });
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: err.error?.error || 'Unable to update shipper.',
              life: 4000
            });
          }
        });
      }
    }
  }

  deleteShipper(shipper: Shipper) {
    if (shipper.id) {
      this.bookingService.deleteShipper(shipper.id).subscribe({
        next: () => {
          this.loadShippers();
          this.messageService.add({
            severity: 'success',
            summary: 'Shipper Deleted',
            detail: `${shipper.shipper_name} was deleted successfully.`,
            life: 3000
          });
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: err.error?.error || 'Unable to delete shipper.',
            life: 4000
          });
        }
      });
    }
  }
}
