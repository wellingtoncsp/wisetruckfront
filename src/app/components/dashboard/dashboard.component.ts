import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Bem-vindo ao WiseTruck</h1>
        <p>Sistema inteligente para gestão de frota</p>
      </div>
      
      <div class="dashboard-cards">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar truck-icon">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <mat-card-title>Total de Caminhões</mat-card-title>
            <mat-card-subtitle>Frota atual</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2 class="card-value">{{ caminhoes }}</h2>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/caminhoes">VER DETALHES</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar driver-icon">
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>Motoristas</mat-card-title>
            <mat-card-subtitle>Equipe ativa</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2 class="card-value">12</h2>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/motoristas">VER DETALHES</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar route-icon">
              <mat-icon>map</mat-icon>
            </div>
            <mat-card-title>Rotas Ativas</mat-card-title>
            <mat-card-subtitle>Em andamento</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2 class="card-value">7</h2>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/rotas">VER DETALHES</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <div mat-card-avatar class="card-avatar maintenance-icon">
              <mat-icon>build</mat-icon>
            </div>
            <mat-card-title>Manutenções</mat-card-title>
            <mat-card-subtitle>Pendentes</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2 class="card-value">3</h2>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/manutencao">VER DETALHES</button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <div class="dashboard-second-row">
        <mat-card class="quick-action-card">
          <mat-card-header>
            <mat-card-title>Ações Rápidas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon> Novo Caminhão
              </button>
              <button mat-raised-button color="accent">
                <mat-icon>add</mat-icon> Novo Motorista
              </button>
              <button mat-raised-button color="warn">
                <mat-icon>assignment</mat-icon> Criar Relatório
              </button>
              <button mat-raised-button>
                <mat-icon>map</mat-icon> Planejar Rota
              </button>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="activity-feed-card">
          <mat-card-header>
            <mat-card-title>Atividades Recentes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="primary">local_shipping</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Caminhão cadastrado</div>
                  <div class="activity-details">Scania R450 - Placa ABC1234</div>
                  <div class="activity-time">Hoje, 14:30</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="accent">person</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Motorista atribuído</div>
                  <div class="activity-details">João Silva - Rota SP-RJ</div>
                  <div class="activity-time">Hoje, 10:15</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon color="warn">build</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Manutenção agendada</div>
                  <div class="activity-details">Volvo FH - Troca de óleo</div>
                  <div class="activity-time">Ontem, 16:45</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background-color: #fff;
    }
    
    /* Cabeçalho clean */
    .welcome-section {
      margin: 0;
      background: #f8f9fa;
      padding: 24px 32px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .welcome-section h1 {
      font-size: 2rem;
      margin: 0 0 8px 0;
      font-weight: 600;
      color: #3949ab;
    }
    
    .welcome-section p {
      font-size: 1rem;
      margin: 0;
      color: #666;
    }
    
    /* Cards com design light */
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px;
    }
    
    .dashboard-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #eee;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
    
    /* Cores para ícones de cards com tons mais suaves */
    .truck-icon {
      background-color: rgba(25, 118, 210, 0.08);
      color: #1976d2;
    }
    
    .driver-icon {
      background-color: rgba(156, 39, 176, 0.08);
      color: #9c27b0;
    }
    
    .route-icon {
      background-color: rgba(67, 160, 71, 0.08);
      color: #43a047;
    }
    
    .maintenance-icon {
      background-color: rgba(255, 87, 34, 0.08);
      color: #ff5722;
    }
    
    .card-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }
    
    .card-value {
      font-size: 3rem;
      font-weight: 500;
      margin: 20px 0;
      color: #212121;
      text-align: center;
    }
    
    /* Segunda linha de cards com largura total */
    .dashboard-second-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      padding: 0 32px 32px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .quick-action-card, .activity-feed-card {
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }
    
    .activity-list {
      padding: 8px 0;
    }
    
    .activity-item {
      padding: 16px;
      transition: background-color 0.2s;
    }
    
    .activity-item:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
    
    .activity-icon {
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .activity-content {
      flex: 1;
    }
    
    .activity-title {
      font-weight: 500;
      color: #212121;
    }
    
    .activity-details {
      color: #616161;
    }
    
    .activity-time {
      color: #9e9e9e;
      font-size: 0.85rem;
    }
    
    mat-card-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding-bottom: 16px;
    }
    
    /* Média queries para responsividade */
    @media (max-width: 1200px) {
      .dashboard-cards {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
    }
    
    @media (max-width: 960px) {
      .dashboard-second-row {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 768px) {
      .welcome-section {
        padding: 24px;
      }
      
      .welcome-section h1 {
        font-size: 1.8rem;
      }
      
      .dashboard-cards, .dashboard-second-row {
        padding: 16px;
      }
    }
    
    /* Cards com cores claras nos gráficos e widgets */
    .chart-card, .stats-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #eee;
      padding: 16px;
      margin-bottom: 24px;
    }
    
    .chart-title, .stats-title {
      color: #333;
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    
    /* Estilo para elementos de gráfico (se existirem) */
    .chart-container {
      background-color: #fff;
      padding: 8px;
      border-radius: 8px;
    }
    
    /* Ajuste das cores para os cards de ação rápida */
    .quick-action-card, .activity-feed-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #eee;
      padding: 16px;
    }
    
    .card-title {
      color: #333;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 12px;
    }
    
    .activity-item {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .activity-item:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      background-color: #f5f7fa;
      color: #1976d2;
    }
    
    .activity-title {
      color: #333;
      font-weight: 500;
    }
    
    .activity-details {
      color: #666;
    }
    
    .activity-time {
      color: #999;
      font-size: 12px;
    }
  `]
})
export class DashboardComponent {
  caminhoes: number = 0;

  constructor() {
    // Em um ambiente real, você buscaria estes dados de um serviço
    this.caminhoes = 5; // Valor estático para exemplo
  }
} 