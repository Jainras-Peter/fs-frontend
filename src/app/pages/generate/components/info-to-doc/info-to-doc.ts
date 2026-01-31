import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LayoutTemplate, ArrowRight, Edit3, Check } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DocumentPreviewComponent } from '../shared/document-preview/document-preview';

@Component({
  selector: 'app-info-to-doc',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ButtonModule, DocumentPreviewComponent],
  templateUrl: './info-to-doc.html',
  styleUrl: './info-to-doc.css'
})
export class InfoToDocComponent {
  infoForm = {
    shipper: '',
    consignee: '',
    notifyParty: '',
    vessel: '',
    pol: '',
    pod: '',
    goodsDesc: '',
    weight: ''
  };
  showInfoPreview = false;
  isInfoGenerating = false;

  readonly LayoutTemplate = LayoutTemplate;
  readonly ArrowRight = ArrowRight;
  readonly Edit3 = Edit3;
  readonly Check = Check;

  handleInfoChange(key: string, value: string) {
    (this.infoForm as any)[key] = value;
  }

  handleTemplateLoad() {
    this.infoForm = {
      shipper: 'ACME EXPORTS LTD\n123 INDUSTRIAL WAY\nSEOUL, KOREA',
      consignee: 'FAST TRACK LOGISTICS INC\n456 HARBOR DR\nLOS ANGELES, CA, USA',
      notifyParty: 'SAME AS CONSIGNEE',
      vessel: 'HYUNDAI PLUTO / 004E',
      pol: 'BUSAN, KOREA',
      pod: 'LOS ANGELES, USA',
      goodsDesc: '1X40HC CONTAINER STC:\n800 BOXES OF AUTOMOTIVE PARTS\nHS CODE: 8708.99',
      weight: '18,500 KGS / 45.2 CBM'
    };
  }

  handleInfoGenerate() {
    this.showInfoPreview = true;
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  handleInfoConfirm() {
    this.isInfoGenerating = true;
    setTimeout(() => {
      this.isInfoGenerating = false;
      alert("Document created from manual entry!");
    }, 2000);
  }
}
