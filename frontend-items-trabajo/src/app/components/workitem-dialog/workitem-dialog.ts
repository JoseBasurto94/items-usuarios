import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-workitem-dialog',
  standalone: false,
  templateUrl: './workitem-dialog.html',
  styleUrl: './workitem-dialog.css',
})
export class WorkitemDialog {

  item = {
    titulo: '',
    fechaEntrega: '',
    relevancia: 'MEDIA',
    usuarioAsignado: '',
    completado: false
  };

  constructor(private dialogRef: MatDialogRef<WorkitemDialog>) {}

  guardar(){
    this.dialogRef.close(this.item);
  }

}
