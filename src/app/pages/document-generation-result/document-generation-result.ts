import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  FolderArchive,
  AlertTriangle
} from 'lucide-angular';

export interface UploadedFileRef {
  filename: string;
  url: string;
}

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
  private http = inject(HttpClient);

  private readonly apiBase = 'http://localhost:5000/api/v1';

  readonly Check = Check;
  readonly ChevronRight = ChevronRight;
  readonly ChevronDown = ChevronDown;
  readonly Download = Download;
  readonly FileText = FileText;
  readonly FolderArchive = FolderArchive;
  readonly AlertTriangle = AlertTriangle;

  status: GenerationStatus = 'success';
  mode = 'FCL';
  hblNumber = 'Not available';
  totalCount = 1;
  errorMessage = '';
  uploadedFiles: UploadedFileRef[] = [];

  downloadMenuOpen = false;
  archiveLoading = false;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const navigationState =
      typeof history !== 'undefined' && history.state && Object.keys(history.state).length > 0
        ? (history.state as Record<string, unknown>)
        : null;
    const incomingStatus = params.get('status');
    const incomingMode = params.get('mode');
    const incomingHblNumber = params.get('hblNumber');
    const incomingTotalCount = Number(params.get('totalCount'));

    this.status = incomingStatus === 'failed' ? 'failed' : 'success';
    this.mode = incomingMode?.trim() || this.mode;
    this.hblNumber = incomingHblNumber?.trim() || this.hblNumber;
    this.totalCount = Number.isFinite(incomingTotalCount) && incomingTotalCount > 0 ? incomingTotalCount : 1;
    this.errorMessage = (navigationState?.['errorMessage'] as string) || '';
    const files = navigationState?.['uploadedFiles'];
    if (Array.isArray(files)) {
      this.uploadedFiles = files.filter(
        (f): f is UploadedFileRef =>
          typeof f === 'object' &&
          f !== null &&
          typeof (f as UploadedFileRef).filename === 'string' &&
          typeof (f as UploadedFileRef).url === 'string'
      );
    }
  }

  get isSuccess(): boolean {
    return this.status === 'success';
  }

  get hasDownloads(): boolean {
    return this.uploadedFiles.length > 0;
  }

  get statusHeading(): string {
    return this.isSuccess ? 'Document(s) generated successfully' : 'Document generation failed';
  }

  get statusDescription(): string {
    return this.isSuccess
      ? 'Your files are ready. You can download them individually or as a single archive, or return to your dashboard to manage your workspace.'
      : this.errorMessage || 'The generation request completed with an error. Please review the document data and try again.';
  }

  get statusIcon() {
    return this.isSuccess ? this.Check : this.AlertTriangle;
  }

  get additionalDocumentCount(): number {
    return Math.max(this.totalCount - 1, 0);
  }

  toggleDownloadMenu(): void {
    if (!this.isSuccess || !this.hasDownloads) return;
    this.downloadMenuOpen = !this.downloadMenuOpen;
  }

  closeDownloadMenu(): void {
    this.downloadMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement;
    if (!target.closest('[data-download-menu]')) {
      this.downloadMenuOpen = false;
    }
  }

  fileIconClass(filename: string): string {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return 'text-red-600';
    if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'text-blue-600';
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) return 'text-emerald-600';
    return 'text-slate-600';
  }

  downloadArchive(): void {
    if (!this.hasDownloads || this.archiveLoading) return;
    this.archiveLoading = true;
    this.downloadMenuOpen = false;
    this.http
      .post(`${this.apiBase}/hbl-docs/download-archive`, { files: this.uploadedFiles }, {
        responseType: 'blob',
        observe: 'response'
      })
      .subscribe({
        next: (resp) => {
          this.archiveLoading = false;
          const blob = resp.body;
          if (!blob) return;
          const cd = resp.headers.get('Content-Disposition');
          let name = 'hbl-documents.zip';
          if (cd) {
            const m = /filename="?([^";]+)"?/i.exec(cd);
            if (m?.[1]) name = m[1];
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
          URL.revokeObjectURL(url);
        },
        error: () => {
          this.archiveLoading = false;
        }
      });
  }
}
