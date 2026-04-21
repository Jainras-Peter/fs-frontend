import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill-of-lading-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-of-lading.component.html',
  styleUrl: './bill-of-lading.component.css'
})
export class BillOfLadingTemplateComponent {
  @Input() data: Record<string, any> = {};
  @Output() dataChange = new EventEmitter<Record<string, any>>();

  updateField(field: string, value: string) {
    this.data[field] = value;
    this.dataChange.emit(this.data);
  }
}
