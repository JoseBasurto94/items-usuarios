import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-asignacion-automatica',
  standalone: false,
  template: `
    <h2 mat-dialog-title>🤖 Asignación Automática</h2>
    
    <mat-dialog-content>
      <p>¿Deseas asignar automáticamente este item según las reglas de negocio?</p>
      
      <div class="item-info">
        <p><strong>Item:</strong> {{ data.item.titulo }}</p>
        <p><strong>Fecha entrega:</strong> {{ data.item.fechaEntrega | date:'dd/MM/yyyy' }}</p>
        <p><strong>Relevancia:</strong> 
          <span [class.alta]="data.item.relevancia === 'alta'">
            {{ data.item.relevancia }}
          </span>
        </p>
      </div>

      <div class="reglas-info">
        <h3>Reglas que se aplicarán:</h3>
        <ul>
          <li>📅 Si fecha próxima (< 3 días) → usuario con menos pendientes</li>
          <li>⭐ Si es relevante → usuario no saturado con menos pendientes</li>
          <li>⚖️ Si es normal → balanceo de carga</li>
        </ul>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        Asignar Automáticamente
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .item-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .item-info p {
      margin: 8px 0;
    }
    .alta {
      color: #f44336;
      font-weight: bold;
    }
    .reglas-info {
      background-color: #e8f5e9;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }
    .reglas-info h3 {
      margin: 0 0 12px 0;
      color: #2e7d32;
      font-size: 16px;
    }
    .reglas-info ul {
      margin: 0;
      padding-left: 20px;
    }
    .reglas-info li {
      margin: 8px 0;
      color: #1e5e23;
    }
  `]
})
export class ConfirmarAsignacionAutomatica {

  constructor(
    public dialogRef: MatDialogRef<ConfirmarAsignacionAutomatica>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
