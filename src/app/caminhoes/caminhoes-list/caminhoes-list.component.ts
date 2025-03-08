import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CaminhaoService } from '../../services/caminhao.service';
import { Caminhao } from '../../models/caminhao.model';
import { CaminhaoFormComponent } from '../caminhao-form/caminhao-form.component';
import { CaminhaoDetailsComponent } from '../caminhao-details/caminhao-details.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-caminhoes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './caminhoes-list.component.html',
  styleUrls: ['./caminhoes-list.component.css']
})
export class CaminhoesListComponent implements OnInit {
  displayedColumns: string[] = ['placa', 'modelo', 'dataFabricacao', 'status', 'acoes'];
  dataSource: Caminhao[] = [];
  loading = true;
  error = false;

  @ViewChild(MatTable) table!: MatTable<Caminhao>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private caminhaoService: CaminhaoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCaminhoes();
  }

  loadCaminhoes(): void {
    this.loading = true;
    this.error = false;
    
    this.caminhaoService.getCaminhoes()
      .subscribe({
        next: (data) => {
          this.dataSource = data;
          this.loading = false;
          if (this.table) {
            this.table.renderRows();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar caminhões:', error);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implementar filtro local ou enviar para o servidor conforme necessário
  }

  addCaminhao(): void {
    const dialogRef = this.dialog.open(CaminhaoFormComponent, {
      data: { caminhao: {}, isEdit: false },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCaminhoes();
      }
    });
  }

  editCaminhao(caminhao: Caminhao): void {
    const dialogRef = this.dialog.open(CaminhaoFormComponent, {
      data: { caminhao: { ...caminhao }, isEdit: true },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCaminhoes();
      }
    });
  }

  viewCaminhao(caminhao: Caminhao): void {
    this.dialog.open(CaminhaoDetailsComponent, {
      data: { id: caminhao.id },
      width: '600px'
    });
  }

  deleteCaminhao(caminhao: Caminhao): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja realmente excluir o caminhão ${caminhao.modelo} (${caminhao.placa})?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && caminhao.id) {
        this.caminhaoService.deleteCaminhao(caminhao.id)
          .subscribe({
            next: () => {
              this.snackBar.open('Caminhão excluído com sucesso!', 'Fechar', { duration: 3000 });
              this.loadCaminhoes();
            },
            error: (error) => {
              console.error('Erro ao excluir caminhão:', error);
              this.snackBar.open('Erro ao excluir caminhão. Tente novamente.', 'Fechar', { duration: 5000 });
            }
          });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponível': return 'status-disponivel';
      case 'Em Manutenção': return 'status-manutencao';
      case 'Em Viagem': return 'status-em-viagem';
      default: return '';
    }
  }

  retry(): void {
    this.loadCaminhoes();
  }
} 