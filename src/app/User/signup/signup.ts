import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Userservice } from '../userservice';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [MessageService],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm: FormGroup;
  private fb = inject(FormBuilder);
  private userService = inject(Userservice);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    this.signupForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      
      const pwd = this.signupForm.get('password');
      const email = this.signupForm.get('email');
      const terms = this.signupForm.get('terms');

      if (terms?.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please accept the Terms of Service and Privacy Policy.' });
      } else if (pwd?.invalid && pwd.errors?.['minlength']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password must be at least 8 characters long.' });
      } else if (email?.invalid && email.errors?.['email']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email address.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all required fields correctly.' });
      }
      return;
    }

    this.userService.signup(this.signupForm.value).subscribe({
      next: (res: any) => {
        console.log('Signup successful', res);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Signup error', err);
        this.messageService.add({ severity: 'error', summary: 'Signup Failed', detail: err.error?.error || 'An error occurred during signup' });
      }
    });
  }
}
