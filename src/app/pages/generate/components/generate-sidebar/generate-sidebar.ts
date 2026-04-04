import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  FileText,
  Keyboard,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIconData,
} from 'lucide-angular';
import {animate, style, transition, trigger} from '@angular/animations';

export type GenerateMode = 'doc-to-doc' | 'info-to-doc';

@Component({
  selector: 'app-generate-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './generate-sidebar.html',
  styleUrl: './generate-sidebar.css',
})
export class GenerateSidebarComponent {
  @Input() activeMode: GenerateMode = 'doc-to-doc';
  @Output() modeChange = new EventEmitter<GenerateMode>();

  readonly FileText = FileText;
  readonly Keyboard = Keyboard;
  PanelLeftClose = PanelLeftClose;
  PanelLeftOpen = PanelLeftOpen;

  panelIcon: LucideIconData = PanelLeftClose

  setMode(mode: GenerateMode) {
    this.modeChange.emit(mode);
  }

  onPanelClick() {
    if(this.panelIcon === this.PanelLeftClose)
      this.panelIcon = this.PanelLeftOpen
    else
      this.panelIcon = this.PanelLeftClose;
  }
}
