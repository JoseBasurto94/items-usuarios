import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-editar-usuario',
  standalone: false,
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario {

usuario: any;

  constructor(
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<EditarUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.usuario = { ...data };
  }

  guardar() {

    this.usuarioService.actualizarUsuario(this.usuario.usuaId, this.usuario)
      .subscribe(() => {
        this.dialogRef.close(true);
      });

  }

  cerrar() {
    this.dialogRef.close();
  }

}
