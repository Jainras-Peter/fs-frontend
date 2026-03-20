import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, Check, ArrowRight, AlertTriangle } from 'lucide-angular';

type GenerationStatus = 'success' | 'failed';

@Component({
  selector: 'app-document-generation-result',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './document-generation-result.html',
  styleUrl: './document-generation-result.css'
})
export class DocumentGenerationResultComponent {
  private route = inject(ActivatedRoute);

  readonly completedSteps = ['Upload', 'Details', 'Finalize'];
  readonly Check = Check;
  readonly ArrowRight = ArrowRight;
  readonly AlertTriangle = AlertTriangle;

  status: GenerationStatus = 'success';
  mode = 'FCL';
  hblNumber = 'Not available';
  totalCount = 1;
  errorMessage = '';

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const navigationState = typeof history !== 'undefined' ? history.state : null;
    const incomingStatus = params.get('status');
    const incomingMode = params.get('mode');
    const incomingHblNumber = params.get('hblNumber');
    const incomingTotalCount = Number(params.get('totalCount'));

    this.status = incomingStatus === 'failed' ? 'failed' : 'success';
    this.mode = incomingMode?.trim() || this.mode;
    this.hblNumber = incomingHblNumber?.trim() || this.hblNumber;
    this.totalCount = Number.isFinite(incomingTotalCount) && incomingTotalCount > 0 ? incomingTotalCount : 1;
    this.errorMessage = navigationState?.errorMessage || '';
  }

  get isSuccess(): boolean {
    return this.status === 'success';
  }

  get statusHeading(): string {
    return this.isSuccess
      ? 'You have successfully generated the document for'
      : 'We could not generate the document for';
  }

  get statusNote(): string {
    return this.isSuccess
      ? 'The latest House Bill of Lading is ready to review or download.'
      : this.errorMessage || 'The generation request completed with an error. Please review the document data and try again.';
  }

  get progressLabel(): string {
    return this.isSuccess
      ? 'Downloadable House Bill of Lading (PDF format) is ready'
      : 'Document generation request has completed';
  }

  get statusIcon() {
    return this.isSuccess ? this.Check : this.AlertTriangle;
  }

  get additionalDocumentCount(): number {
    return Math.max(this.totalCount - 1, 0);
  }
}
