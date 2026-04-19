import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Shipper } from '../../services/booking.service';

@Component({
  selector: 'app-booking-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './booking-popup.component.html'
})
export class BookingPopupComponent implements OnInit {
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

  shipperForm: FormGroup;
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  constructor() {
    this.shipperForm = this.fb.group({
      shipper_id: ['', Validators.required],
      shipper_name: ['', Validators.required],
      shipper_address: ['', Validators.required],
      shipper_contact: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.updateFormValues();
  }

  ngOnChanges() {
    if (this.visible) {
      this.updateFormValues();
    }
  }

  private updateFormValues() {
    this.shipperForm.patchValue({
      shipper_id: this.shipper.shipper_id || '',
      shipper_name: this.shipper.shipper_name || '',
      shipper_address: this.shipper.shipper_address || '',
      shipper_contact: this.shipper.shipper_contact || ''
    });
    this.shipperForm.markAsUntouched();
    this.shipperForm.markAsPristine();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  save() {
    if (this.shipperForm.invalid) {
      this.shipperForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all required fields.' });
      return;
    }
    
    const formValue = this.shipperForm.value;
    const shipperData: Shipper = {
      ...this.shipper,
      shipper_id: formValue.shipper_id,
      shipper_name: formValue.shipper_name,
      shipper_address: formValue.shipper_address,
      shipper_contact: formValue.shipper_contact
    };
    
    this.onSave.emit(shipperData);
    this.closeDialog();
  }
}

