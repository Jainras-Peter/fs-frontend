import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Userservice } from '../userservice';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  selectedLogoName = '';
  logoPreviewUrl = '';
  currentUsername = '';

  private fb = inject(FormBuilder);
  private userService = inject(Userservice);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      defaultLanguage: [''],
      username: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.currentUsername = localStorage.getItem('fwd_username') || '';
    if (!this.currentUsername) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.userService.getForwarderDetails(this.currentUsername).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          companyName: data.companyName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          defaultLanguage: data.defaultLanguage || '',
          username: data.username || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Profile Load Failed',
          detail: err.error?.error || 'Unable to fetch profile details.',
          life: 4000
        });
      }
    });
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.selectedLogoName = '';
      this.logoPreviewUrl = '';
      return;
    }

    this.selectedLogoName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
        life: 4000
      });
      return;
    }

    const updateData = {
      companyName: this.profileForm.get('companyName')?.value,
      email: this.profileForm.get('email')?.value,
      phone: this.profileForm.get('phone')?.value,
      address: this.profileForm.get('address')?.value,
      defaultLanguage: this.profileForm.get('defaultLanguage')?.value
    };

    this.isLoading = true;
    this.userService.updateForwarderDetails(this.currentUsername, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Updated',
          detail: 'Your forwarder profile has been updated successfully.',
          life: 3000
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: err.error?.error || 'Unable to update profile details.',
          life: 4000
        });
      }
    });
  }
}
