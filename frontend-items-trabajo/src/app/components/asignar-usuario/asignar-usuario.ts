import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../models/usuario'; 

export interface DialogData {
  usuarios: Usuario[];
  item: any;
}

@Component({
  selector: 'app-asignar-usuario',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Asignar Item</h2>
    
    <mat-dialog-content>
      <p><strong>Item:</strong> {{ data.item.titulo }}</p>
      
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Seleccionar usuario</mat-label>
        <mat-select #selectRef>
          <mat-option *ngFor="let usuario of data.usuarios" [value]="usuario.usuaNombre">
            {{ usuario.usuaNombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button 
        mat-raised-button 
        color="primary"
        [disabled]="!selectRef.value"
        [mat-dialog-close]="selectRef.value">
        Asignar
      </button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class AsignarUsuarioComponent {
 constructor(
    public dialogRef: MatDialogRef<AsignarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}