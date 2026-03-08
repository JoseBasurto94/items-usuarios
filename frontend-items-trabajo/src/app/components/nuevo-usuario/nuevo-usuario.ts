import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: false,
    template: `
    <h2 mat-dialog-title>Nuevo Usuario</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Nombre del usuario</mat-label>
        <input matInput [(ngModel)]="nombre" (input)="nombre = nombre.toUpperCase()" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    input {
      text-transform: uppercase; /* Visualmente en mayúsculas */
    }
  `]
})
export class NuevoUsuario {

nombre: string = '';

  constructor(public dialogRef: MatDialogRef<NuevoUsuario>) {}

  guardar() {
    if(this.nombre.trim()){
      this.dialogRef.close(this.nombre.trim());
    }
  }

}
