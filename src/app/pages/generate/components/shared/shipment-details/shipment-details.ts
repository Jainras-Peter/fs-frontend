import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Shipment} from '../../../../booking/services/shipment.service';
import {Archive, Boxes, LucideAngularModule, Milestone, Package, Scale} from 'lucide-angular';

@Component({
  selector: 'app-shipment-details',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './shipment-details.html',
  styleUrl: './shipment-details.css',
})
export class ShipmentDetails {
  @Input() mblNumber!: string;
  @Input() shipments!: Shipment[];
  @Input() selectedShipments: Shipment[] = [];
  @Output() toggle = new EventEmitter<{shipment: Shipment, isChecked: boolean}>();

  readonly PackageIcon = Package;
  readonly ArchiveIcon = Archive;
  readonly ScaleIcon = Scale;
  readonly MeasurementIcon  = Milestone;
  readonly VolumeIcon  = Boxes;

  loadDetails!: any[]
  isSelected: boolean = false;

  ngOnInit() {
    this.getLinkedShipments();
    this.getGoodsDetails()
  }

  getLinkedShipments() {
    this.shipments.filter((shipment: Shipment) => {
      return shipment.mbl_number !== this.mblNumber
    })
  }

  isShipmentSelected(shipment: Shipment): boolean {
    return this.selectedShipments.some(s => s.shipment_id === shipment.shipment_id);
  }

  getGoodsDetails() {
    this.loadDetails = this.shipments.map((shipment: Shipment) => {
      return[
        {
          label: 'Quantity',
          icon: this.ArchiveIcon,
          value: shipment.packages_count
        },
        {
          label: 'Measurement',
          icon: this.MeasurementIcon,
          value: shipment.measurement
        },
        {
          label: 'Gross Weight (G/N)',
          icon: this.ScaleIcon,
          value: shipment.gross_weight + '/' + shipment.net_weight
        },
        {
          label: 'Volume / Marks',
          icon: this.VolumeIcon,
          value: shipment.volume + ' | ' + shipment.marks_and_numbers
        }
      ]
    })
  }
}
