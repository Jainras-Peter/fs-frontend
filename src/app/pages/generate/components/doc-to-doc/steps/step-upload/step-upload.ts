import { Component, EventEmitter, Output, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Upload,
  Check,
  ArrowRight,
  LucideIconData,
  FileCheckCorner
} from 'lucide-angular';
import {InputDropdown} from '../../../shared/input-dropdown/input-dropdown';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-step-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule,
  InputDropdown, ToastModule],
  templateUrl: './step-upload.html',
  styleUrl: './step-upload.css',
  providers: [MessageService]
})
export class StepUploadComponent {
  @Output() complete = new EventEmitter<{
      image: string,
      file: File,
      mblType: string,
      hblType: string,
      model: string
    }>();

  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  mblType!:string;
  hblType!:string;
  model!: string

  aiModels = ['Grok', 'GPT-OSS-120B']
  outputDocs = ["House Bill of Lading", "Invoice"]
  inputDocs= ["Ocean Bill of Lading", "Master Bill of Lading"];

  uploadedImage: string = '';
  uploadedFile: File | null = null;
  fileName: string | null = null;
  isPdf = false;

  readonly Upload = Upload;
  readonly Check = Check;
  readonly FileUploaded: LucideIconData = FileCheckCorner;
  readonly ArrowRight = ArrowRight;

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImage = file.type.startsWith('image/');
      if (!isPdf && !isImage) {
        alert('Unsupported file type. Please upload a PDF or image (PNG/JPG).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large. Max size is 10MB.');
        return;
      }
      this.fileName = file.name;
      this.uploadedFile = file;
      this.isPdf = isPdf;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.uploadedImage = reader.result as string;
        this.cdr.detectChanges(); // Trigger update here
      };
      reader.readAsDataURL(file);
    }
  }

  startProcess() {
    if (this.uploadedImage) {
      this.complete.emit({
        image: this.uploadedImage,
        file: this.uploadedFile!,
        mblType: this.mblType,
        hblType: this.hblType,
        model: this.model
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: "Processing Failed",
        detail: 'Please upload a document first.',
        life: 3000
      })
    }
  }
}
