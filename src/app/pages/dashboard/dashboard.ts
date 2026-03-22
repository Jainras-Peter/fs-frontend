import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardDetails, DashboardDocument } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  details: DashboardDetails = {
    total_documents: 0,
    total_hbls: 0,
    recent_activity: 0,
    data: []
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    this.dashboardService.getDetails().subscribe({
      next: (res) => {
        console.log('Dashboard details received:', res);
        this.details = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard details', err);
      }
    });

  }

  viewDocument(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  deleteDocument(id: string): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.dashboardService.deleteDocument(id).subscribe({
        next: () => {
          this.loadDetails(); // reload list
        },
        error: (err) => {
          console.error('Error deleting document', err);
        }
      });
    }
  }
}
