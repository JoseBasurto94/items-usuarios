import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-asignacion',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    
    <mat-dialog-content>
      <div class="mensaje-container">
        <p class="mensaje-principal">{{ data.mensaje }}</p>
        
        <div *ngIf="data.tipo === 'saturacion'" class="detalle-saturacion">
          <mat-icon color="warn">warning</mat-icon>
          <span>Tiene {{ data.itemsRelevantes }} items altamente relevantes (máximo 3)</span>
        </div>

        <div *ngIf="data.usuarioSugerido" class="sugerencia">
          <strong>Usuario sugerido:</strong>
          <div class="usuario-sugerido">
            <mat-icon color="primary">person</mat-icon>
            <span>{{ data.usuarioSugerido }}</span>
          </div>
        </div>

        <div *ngIf="data.usuariosAlternativos?.length" class="alternativos">
          <p><strong>Otros usuarios disponibles:</strong></p>
          <div *ngIf="data.usuariosAlternativos?.length" class="alternativos">
            <p><strong>Otros usuarios disponibles:</strong></p>
            <ul class="lista-usuarios">
              <li *ngFor="let user of data.usuariosAlternativos">
                <mat-icon>person</mat-icon> {{ user }}
              </li>
            </ul>
          </div>
        </div>

        <p class="pregunta">¿Qué deseas hacer?</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      
      <button 
        *ngIf="data.usuarioSugerido"
        mat-raised-button 
        color="primary"
        [mat-dialog-close]="'asignar_sugerido'">
        Asignar a {{ data.usuarioSugerido }}
      </button>

      <button 
        *ngIf="data.usuariosAlternativos?.length"
        mat-button
        [mat-dialog-close]="'ver_todos'">
        Ver todos los disponibles
      </button>

      <button 
        *ngIf="data.tipo === 'no_optimo'"
        mat-stroked-button
        [mat-dialog-close]="'asignar_igual'">
        Asignar de todas formas
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mensaje-container {
      padding: 16px 0;
    }
    .mensaje-principal {
      font-size: 16px;
      margin-bottom: 20px;
      color: rgba(0,0,0,0.87);
    }
    .detalle-saturacion {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #fff3e0;
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
      color: #f44336;
    }
    .sugerencia {
      margin: 20px 0;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 4px;
    }
    .usuario-sugerido {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      margin-top: 8px;
      color: #1976d2;
    }
    .alternativos {
      margin: 20px 0;
    }
    .pregunta {
      font-weight: bold;
      margin: 20px 0 10px;
      font-size: 15px;
    }
    .actions {
      gap: 8px;
      padding: 16px 24px;
    }
    .lista-usuarios {
      list-style: none;
      padding: 0;
      margin: 10px 0;
    }
    .lista-usuarios li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class ConfirmarAsignacion {

  constructor(
    public dialogRef: MatDialogRef<ConfirmarAsignacion>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
