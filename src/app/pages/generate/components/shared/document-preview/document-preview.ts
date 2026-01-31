import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, RefreshCcw } from 'lucide-angular';

export interface HblData {
  shipper?: string;
  consignee?: string;
  notifyParty?: string;
  vessel?: string;
  pol?: string;
  pod?: string;
  goodsDesc?: string;
  weight?: string;
}

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './document-preview.html',
  styleUrl: './document-preview.css'
})
export class DocumentPreviewComponent {
  @Input() data: HblData = {};
  @Input() isLoading = false;
  @Input() mblNumOverride = '';

  readonly RefreshCcw = RefreshCcw;
}
