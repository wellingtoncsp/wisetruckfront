import { Routes } from '@angular/router';
import { CaminhoesListComponent } from './caminhoes-list/caminhoes-list.component';

export const CAMINHOES_ROUTES: Routes = [
  {
    path: '',
    component: CaminhoesListComponent,
    title: 'WiseTruck - Gerenciamento de Caminhões'
  }
]; 