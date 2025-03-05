import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaminhoesComponent } from './components/caminhoes/caminhoes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'caminhoes', component: CaminhoesComponent },
  // Adicione mais rotas conforme necessário
];
