import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bill-of-exchange-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-of-exchange.component.html',
  styleUrl: './bill-of-exchange.component.css'
})
export class BillOfExchangeTemplateComponent {
  @Input() data: Record<string, any> = {};
  @Output() dataChange = new EventEmitter<Record<string, any>>();

  updateField(field: string, value: string) {
    this.data[field] = value;
    this.dataChange.emit(this.data);
  }
}
