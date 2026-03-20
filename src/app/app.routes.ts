import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { GenerateComponent } from './pages/generate/generate';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DocumentGenerationResultComponent } from './pages/document-generation-result/document-generation-result';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'generate/result', component: DocumentGenerationResultComponent },
    { path: 'generate', component: GenerateComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '' }
];
