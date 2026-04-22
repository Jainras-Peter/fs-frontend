import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, ArrowRight, FileText } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {ShipmentDetails} from '../../../shared/shipment-details/shipment-details';
import {Shipment} from '../../../../../booking/services/shipment.service';

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonModule, FormsModule, ShipmentDetails],
  templateUrl: './step-details.html',
  styleUrl: './step-details.css'
})
export class StepDetailsComponent {
  @Input() initialMbl = '';
  @Input() initialShipment: Shipment[] = []; // Pre-selected
  @Input() shipments: Shipment[] = [];
  @Output() back = new EventEmitter<void>();
  @Output() complete = new EventEmitter<{ mblNumber: string, selectedShipments: Shipment[] }>();

  mblNumber = '';
  selectedShipments: Shipment[] = [];
  isGenerating = false;

  constructor(private messageService: MessageService) {}

  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly FileText = FileText;

  hasShipments: boolean = true// Added flag to track if we actually have shippers

  ngOnInit() {
    this.mblNumber = this.initialMbl;

    // Check if linkedShipments was explicitly provided (even if empty)
    if (this.shipments) {
      this.hasShipments = this.shipments.length > 0;
    } else {
      this.hasShipments = false;
    }
  }

  toggleShipment(shipment: Shipment, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedShipments.includes(shipment)) {
        this.selectedShipments.push(shipment);
      }
    } else {
      this.selectedShipments = this.selectedShipments.filter(
        selectedShipment => selectedShipment.shipment_id !== shipment.shipment_id
      );
    }
  }

  generatePreview() {
    if (!this.mblNumber) {
      this.messageService.add({ severity: 'warn', summary: 'Missing MBL', detail: 'Please enter the Master BL number.' });
      return;
    }
    if (this.selectedShipments.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Shipment', detail: 'Please select at least one shipment.' });
      return;
    }

    this.isGenerating = true;
    setTimeout(() => {
      this.isGenerating = false;
      this.complete.emit({
        mblNumber: this.mblNumber,
        selectedShipments: this.selectedShipments
      });
    }, 1500);
  }
}
