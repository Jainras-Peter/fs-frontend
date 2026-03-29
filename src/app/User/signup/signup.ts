import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Userservice } from '../userservice';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm: FormGroup;
  private fb = inject(FormBuilder);
  private userService = inject(Userservice);
  private router = inject(Router);

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
    if (this.signupForm.valid) {
      this.userService.signup(this.signupForm.value).subscribe({
        next: (res: any) => {
          console.log('Signup successful', res);
          // Redirect to login or auto-login
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.error('Signup error', err);
        }
      });
    }
  }
}
