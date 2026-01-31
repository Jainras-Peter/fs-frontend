import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateSidebarComponent, GenerateMode } from './components/generate-sidebar/generate-sidebar';
import { DocToDocComponent } from './components/doc-to-doc/doc-to-doc';
import { InfoToDocComponent } from './components/info-to-doc/info-to-doc';

@Component({
  selector: 'app-generate',
  imports: [CommonModule, GenerateSidebarComponent, DocToDocComponent, InfoToDocComponent],
  templateUrl: './generate.html',
  styleUrl: './generate.css'
})
export class GenerateComponent {
  activeMode: GenerateMode = 'doc-to-doc';

  onModeChange(mode: GenerateMode) {
    this.activeMode = mode;
  }
}
