import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, FileText, Shield, Zap, Globe, Ship } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ButtonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent {
  readonly FileText = FileText;
  readonly Shield = Shield;
  readonly Zap = Zap;
  readonly Globe = Globe;
  readonly Ship = Ship;
}
