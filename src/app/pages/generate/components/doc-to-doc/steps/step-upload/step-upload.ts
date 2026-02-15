import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, Check, ChevronDown, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-step-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './step-upload.html',
  styleUrl: './step-upload.css'
})
export class StepUploadComponent {
  @Output() complete = new EventEmitter<{ image: string, file: File, mblType: string, hblType: string, mode: string }>();

  mblType = 'Master BL';
  hblType = 'House BL';
  mode = 'FCL';
  uploadedImage: string | null = null;
  uploadedFile: File | null = null;
  fileName: string | null = null;
  isPdf = false;

  readonly Upload = Upload;
  readonly Check = Check;
  readonly ChevronDown = ChevronDown;
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
        mode: this.mode
      });
    } else {
      alert("Please upload a document first.");
    }
  }
}
