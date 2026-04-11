import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { BookingService, StatusDetail } from '../services/booking.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    DatePipe
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './status.component.html'
})
export class StatusComponent implements OnInit {
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  statuses: StatusDetail[] = [];
  isLoading = false;
  
  // Edit Popup state
  displayPopup = false;
  currentStatus: StatusDetail | null = null;
  selectedStatusValue = '';

  statusOptions = [
    { label: 'Booked', value: 'Booked' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Delivered', value: 'Delivered' }
  ];

  ngOnInit() {
    this.loadStatuses();
  }

  loadStatuses() {
    this.isLoading = true;
    this.bookingService.getStatusDetails().subscribe({
      next: (data) => {
        this.statuses = Array.isArray(data) ? [...data] : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.statuses = [];
        this.isLoading = false;
        console.error('Failed to load status details', err);
        this.cdr.detectChanges();
      }
    });
  }

  openEditPopup(status: StatusDetail) {
    this.currentStatus = { ...status };
    this.selectedStatusValue = status.status || 'Booked';
    this.displayPopup = true;
  }

  saveStatus() {
    if (this.currentStatus && this.currentStatus.id) {
      const newStatus = this.selectedStatusValue;
      this.bookingService.updateStatus(this.currentStatus.id, newStatus).subscribe({
        next: () => {
          this.displayPopup = false;
          this.loadStatuses();
          this.messageService.add({
            severity: 'success',
            summary: 'Status Updated',
            detail: 'Booking status was updated successfully.',
            life: 3000
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err.error?.error || 'Unable to update status.',
            life: 4000
          });
        }
      });
    }
  }
}
