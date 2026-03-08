import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-asignar-usuario',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Asignar Responsable</h2>
    <mat-dialog-content>
      <p>Seleccione un usuario para el WorkItem:</p>
      <mat-list>
        <mat-list-item *ngFor="let usuario of data.usuarios" (click)="seleccionarUsuario(usuario)">
          {{ usuario.usuaNombre }}
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-list-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    mat-list-item:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class AsignarUsuario {

  constructor(
    public dialogRef: MatDialogRef<AsignarUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: { usuarios: any[] }
  ) {}

  seleccionarUsuario(usuario: any) {
    this.dialogRef.close(usuario.usuaNombre);
  }
}