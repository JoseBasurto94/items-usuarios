import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-dialogo-no-optimo',
  standalone: false,
 template: `
    <h2 mat-dialog-title>🔄 Asignación No Óptima</h2>
    
    <mat-dialog-content>
      <p class="mensaje">{{ data.mensaje }}</p>
      
      <div class="sugerencia" *ngIf="data.usuarioSugerido">
        <mat-icon color="primary">person</mat-icon>
        <span><strong>Usuario sugerido:</strong> {{ data.usuarioSugerido }}</span>
      </div>

      <mat-form-field appearance="fill" class="full-width" *ngIf="data.usuariosAlternativos?.length">
        <mat-label>Seleccionar usuario alternativo</mat-label>
        <mat-select [(ngModel)]="usuarioSeleccionado">
          <mat-option *ngFor="let user of data.usuariosAlternativos" [value]="user">
            {{ user }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <p *ngIf="!data.usuariosAlternativos?.length && !data.usuarioSugerido" class="sin-opciones">
        No hay usuarios disponibles
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button 
        mat-raised-button 
        color="primary"
        [disabled]="!usuarioSeleccionado"
        (click)="asignar()">
        Asignar {{ usuarioSeleccionado }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .mensaje { 
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.5;
    }
    .sugerencia { 
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: #e3f2fd;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .full-width { width: 100%; }
    .sin-opciones { 
      color: #f44336; 
      font-style: italic;
      margin-top: 16px;
    }
  `]
})
export class DialogoNoOptimo implements OnInit{
  usuarioSeleccionado: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogoNoOptimo>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('Datos en diálogo:', this.data); // Para debug
    
    // Preseleccionar el usuario sugerido si existe
    if (this.data?.usuarioSugerido) {
      this.usuarioSeleccionado = this.data.usuarioSugerido;
      console.log('Usuario sugerido preseleccionado:', this.usuarioSeleccionado);
    }
    // Si no hay sugerido pero hay alternativos, preseleccionar el primero
    else if (this.data?.usuariosAlternativos?.length > 0) {
      this.usuarioSeleccionado = this.data.usuariosAlternativos[0];
      console.log('Primer alternativo preseleccionado:', this.usuarioSeleccionado);
    }
  }

  asignar() {
    console.log('Asignando usuario:', this.usuarioSeleccionado);
    if (this.usuarioSeleccionado) {
      this.dialogRef.close(this.usuarioSeleccionado);
    }
  }
}
