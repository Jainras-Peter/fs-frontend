import { Component, EventEmitter, inject, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Check, ChevronRight, ArrowLeft } from 'lucide-angular';
import { Router } from '@angular/router';
import { StepUploadComponent } from './steps/step-upload/step-upload';
import { StepDetailsComponent } from './steps/step-details/step-details';
import { StepFinalizeComponent } from './steps/step-finalize/step-finalize';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DocGeneratorService } from '../../services/doc-generator.service';
import { API_CONFIG } from '../../../../core/config/api.config';
import { Shipment } from '../../../booking/services/shipment.service';

@Component({
  selector: 'app-doc-to-doc',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StepUploadComponent,
    StepDetailsComponent,
    StepFinalizeComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './doc-to-doc.html',
  styleUrl: './doc-to-doc.css'
})
export class DocToDocComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private docGeneratorService = inject(DocGeneratorService);
  currentStep = 1;
  isLoading = false;
  @Output() loadingChange = new EventEmitter<boolean>();

  // Shared State
  formData = {
    mblType: '',
    hblType: '',
    model: '',
    uploadedImage: null as string | null,
    mblNumber: '',
    shipmentsList: [] as Shipment[], // Store full objects {shipper_id, shipper_name}
    linkedShipments: [] as Shipment[], // Names for Step 2 display
    hblList: [] as any[], // Generated HBLs for Step 3
    totalCount: 0 // From preview/hbl response, used in onConfirm()
  };

  readonly Check = Check;
  readonly ChevronRight = ChevronRight;
  readonly ArrowLeft = ArrowLeft;

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.loadingChange.emit(isLoading);
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  // Handlers for step outputs
  onUploadComplete(data: { image: string, file: File, mblType: string, hblType: string, model: string }) {
    this.formData.uploadedImage = data.image;
    this.formData.mblType = data.mblType;
    this.formData.hblType = data.hblType;
    this.formData.model = data.model;

    // Call API
    this.setLoading(true);
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('from_doc', 'mbl');
    formData.append('to_doc', 'hbl');
    formData.append('model', data.model);

    this.http.post<any>(`${API_CONFIG.v1}/convert/mbl`, formData)
      .subscribe({
        next: (res) => {
          this.setLoading(false);
          this.formData.mblNumber = res.mbl_number;

          // Map shipper list to just names or IDs for now.
          // The API returns { shipper_id, shipper_name, ... } objects in shipper_list?
          // Let's check the Go model: ConvertMBLResponse { MBLNumber, ShipperList []ShipperDetail }
          // ShipperDetail has ShipperName.

          if (res.shipments_list) {
            // Store full objects for ID lookup later
            this.formData.shipmentsList = res.shipments_list;
          }

          this.goToStep(2);
          this.cdr.detectChanges(); // Force update
        },
        error: (err) => {
          this.setLoading(false);
          this.cdr.detectChanges(); // Force update
          console.error('API Error:', err);
          setTimeout(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Processing Failed',
              detail: err.error?.error || err.message || 'Unknown error occurred',
              life: 5000
            });
          }, 100);
        }
      });
  }

  onDetailsComplete(data: { mblNumber: string, selectedShipments: Shipment[] }) {
    this.formData.mblNumber = data.mblNumber;
    this.formData.linkedShipments = data.selectedShipments;

    const selectedIds = data.selectedShipments.map(s => s.shipment_id).filter(id => id);

    // Call /preview/hbl API
    this.setLoading(true);
    const payload = {
      mbl_number: this.formData.mblNumber,
      shipment_list: selectedIds
    };

    this.http.post<any>(`${API_CONFIG.v1}/preview/hbl`, payload)
      .subscribe({
        next: (res) => {
          this.setLoading(false);
          if (res.hbl_list && Array.isArray(res.hbl_list)) {
            this.formData.hblList = res.hbl_list;
            this.formData.totalCount = res.total_count ?? res.hbl_list.length;
            this.goToStep(3);
          } else {
            this.messageService.add({ severity: 'warn', summary: 'No HBLs Generated', detail: 'The server returned no HBL documents.' });
            // Stay on step 2? Or go to 3 empty?
            // Stay on 2 for now.
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.setLoading(false);
          this.cdr.detectChanges();
          console.error('Preview API Error:', err);
          this.messageService.add({ severity: 'error', summary: 'Preview Failed', detail: err.error?.error || err.message });
        }
      });
  }

  handleRefresh() {
    this.onDetailsComplete({
      mblNumber: this.formData.mblNumber,
      selectedShipments: this.formData.linkedShipments
    });
  }

  onBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private resolvePrimaryHblNumber(): string {
    const primaryHbl = this.formData.hblList.find((item: any) => typeof item?.sea_waybill_no === 'string' && item.sea_waybill_no.trim());
    return primaryHbl?.sea_waybill_no?.trim() || 'Not available';
  }

  private navigateToGenerationResult(
    status: 'success' | 'failed',
    errorMessage = '',
    uploadedFiles: { filename: string; url: string }[] = []
  ): void {
    this.router.navigate(['/generate/result'], {
      queryParams: {
        status,
        model: this.formData.model,
        hblNumber: this.resolvePrimaryHblNumber(),
        totalCount: this.formData.totalCount || this.formData.hblList.length || 1
      },
      state: {
        errorMessage,
        uploadedFiles
      }
    });
  }

  onConfirm() {
    const payload = {
      mbl_number: this.formData.mblNumber,
      total_count: this.formData.totalCount,
      hbl_list: this.formData.hblList
    };

    this.setLoading(true);
    this.docGeneratorService.generateHbl(payload, this.formData.hblType).subscribe({
      next: (res) => {
        this.setLoading(false);
        const files = Array.isArray(res?.uploadedFiles) ? res.uploadedFiles : [];
        const uploadedFiles = files
          .filter((f: { filename?: string; url?: string }) => f?.filename && f?.url)
          .map((f: { filename: string; url: string }) => ({ filename: f.filename, url: f.url }));
        this.navigateToGenerationResult('success', '', uploadedFiles);
      },
      error: (err) => {
        this.setLoading(false);
        console.error('Generate HBL Error:', err);
        this.navigateToGenerationResult('failed', err.error?.error || err.message || 'Failed to generate HBL');
      }
    });
  }
}
