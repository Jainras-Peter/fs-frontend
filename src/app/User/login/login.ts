import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Userservice } from '../userservice';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastModule],
  providers: [MessageService],
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      const username = this.loginForm.get('username')?.value?.toString().trim();
      const password = this.loginForm.get('password')?.value?.toString().trim();

      if (!username && !password) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter username and password.' });
      } else if (!username) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter username.' });
      } else if (!password) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter password.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide valid login credentials.' });
      }
      return;
    }

    this.userService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log('Login successful', res);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Login error', err);
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.error || 'Wrong username or password.' });
      }
    });
  }
}
