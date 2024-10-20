import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErrorComponent } from './pages/error/error.component';
import { authGuard } from './guards/auth/auth.guard';
import { loginGuard } from './guards/login/login.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'error', component: ErrorComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'settings', component: SettingsComponent }
        ],
    },
    { path: ':shortUrl', component: RedirectComponent },
];
