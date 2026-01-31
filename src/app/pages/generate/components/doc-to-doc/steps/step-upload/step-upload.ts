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
  @Output() complete = new EventEmitter<{ image: string, mblType: string, hblType: string }>();

  mblType = 'Master BL';
  hblType = 'House BL';
  uploadedImage: string | null = null;
  fileName: string | null = null;

  readonly Upload = Upload;
  readonly Check = Check;
  readonly ChevronDown = ChevronDown;
  readonly ArrowRight = ArrowRight;

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.fileName = file.name;
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
        mblType: this.mblType,
        hblType: this.hblType
      });
    } else {
      alert("Please upload a document first.");
    }
  }
}
