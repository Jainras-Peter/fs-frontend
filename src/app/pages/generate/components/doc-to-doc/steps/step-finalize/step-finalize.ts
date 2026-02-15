import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, Edit3, Check, ChevronLeft, ChevronRight, Save, X } from 'lucide-angular';
import { HblPreviewFullComponent } from './hbl-preview-full/hbl-preview-full';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-step-finalize',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, HblPreviewFullComponent],
  templateUrl: './step-finalize.html',
  styleUrl: './step-finalize.css'
})
export class StepFinalizeComponent {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  @Input() previewData: any[] = [];
  @Input() mblNumber = '';
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  isLoading = false;
  currentIndex = 0;
  currentHBL: any = {};
  isEditing = false;

  readonly ArrowLeft = ArrowLeft;
  readonly Edit3 = Edit3;
  readonly Check = Check;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Save = Save;
  readonly X = X;

  ngOnChanges() {
    if (this.previewData && this.previewData.length > 0) {
      this.currentIndex = 0;
    }
  }

  next() {
    if (this.currentIndex < this.previewData.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  handleConfirm() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.confirm.emit();
    }, 2000);
  }

  toggleEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    // Optionally revert changes if we had a deep copy. 
    // Since we bind directly to previewData array object, cancelling ideally should revert.
    // For now, simpler to just exit mode.
  }

  save() {
    const current = this.previewData[this.currentIndex];
    if (!current || !current.sea_waybill_no) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid HBL Number' });
      return;
    }

    this.isLoading = true;
    this.http.put(`http://localhost:5000/api/v1/hbl/${current.sea_waybill_no}`, current).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isEditing = false;
        this.isEditing = false;
        this.messageService.add({ severity: 'success', summary: 'HBL Updated', detail: 'Document saved successfully' });
        this.refresh.emit();
        // Data is already updated in local array via ngModel binding.
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Update Error:', err);
        this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: err.error?.error || 'Failed to save changes' });
      }
    });
  }
}
