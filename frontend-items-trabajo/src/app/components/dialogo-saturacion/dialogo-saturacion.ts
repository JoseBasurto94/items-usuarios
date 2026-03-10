import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-dialogo-saturacion',
  standalone: false,
template: `
    <h2 mat-dialog-title>⚠️ Usuario Saturado</h2>
    
    <mat-dialog-content>
      <p class="mensaje">{{ data.mensaje }}</p>
      
      <div *ngIf="data.usuarioSugerido" class="sugerencia">
        <mat-icon color="primary">person</mat-icon>
        <span><strong>Usuario sugerido:</strong> {{ data.usuarioSugerido }}</span>
      </div>

      <mat-form-field appearance="fill" class="full-width" *ngIf="data.usuariosAlternativos?.length">
        <mat-label>Seleccionar usuario alternativo</mat-label>
        <mat-select #selectRef>
          <mat-option *ngFor="let user of data.usuariosAlternativos" [value]="user">
            {{ user }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <p *ngIf="!data.usuariosAlternativos?.length" class="sin-opciones">
        No hay usuarios alternativos disponibles
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button 
        mat-raised-button 
        color="primary"
        [disabled]="!selectRef?.value"
        (click)="asignar()">
        Asignar seleccionado
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mensaje { margin-bottom: 20px; }
    .sugerencia { 
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #e3f2fd;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .full-width { width: 100%; }
    .sin-opciones { color: #f44336; font-style: italic; }
  `]
})
export class DialogoSaturacion {
     @ViewChild('selectRef') selectRef: MatSelect | undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogoSaturacion>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  asignar() {
    if (this.selectRef && this.selectRef.value) {
      this.dialogRef.close(this.selectRef.value);
    }
  }
}
