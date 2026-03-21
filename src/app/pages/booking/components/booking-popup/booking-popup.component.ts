import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Shipper } from '../../services/booking.service';

@Component({
  selector: 'app-booking-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './booking-popup.component.html'
})
export class BookingPopupComponent {
  @Input() visible = false;
  @Input() shipper: Shipper = {
    shipper_id: '',
    shipper_name: '',
    shipper_address: '',
    shipper_contact: ''
  };
  @Input() mode: 'add' | 'edit' = 'add';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<Shipper>();

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  save() {
    this.onSave.emit(this.shipper);
    this.closeDialog();
  }
}
