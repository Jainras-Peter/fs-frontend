import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Userservice } from '../userservice';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  private fb = inject(FormBuilder);
  private userService = inject(Userservice);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log('Login successful', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Login error', err);
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.error || 'Invalid credentials. Please try again.' });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide both username and password.' });
    }
  }
}
