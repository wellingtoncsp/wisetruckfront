import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CAMINHOES_ROUTES } from './caminhoes/caminhoes.routes';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'WiseTruck - Dashboard' },
  { path: 'caminhoes', children: CAMINHOES_ROUTES },
  // Adicione mais rotas conforme necessário
];
