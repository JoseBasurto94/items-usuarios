import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-sugerencia',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensaje }}</p>
      <p>¿Deseas asignarlo al usuario sugerido?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="'usuario_sugerido'">
        Asignar al sugerido
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class DialogoSugerencia {

   constructor(
    public dialogRef: MatDialogRef<DialogoSugerencia>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
