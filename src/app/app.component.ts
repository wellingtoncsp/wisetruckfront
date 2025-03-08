import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';
import { CaminhaoService } from './services/caminhao.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WiseTruck - Gestão Inteligente de Frota';
  mobileQuery: MediaQueryList;
  
  @ViewChild('snav') sidenav!: MatSidenav;

  private _mobileQueryListener: () => void;

  sidenavExpanded = true;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private caminhaoService: CaminhaoService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    // Rastrear mudanças na rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Fecha o sidenav no mobile quando a rota muda
      if (this.mobileQuery.matches && this.sidenav) {
        this.sidenav.close();
      }
    });
  }

  ngOnInit(): void {
    // Verificar o tamanho da tela ao carregar
    if (this.mobileQuery.matches) {
      this.sidenavExpanded = false;
    } else {
      // Garantir que o menu esteja sempre presente em desktop
      setTimeout(() => {
        if (this.sidenav && !this.mobileQuery.matches) {
          this.sidenav.open();
        }
      }, 100);
    }
    
    // Pré-carregar dados mais utilizados
    this.preloadData();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit() {
    // Garantir que o sidenav esteja aberto no modo desktop
    setTimeout(() => {
      if (!this.mobileQuery.matches) {
        this.sidenav.open();
        
        // Forçar recálculo do layout
        this.adjustLayout();
      }
    }, 100);
  }

  toggleSidenav() {
    this.toggleMobileSidenav();
  }

  private adjustLayout() {
    // Forçar recálculo de layout
    setTimeout(() => {
      // Disparar evento de resize para que componentes possam se ajustar
      window.dispatchEvent(new Event('resize'));
      
      // Forçar atualização do DOM
      this.changeDetectorRef.detectChanges();
    }, 300);
  }

  toggleMobileSidenav() {
    if (this.mobileQuery.matches) {
      if (this.sidenav) {
        this.sidenav.toggle();
        
        setTimeout(() => {
          this.changeDetectorRef.detectChanges();
        }, 100);
      }
    } else {
      this.sidenavExpanded = !this.sidenavExpanded;
      
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.changeDetectorRef.detectChanges();
      }, 300);
    }
  }

  ngAfterViewChecked() {
    if (!this.mobileQuery.matches && this.sidenav && !this.sidenav.opened) {
      setTimeout(() => {
        this.sidenav.open();
        this.changeDetectorRef.detectChanges();
      }, 100);
    }
  }

  private preloadData(): void {
    // Não fazer pré-carregamento até que o backend seja mais rápido
    console.log('Preload desabilitado temporariamente para evitar timeouts');
    
    // Manter comentado até resolver os problemas de performance do backend
    /*
    this.caminhaoService.getCaminhoes().subscribe({
      next: (data) => console.log('Dados pré-carregados:', data.length),
      error: (err) => console.error('Erro no pré-carregamento:', err)
    });
    */
  }
}
