import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, Edit3, Check } from 'lucide-angular';
import { DocumentPreviewComponent } from '../../../shared/document-preview/document-preview';

@Component({
  selector: 'app-step-finalize',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DocumentPreviewComponent],
  templateUrl: './step-finalize.html',
  styleUrl: './step-finalize.css'
})
export class StepFinalizeComponent {
  @Input() previewData: any = {};
  @Input() mblNumber = '';
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  isLoading = false;

  readonly ArrowLeft = ArrowLeft;
  readonly Edit3 = Edit3;
  readonly Check = Check;

  handleConfirm() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.confirm.emit();
    }, 2000);
  }
}
