import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateSidebarComponent, GenerateMode } from './components/generate-sidebar/generate-sidebar';
import { DocToDocComponent } from './components/doc-to-doc/doc-to-doc';
import { InfoToDocComponent } from './components/info-to-doc/info-to-doc';
import {Loader2, LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-generate',
  imports: [CommonModule, GenerateSidebarComponent, DocToDocComponent, InfoToDocComponent, LucideAngularModule],
  templateUrl: './generate.html',
  styleUrl: './generate.css'
})
export class GenerateComponent {
  activeMode: GenerateMode = 'doc-to-doc';
  sidebarCollapsed = false;
  isLoading = false;

  onModeChange(mode: GenerateMode) {
    this.activeMode = mode;
  }

  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  protected readonly Loader2 = Loader2;
}
