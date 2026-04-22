import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotation-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css'
})
export class QuotationTemplateComponent {
  @Input() data: Record<string, any> = {};
  @Output() dataChange = new EventEmitter<Record<string, any>>();

  updateField(field: string, value: string) {
    this.data[field] = value;
    this.dataChange.emit(this.data);
  }
}
