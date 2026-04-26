import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardDetails, DashboardDocument } from './services/dashboard.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmDialogModule, ToastModule],
  providers: [DatePipe, ConfirmationService, MessageService],
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

  filteredData: DashboardDocument[] = [];
  typeCounts: { type: string, count: number }[] = [];
  selectedFilter: string = 'All';
  documentTypes: string[] = ['All', 'House Bill of Lading', 'Bill of Lading', 'Commercial Invoice', 'Quotation', 'Bill of Exchange'];

  constructor(
    private dashboardService: DashboardService, 
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    this.dashboardService.getDetails().subscribe({
      next: (res) => {
        console.log('Dashboard details received:', res);
        this.details = res;
        this.calculateTypeCounts();
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard details', err);
      }
    });

  }

  applyFilter(): void {
    if (this.selectedFilter === 'All') {
      this.filteredData = [...this.details.data];
    } else {
      this.filteredData = this.details.data.filter(doc => {
        let type = doc.type || 'House Bill of Lading';
        if (type === 'House BL') type = 'House Bill of Lading';
        return type === this.selectedFilter;
      });
    }
  }

  calculateTypeCounts(): void {
    const counts: { [key: string]: number } = {};
    const shortNames: Record<string, string> = {
      'House BL': 'House Bill of Lading',
      'House Bill of Lading': 'House Bill of Lading',
      'Master BL': 'Master Bill of Lading',
      'Bill of Lading': 'Bill of Lading',
      'Commercial Invoice': 'Commercial Invoice',
      'Quotation': 'Quotation',
      'Bill of Exchange': 'Bill of Exchange'
    };

    this.details.data.forEach(doc => {
      const type = doc.type || 'House Bill of Lading';
      const shortName = shortNames[type] || type;
      counts[shortName] = (counts[shortName] || 0) + 1;
    });
    this.typeCounts = Object.keys(counts).map(k => ({ type: k, count: counts[k] }));
  }

  viewDocument(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  deleteDocument(doc: DashboardDocument): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this document?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.dashboardService.deleteDocument(doc.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `${doc.filename} deleted successfully!` });
            this.loadDetails(); // reload list
          },
          error: (err) => {
            console.error('Error deleting document', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete document.' });
          }
        });
      }
    });
  }
}
