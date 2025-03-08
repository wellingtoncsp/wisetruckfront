import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CaminhaoService } from '../../services/caminhao.service';
import { Caminhao } from '../../models/caminhao.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface CaminhaoFormData {
  caminhao: Caminhao;
  isEdit: boolean;
}

@Component({
  selector: 'app-caminhao-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './caminhao-form.component.html',
  styleUrls: ['./caminhao-form.component.css']
})
export class CaminhaoFormComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean;
  loading = false;
  statusOptions = ['Disponível', 'Em Viagem', 'Em Manutenção'];

  constructor(
    private fb: FormBuilder,
    private caminhaoService: CaminhaoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CaminhaoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaminhaoFormData
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.isEdit && this.data.caminhao) {
      this.form.patchValue(this.data.caminhao);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      modelo: ['', [Validators.required]],
      placa: ['', [Validators.required, Validators.pattern('[A-Z]{3}[0-9][0-9A-Z][0-9]{2}')]],
      dataFabricacao: [null, [Validators.required]],
      status: ['Disponível', [Validators.required]]
    });

    // Se for edição, desabilitar a edição da placa
    if (this.isEdit) {
      this.form.get('placa')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    // Obter todos os valores do formulário, inclusive os desabilitados
    const formValues = this.form.getRawValue();
    
    // Criar objeto do caminhão com os valores do formulário
    const caminhao: Caminhao = {
      modelo: formValues.modelo,
      placa: formValues.placa,
      dataFabricacao: formValues.dataFabricacao,
      status: formValues.status
    };
    
    // Se estiver editando, incluir o ID
    if (this.isEdit && this.data.caminhao.id) {
      caminhao.id = this.data.caminhao.id;
    }

    if (this.isEdit) {
      this.caminhaoService.updateCaminhao(caminhao.id!, caminhao)
        .subscribe({
          next: (result) => {
            this.snackBar.open('Caminhão atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erro ao atualizar caminhão:', error);
            this.snackBar.open(`Erro ao atualizar caminhão: ${error.error || 'Tente novamente'}`, 'Fechar', { duration: 5000 });
            this.loading = false;
          }
        });
    } else {
      this.caminhaoService.createCaminhao(caminhao)
        .subscribe({
          next: (result) => {
            this.snackBar.open('Caminhão cadastrado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Erro ao cadastrar caminhão:', error);
            this.snackBar.open(`Erro ao cadastrar caminhão: ${error.error || 'Tente novamente'}`, 'Fechar', { duration: 5000 });
            this.loading = false;
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 