import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileText, Keyboard } from 'lucide-angular';

export type GenerateMode = 'doc-to-doc' | 'info-to-doc';

@Component({
  selector: 'app-generate-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './generate-sidebar.html',
  styleUrl: './generate-sidebar.css'
})
export class GenerateSidebarComponent {
  @Input() activeMode: GenerateMode = 'doc-to-doc';
  @Output() modeChange = new EventEmitter<GenerateMode>();

  readonly FileText = FileText;
  readonly Keyboard = Keyboard;

  setMode(mode: GenerateMode) {
    this.modeChange.emit(mode);
  }
}
