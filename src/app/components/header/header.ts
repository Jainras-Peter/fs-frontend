import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Userservice } from '../../User/userservice';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  userService = inject(Userservice);

  onLogout() {
    this.userService.logout();
  }
}
