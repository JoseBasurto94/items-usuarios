import { Component, OnInit } from '@angular/core';
import { Workitem } from '../../services/workitem';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkitemDialog } from '../../components/workitem-dialog/workitem-dialog';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { AsignarUsuario } from '../../components/asignar-usuario/asignar-usuario';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-items-trabajo',
  standalone: false,
  templateUrl: './items-trabajo.html',
  styleUrl: './items-trabajo.css',
})
export class ItemsTrabajo implements OnInit {

usuarios: Usuario[] = [];

items = new MatTableDataSource<any>();
displayedColumns: string[] = [
  'id',
  'titulo',
  'fechaEntrega',
  'relevancia',
  'usuarioAsignado',
  'completado',
  'acciones'
];

  constructor(private workitemService: Workitem,
          private router: Router,
          private cd: ChangeDetectorRef,
          private dialog: MatDialog,
          private usuarioService: UsuarioService
  ){}

  ngOnInit(): void {
    this.cargarItems();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  volverUsuarios(){
  this.router.navigate(['/']);
}

cargarItems() {
  this.workitemService.obtenerItems()
    .subscribe(data => {
      this.items.data = [...data];
      this.cd.detectChanges();
    });
}

nuevoItem() {
  const dialogRef = this.dialog.open(WorkitemDialog, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.workitemService.crearItem(result)
        .subscribe({
          next: () => {
            this.cargarItems();
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Error al crear el WorkItem', err);
            alert('No se pudo crear el WorkItem.');
          }
        });
    }
  });
}

  completar(id:number){

    this.workitemService.completarItem(id)
    .subscribe(()=>{
      this.cargarItems();
      this.cd.detectChanges();
    });

  }

autoAsignar(workItem: any) {
  const dialogRef = this.dialog.open(AsignarUsuario, {
    width: '400px',
    data: { usuarios: this.usuarios }
  });

  dialogRef.afterClosed().subscribe(usuarioSeleccionado => {
    if (!usuarioSeleccionado) return;

    this.workitemService.asignarItem(workItem.id, usuarioSeleccionado)
      .subscribe({
        next: (res: any) => {
          console.log('Asignación completada:', res);
          this.cargarItems();
        },
        error: (err) => {
          console.error('Error al asignar el usuario', err);
        }
      });
  });
}

eliminarItem(id: number) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '350px',
    data: { mensaje: '¿Desea eliminar este WorkItem?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.workitemService.eliminarItem(id)
        .subscribe({
          next: (res) => {
            this.cargarItems();
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Error al eliminar el item', err);
          }
        });
    }
  });
}

finalizarItem(id: number) {
  this.workitemService.completarItem(id)
    .subscribe({
      next: (res: any) => {
        const index = this.items.data.findIndex(i => i.id === id);
        if (index > -1) {
          this.items.data[index].completado = true;
          this.items.data = [...this.items.data]; // refresca la tabla
          
          // 🔹 forzar actualización en el próximo ciclo para evitar NG0100
          setTimeout(() => this.cd.detectChanges());
        }
      },
      error: (err) => console.error('Error al finalizar:', err)
    });
}

}
