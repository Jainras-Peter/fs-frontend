import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChevronDown, LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-input-dropdown',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './input-dropdown.html',
  styleUrl: './input-dropdown.css',
})
export class InputDropdown {
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() items!: string[];

  @Output() selectedValueChange = new EventEmitter<string>();

  selectedValue: string = '';
  showDropdown: boolean = false;

  protected readonly ChevronDown = ChevronDown;

  onSelect(selectedItem: string) {
    this.showDropdown = false;
    this.selectedValue = selectedItem
    this.selectedValueChange.emit(selectedItem)
  }
}
