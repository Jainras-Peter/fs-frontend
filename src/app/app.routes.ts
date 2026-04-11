import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { GenerateComponent } from './pages/generate/generate';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { DocumentGenerationResultComponent } from './pages/document-generation-result/document-generation-result';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'generate/result', component: DocumentGenerationResultComponent, canActivate: [authGuard] },
    { path: 'generate', component: GenerateComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./User/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
    { 
        path: 'booking', 
        canActivate: [authGuard],
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
        children: [
            { path: '', redirectTo: 'shipper', pathMatch: 'full' },
            { path: 'shipper', loadComponent: () => import('./pages/booking/shipper/shipper.component').then(m => m.ShipperComponent) },
            { path: 'shipment', loadComponent: () => import('./pages/booking/shipment/shipment.component').then(m => m.ShipmentComponent) },
            { path: 'status', loadComponent: () => import('./pages/booking/status/status.component').then(m => m.StatusComponent) }
        ]
    },
    { path: 'login', loadComponent: () => import('./User/login/login').then(m => m.Login) },
    { path: 'signup', loadComponent: () => import('./User/signup/signup').then(m => m.Signup) },
    { path: '**', redirectTo: '' }
];
