import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LayoutTemplate, ArrowRight, Edit3, Check, Save } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { BillOfLadingTemplateComponent } from './template/bill-of-lading.component';
import { CommercialInvoiceTemplateComponent } from './template/commercial-invoice.component';
import { InfoToDocService, InfoToDocPayload } from '../../services/infotodoc.service';

@Component({
  selector: 'app-info-to-doc',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule, 
    ButtonModule, 
    DialogModule,
    InputTextModule,
    ToastModule,
    BillOfLadingTemplateComponent,
    CommercialInvoiceTemplateComponent
  ],
  providers: [MessageService],
  templateUrl: './info-to-doc.html',
  styleUrl: './info-to-doc.css'
})
export class InfoToDocComponent {
  availableTemplates = [
    { id: 'BillOfLading', name: 'Bill of Lading' },
    { id: 'CommercialInvoice', name: 'Commercial Invoice' }
  ];
  selectedTemplate = 'BillOfLading';
  templateData: Record<string, any> = {};

  showReferenceModal = false;
  referenceName = '';
  isInfoGenerating = false;

  generationResult: { filename: string, template: string, url: string } | null = null;

  private readonly infoToDocService = inject(InfoToDocService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly LayoutTemplate = LayoutTemplate;
  readonly ArrowRight = ArrowRight;
  readonly Edit3 = Edit3;
  readonly Check = Check;
  readonly Save = Save;

  handleTemplateChange(event: any) {
    this.selectedTemplate = event.target.value;
    this.templateData = {}; // clear data on template change
  }

  openGenerateModal() {
    this.referenceName = '';
    this.showReferenceModal = true;
  }

  handleInfoConfirm() {
    if (!this.referenceName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Reference Name is required.' });
      return;
    }

    this.isInfoGenerating = true;
    const payload: InfoToDocPayload = {
      Template: this.selectedTemplate,
      Filename: this.referenceName.trim(),
      data: this.templateData
    };

    this.infoToDocService.generateDocument(payload).subscribe({
      next: (res) => {
        this.isInfoGenerating = false;
        this.showReferenceModal = false;
        if(res.success && res.uploadedFiles && res.uploadedFiles.length > 0) {
           this.generationResult = {
             filename: this.referenceName.trim(),
             template: this.selectedTemplate,
             url: res.uploadedFiles[0].url
           };
           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document generated successfully.' });
        } else {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid response from server.' });
        }
      },
      error: (err) => {
        console.error(err);
        this.isInfoGenerating = false;
        this.messageService.add({ severity: 'error', summary: 'Generation Failed', detail: err.error?.error || err.message || 'Failed to generate document' });
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  generateAnother() {
    this.generationResult = null;
    this.referenceName = '';
    this.templateData = {};
  }
}
