import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, ArrowRight, FileText } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonModule, FormsModule],
  templateUrl: './step-details.html',
  styleUrl: './step-details.css'
})
export class StepDetailsComponent {
  @Input() initialMbl = '';
  @Input() initialShipper: string[] = []; // Pre-selected
  @Input() availableShippers: string[] = []; // List to display
  @Output() back = new EventEmitter<void>();
  @Output() complete = new EventEmitter<{ mblNumber: string, localShippers: string[] }>();

  mblNumber = '';
  selectedShippers: string[] = [];
  isGenerating = false;

  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly FileText = FileText;

  MOCK_SHIPPERS: string[] = []; // Re-declared the required empty array
  hasShippers = true; // Added flag to track if we actually have shippers

  ngOnInit() {
    this.mblNumber = this.initialMbl;
    
    // Check if availableShippers was explicitly provided (even if empty)
    if (this.availableShippers) {
      this.MOCK_SHIPPERS = [...this.availableShippers];
      this.selectedShippers = [...this.availableShippers];
      this.hasShippers = this.MOCK_SHIPPERS.length > 0;
    } else {
      this.selectedShippers = Array.isArray(this.initialShipper) ? [...this.initialShipper] : [];
      this.hasShippers = false;
    }
  }

  toggleShipper(shipper: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedShippers.includes(shipper)) {
        this.selectedShippers.push(shipper);
      }
    } else {
      this.selectedShippers = this.selectedShippers.filter(s => s !== shipper);
    }
  }

  generatePreview() {
    if (!this.mblNumber) {
      alert("Please enter the Master BL number.");
      return;
    }
    if (this.selectedShippers.length === 0) {
      alert("Please select at least one shipper.");
      return;
    }

    this.isGenerating = true;
    setTimeout(() => {
      this.isGenerating = false;
      this.complete.emit({
        mblNumber: this.mblNumber,
        localShippers: this.selectedShippers
      });
    }, 1500);
  }
}
