import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, ChevronRight, ArrowLeft } from 'lucide-angular';
import { StepUploadComponent } from './steps/step-upload/step-upload';
import { StepDetailsComponent } from './steps/step-details/step-details';
import { StepFinalizeComponent } from './steps/step-finalize/step-finalize';

@Component({
  selector: 'app-doc-to-doc',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StepUploadComponent,
    StepDetailsComponent,
    StepFinalizeComponent
  ],
  templateUrl: './doc-to-doc.html',
  styleUrl: './doc-to-doc.css'
})
export class DocToDocComponent {
  currentStep = 1;

  // Shared State
  formData = {
    mblType: 'Master BL',
    hblType: 'House BL',
    uploadedImage: null as string | null,
    mblNumber: '',
    selectedShippers: [] as string[],
    previewData: {}
  };

  readonly Check = Check;
  readonly ChevronRight = ChevronRight;
  readonly ArrowLeft = ArrowLeft;

  goToStep(step: number) {
    this.currentStep = step;
  }

  // Handlers for step outputs
  onUploadComplete(data: { image: string, mblType: string, hblType: string }) {
    this.formData.uploadedImage = data.image;
    this.formData.mblType = data.mblType;
    this.formData.hblType = data.hblType;
    this.goToStep(2);
  }

  onDetailsComplete(data: { mblNumber: string, localShippers: string[] }) {
    this.formData.mblNumber = data.mblNumber;
    this.formData.selectedShippers = data.localShippers;
    // Mock generate preview data
    this.formData.previewData = {
      shipper: data.localShippers.join('\n'),
      consignee: 'FAST TRACK LOGISTICS INC\n456 HARBOR DR\nLOS ANGELES, CA, USA',
      notifyParty: 'SAME AS CONSIGNEE',
      vessel: 'HYUNDAI PLUTO / 004E',
      pol: 'BUSAN, KOREA',
      pod: 'LOS ANGELES, USA',
      goodsDesc: '1X40HC CONTAINER STC:\n800 BOXES OF AUTOMOTIVE PARTS\nHS CODE: 8708.99',
      weight: '18,500 KGS / 45.2 CBM'
    };
    this.goToStep(3);
  }

  onBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onConfirm() {
    alert("House Bill of Lading (HBL) generated successfully!");
    // Reset or navigate away
  }
}
