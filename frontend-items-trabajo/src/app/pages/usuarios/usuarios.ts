import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarUsuario } from '../../usuarios/editar-usuario/editar-usuario';
import { Router } from '@angular/router';
import { NuevoUsuario } from '../../components/nuevo-usuario/nuevo-usuario';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { WorkitemServive } from '../../services/workitem';
import { ItemsPendientesUsuario } from '../../components/items-pendientes-usuario/items-pendientes-usuario';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit{

  usuarios: Usuario[] = [];

  displayedColumns: string[] = ['id', 'nombre', 'acciones'];

  constructor(private usuarioService: UsuarioService, 
    private workItemService: WorkitemServive,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
  private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

irWorkItems(){
  this.router.navigate(['/workitems']);
}

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      this.cd.detectChanges();
    });
  }

  editar(usuario: any) {

  const dialogRef = this.dialog.open(EditarUsuario, {
    width: '400px',
    data: usuario
  });

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
      this.cargarUsuarios();
    }

  });

  }

eliminar(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '350px',
    data: { mensaje: '¿Desea eliminar este usuario?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.usuarioService.eliminarUsuario(id)
        .subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cd.detectChanges();
          },
          error: (err) => console.error('Error al eliminar usuario:', err)
        });
    }
  });
}

nuevoUsuario() {
  const dialogRef = this.dialog.open(NuevoUsuario, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(nombre => {
    if(nombre){
      const usuario = { usuaNombre: nombre };
      this.usuarioService.crearUsuario(usuario)
        .subscribe(() => {
          this.cargarUsuarios();
        });
    }
  });
}

verItemsPendientes(usuario: Usuario) {
  this.workItemService.obtenerItemsPendientesPorUsuario(usuario.usuaNombre).subscribe({
    next: (items) => {
      this.dialog.open(ItemsPendientesUsuario, {
        width: '800px',
        maxWidth: '95vw',
        data: {
          usuario: usuario.usuaNombre,
          items: items
        }
      });
    },
    error: (error) => {
      // console.error('Error:', error);
      // this.snackBar.open('Error al cargar items pendientes', 'Cerrar', { duration: 3000 });
    }
  });
}

}
