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
    { 
        path: 'booking', 
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
        children: [
            { path: '', redirectTo: 'shipper', pathMatch: 'full' },
            { path: 'shipper', loadComponent: () => import('./pages/booking/shipper/shipper.component').then(m => m.ShipperComponent) },
            { path: 'shipment', loadComponent: () => import('./pages/booking/shipment/shipment.component').then(m => m.ShipmentComponent) },
            { path: 'status', loadComponent: () => import('./pages/booking/status/status.component').then(m => m.StatusComponent) }
        ]
    },
    { path: '**', redirectTo: '' }
];
