import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './booking.component.html'
})
export class BookingComponent {
  navItems = [
    { label: 'Shipper', route: '/booking/shipper', description: 'Add shipper details' },
    { label: 'Shipment', route: '/booking/shipment', description: 'Add shipment details' },
    { label: 'Status', route: '/booking/status', description: 'View booking status' }
  ];
}
