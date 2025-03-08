import { Component, OnInit } from '@angular/core';
import { CaminhaoService } from '../services/caminhao.service';

@Component({
  // ... configurações do componente
})
export class DashboardComponent implements OnInit {
  totalCaminhoes = 0;
  // Outras propriedades...

  constructor(private caminhaoService: CaminhaoService) {}

  ngOnInit() {
    this.loadCaminhoesSummary();
    // Outras inicializações...
  }

  loadCaminhoesSummary() {
    this.caminhaoService.getCaminhoes().subscribe({
      next: (data) => {
        this.totalCaminhoes = data.length;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo de caminhões:', error);
      }
    });
  }

  // Outros métodos...
} 