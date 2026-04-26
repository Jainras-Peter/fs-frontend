import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hbl-preview-full',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hbl-preview-full.html',
  styles: [`
    :host {
      display: block;
    }
    .hbl-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      border: 1px solid #cbd5e1;
      border-bottom: 0; /* Let cells handle bottom border to avoid double border */
      border-right: 0;
    }
    .hbl-cell {
      border-right: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
      padding: 4px;
      font-size: 11px;
      min-height: 24px;
    }
    .hbl-cell-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .hbl-cell-content {
      font-weight: 500;
      color: #0f172a;
      white-space: pre-line;
      line-height: normal;
    }
  `]
})
export class HblPreviewFullComponent {
  @Input() data: any = {};
  @Input() isEditing = false;

  // Helpers
  get vesselName(): string {
    const v = this.data?.vessel_details?.[0];
    if (!v) return '';
    return [v.vessel_name, v.voyage_no].filter(x => x).join(' / ');
  }

  get containerList(): any[] {
    return this.data?.container_details || [];
  }
}
