import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Caminhao } from '../../models/caminhao.model';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-caminhoes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="caminhoes-container">
      <div class="page-header">
        <h1>Lista de Caminhões</h1>
        <p>Gerencie a frota da sua empresa</p>
      </div>
      
      <div class="action-bar">
        <mat-form-field appearance="outline">
          <mat-label>Buscar</mat-label>
          <input matInput placeholder="Buscar por modelo, placa, etc.">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> Novo Caminhão
        </button>
      </div>
      
      <!-- Loading State - Centralizado -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="50"></mat-spinner>
        <div class="loading-text">Carregando dados...</div>
      </div>
      
      <!-- Dados da tabela - Clean layout -->
      <div class="mat-elevation-z8" *ngIf="!loading && !error && caminhoes.length > 0">
        <mat-table [dataSource]="caminhoes">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <mat-header-cell *matHeaderCellDef> ID </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.id}} </mat-cell>
          </ng-container>
          
          <!-- Modelo Column -->
          <ng-container matColumnDef="modelo">
            <mat-header-cell *matHeaderCellDef> Modelo </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.modelo}} </mat-cell>
          </ng-container>
          
          <!-- Marca Column -->
          <ng-container matColumnDef="marca">
            <mat-header-cell *matHeaderCellDef> Marca </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.marca}} </mat-cell>
          </ng-container>
          
          <!-- Ano Column -->
          <ng-container matColumnDef="ano">
            <mat-header-cell *matHeaderCellDef> Ano </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.ano}} </mat-cell>
          </ng-container>
          
          <!-- Placa Column -->
          <ng-container matColumnDef="placa">
            <mat-header-cell *matHeaderCellDef> Placa </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.placa}} </mat-cell>
          </ng-container>
          
          <!-- Capacidade Column -->
          <ng-container matColumnDef="capacidade">
            <mat-header-cell *matHeaderCellDef> Capacidade </mat-header-cell>
            <mat-cell *matCellDef="let caminhao"> {{caminhao.capacidade}} ton </mat-cell>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef> Ações </mat-header-cell>
            <mat-cell *matCellDef="let caminhao">
              <button mat-icon-button color="primary" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="accent" matTooltip="Visualizar">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="warn" matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>
          
          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
        
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
      
      <!-- Empty State quando não há dados -->
      <div *ngIf="!loading && !error && caminhoes.length === 0" class="empty-state">
        <mat-icon>local_shipping</mat-icon>
        <h2>Nenhum caminhão encontrado</h2>
        <p>Cadastre seu primeiro caminhão para começar</p>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon> Novo Caminhão
        </button>
      </div>
    </div>
  `,
  styles: [`
    .caminhoes-container {
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      overflow-y: auto;
      box-sizing: border-box;
    }
    
    /* Ajuste dos espaçamentos para ocupar corretamente o espaço disponível */
    .page-header {
      margin: 0;
      padding: 24px;
      background: #f8f9fa;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .page-header h1 {
      font-size: 1.8rem;
      margin: 0 0 8px 0;
      font-weight: 600;
      color: #3949ab;
    }
    
    .page-header p {
      font-size: 1rem;
      margin: 0;
      color: #666;
    }
    
    /* Barra de ação mais ampla */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 16px 24px;
      background-color: #fff;
    }
    
    mat-form-field {
      width: 75%;
    }
    
    /* Estilo da tabela melhorado */
    .mat-elevation-z8 {
      margin: 16px 24px;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }
    
    mat-table {
      width: 100% !important;
      box-shadow: none !important;
    }
    
    mat-header-row {
      background-color: #f8f9fa;
      min-height: 56px;
    }
    
    mat-header-cell {
      color: #555;
      font-weight: 500;
      font-size: 14px;
    }
    
    mat-cell {
      font-size: 14px;
      color: #333;
    }
    
    mat-row {
      min-height: 52px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    mat-row:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    /* Aumentar contraste nas ações */
    .mat-column-actions {
      display: flex;
      justify-content: flex-end;
      padding-right: 16px;
    }
    
    .mat-column-actions button {
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .mat-column-actions button:hover {
      opacity: 1;
    }

    /* Ajuste de paginador */
    mat-paginator {
      background-color: white;
      border-top: 1px solid #f0f0f0;
    }
    
    /* Estados especiais com largura total */
    .loading-container, .error-container, .empty-state {
      padding: 48px 32px;
      text-align: center;
      background-color: #fff;
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Estado de carregamento centralizado */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    
    .loading-container mat-spinner {
      margin: 0 auto 24px;
    }
    
    /* Texto de carregamento */
    .loading-text {
      font-size: 16px;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .action-bar {
        flex-direction: column;
        padding: 16px;
      }
      
      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }
      
      .mat-elevation-z8 {
        padding: 0 16px 16px;
      }
    }
  `]
})
export class CaminhoesComponent implements OnInit {
  caminhoes: Caminhao[] = [];
  loading = false;
  error: string | null = null;
  displayedColumns: string[] = ['id', 'modelo', 'marca', 'ano', 'placa', 'capacidade', 'actions'];
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.carregarCaminhoes();
  }
  
  carregarCaminhoes(): void {
    this.loading = true;
    this.error = null;
    
    this.apiService.getTestData().subscribe({
      next: (data) => {
        this.caminhoes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar caminhões:', err);
        this.error = 'Não foi possível carregar os dados. Por favor, tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }
} 