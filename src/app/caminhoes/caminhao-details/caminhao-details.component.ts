import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CaminhaoService } from '../../services/caminhao.service';
import { Caminhao } from '../../models/caminhao.model';

export interface CaminhaoDetailsData {
  id: number;
}

@Component({
  selector: 'app-caminhao-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './caminhao-details.component.html',
  styleUrls: ['./caminhao-details.component.css']
})
export class CaminhaoDetailsComponent implements OnInit {
  caminhao?: Caminhao;
  loading = true;
  error = false;

  constructor(
    private caminhaoService: CaminhaoService,
    public dialogRef: MatDialogRef<CaminhaoDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaminhaoDetailsData
  ) {}

  ngOnInit(): void {
    this.loadCaminhao();
  }

  loadCaminhao(): void {
    this.caminhaoService.getCaminhao(this.data.id)
      .subscribe({
        next: (caminhao) => {
          this.caminhao = caminhao;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do caminhão:', error);
          this.loading = false;
          this.error = true;
        }
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponível': return 'status-disponivel';
      case 'Em Manutenção': return 'status-manutencao';
      case 'Em Viagem': return 'status-em-viagem';
      default: return '';
    }
  }
} 