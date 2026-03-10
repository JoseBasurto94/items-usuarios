import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-resultado-asignacion',
  standalone: false,
template: `
    <h2 mat-dialog-title [ngClass]="{'error-title': data.esError}">
      {{ data.titulo }}
    </h2>
    
    <mat-dialog-content>
      <p class="mensaje">{{ data.mensaje }}</p>
      
      <div *ngIf="data.asignacion" class="detalle-asignacion">
        <h3>Detalle de la asignación:</h3>
        <p><strong>Usuario asignado:</strong> {{ data.asignacion.usuarioAsignado }}</p>
        <p><strong>Motivo:</strong> {{ data.asignacion.motivoAsignacion }}</p>
        <p><strong>Días para entrega:</strong> {{ data.asignacion.diasParaEntrega }}</p>
      </div>

      <div *ngIf="data.codigo" class="codigo-error">
        <p><strong>Código:</strong> {{ data.codigo }}</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button [color]="data.esError ? 'warn' : 'primary'" mat-dialog-close>
        Aceptar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .error-title {
      color: #f44336;
    }
    .mensaje {
      font-size: 16px;
      margin: 16px 0;
      line-height: 1.5;
    }
    .detalle-asignacion {
      background-color: #e8f5e9;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .detalle-asignacion h3 {
      margin: 0 0 12px 0;
      color: #2e7d32;
      font-size: 15px;
    }
    .codigo-error {
      background-color: #ffebee;
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
      color: #f44336;
    }
  `]
})
export class DialogoResultadoAsignacion {
   constructor(
    public dialogRef: MatDialogRef<DialogoResultadoAsignacion>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
