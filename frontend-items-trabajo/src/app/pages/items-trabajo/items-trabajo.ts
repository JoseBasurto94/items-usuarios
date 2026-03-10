import { Component, OnInit } from '@angular/core';
import { WorkitemServive } from '../../services/workitem';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkitemDialog } from '../../components/workitem-dialog/workitem-dialog';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { AsignarUsuarioComponent } from '../../components/asignar-usuario/asignar-usuario';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { DialogoSugerencia } from '../../components/dialogo-sugerencia/dialogo-sugerencia';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsignacionResponse } from '../../models/AsignacionResponse';
import { ErrorAsignacion } from '../../models/ErrorAsignacion';
import { ConfirmarAsignacion } from '../../components/confirmar-asignacion/confirmar-asignacion';
import { DialogoSaturacion } from '../../components/dialogo-saturacion/dialogo-saturacion';
import { DialogoNoOptimo } from '../../components/dialogo-no-optimo/dialogo-no-optimo';
import { DialogoResultadoAsignacion } from '../../components/dialogo-resultado-asignacion/dialogo-resultado-asignacion';
import { ConfirmarAsignacionAutomatica } from '../../components/confirmar-asignacion-automatica/confirmar-asignacion-automatica';

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

  constructor(private workitemService: WorkitemServive,
          private router: Router,
          private cd: ChangeDetectorRef,
          private dialog: MatDialog,
          private usuarioService: UsuarioService,
          private snackBar: MatSnackBar
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
          this.items.data = [...this.items.data]; 
          
          setTimeout(() => this.cd.detectChanges());
        }
      },
      error: (err) => console.error('Error al finalizar:', err)
    });
}

  // Método principal para asignar item (desde botón "Asignar")
  abrirDialogoAsignacion(item: any) {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      const dialogRef = this.dialog.open(AsignarUsuarioComponent, {
        width: '450px',
        data: {
          usuarios: usuarios,
          item: item
        }
      });
      dialogRef.afterClosed().subscribe((usuarioSeleccionado: string) => {
        if (!usuarioSeleccionado) return;
        this.intentarAsignacion(item.id, usuarioSeleccionado);
      });
    });
  }

  // Método para intentar la asignación
  private intentarAsignacion(itemId: number, usuario: string) {
    this.workitemService.asignarItem(itemId, usuario).subscribe({
      next: (response) => {
        // Asignación exitosa
        this.snackBar.open(response.mensaje, 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.cargarItems();
      },
      error: (error) => {
        this.manejarErrorAsignacion(error.error, itemId);
      }
    });
  }

  // Manejar los diferentes tipos de error
private manejarErrorAsignacion(error: ErrorAsignacion, itemId: number) {
  console.log('Error de asignación:', error);

  switch (error.codigo) {
    case 'USUARIO_SATURADO':
      this.mostrarDialogoSaturacion(itemId, error);
      break;

    case 'USUARIO_NO_OPTIMO':
    case 'REGLA_NEGOCIO': // Por si el backend usa este código
      this.mostrarDialogoNoOptimo(itemId, error);
      break;

    default:
      this.snackBar.open(error.mensaje || 'Error al asignar el item', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
  }
}

  // // Caso 1: Usuario saturado (3+ items relevantes)
  private mostrarDialogoSaturacion(itemId: number, error: ErrorAsignacion) {
    const dialogRef = this.dialog.open(DialogoSaturacion, {
      width: '500px',
      data: {
        tipo: 'saturacion',
        titulo: '⚠️ Usuario Saturado',
        mensaje: error.mensaje,
        usuarioSugerido: error.usuarioSugerido,
        usuariosAlternativos: error.usuariosAlternativos,
        itemsRelevantes: error.itemsAltamenteRelevantes
      }
    });

    dialogRef.afterClosed().subscribe((accion: string) => {
      if (accion === 'asignar_sugerido' && error.usuarioSugerido) {
        // Reintentar con el usuario sugerido
        this.intentarAsignacion(itemId, error.usuarioSugerido);
      } 
      else if (accion === 'ver_todos') {
        // Abrir selector con usuarios alternativos
        this.abrirSelectorUsuariosAlternativos(itemId, error.usuariosAlternativos || []);
      }
    });
  }

  // // Caso 2: Usuario no óptimo (por reglas de fecha/relevancia)
private mostrarDialogoNoOptimo(itemId: number, error: ErrorAsignacion) {
    console.log('Error recibido en mostrarDialogoNoOptimo:', error);
  
  const dialogRef = this.dialog.open(DialogoNoOptimo, {
    width: '500px',
    data: {
      mensaje: error.mensaje,
      usuarioSugerido: error.usuarioSugerido,
      usuariosAlternativos: error.usuariosAlternativos
    }
  });

  dialogRef.afterClosed().subscribe((usuario: string) => {
    console.log('Diálogo cerrado con usuario:', usuario);
    
    if (usuario) {
      console.log('Reintentando asignación con:', usuario);
      this.intentarAsignacion(itemId, usuario);
    } else {
      console.log('Usuario canceló la operación');
    }
  });
}

  // // Abrir selector con usuarios alternativos pre-filtrados
  private abrirSelectorUsuariosAlternativos(itemId: number, usuariosPermitidos: string[]) {
    this.usuarioService.getUsuarios().subscribe(todosUsuarios => {
      // Filtrar solo los usuarios permitidos
      const usuariosFiltrados = todosUsuarios.filter(u => 
        usuariosPermitidos.includes(u.usuaNombre)
      );

      const dialogRef = this.dialog.open(AsignarUsuarioComponent, {
        width: '450px',
        data: {
          usuarios: usuariosFiltrados,
          item: { id: itemId },
          titulo: 'Seleccionar usuario alternativo'
        }
      });

      dialogRef.afterClosed().subscribe((usuario: string) => {
        if (usuario) {
          this.intentarAsignacion(itemId, usuario);
        }
      });
    });
  }

asignarAutomaticamente(item: any) {
  console.log('1. Botón clickeado - Item:', item);
  
  const dialogRef = this.dialog.open(ConfirmarAsignacionAutomatica, {
    width: '450px',
    data: {
      item: item
    }
  });

  dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    console.log('2. Diálogo cerrado - confirmado:', confirmado);
    
    if (confirmado) {
      console.log('3. Usuario confirmó, ejecutando asignación para item:', item.id);
      this.ejecutarAsignacionAutomatica(item.id);
    } else {
      console.log('3. Usuario canceló');
    }
  });
}

private ejecutarAsignacionAutomatica(itemId: number) {
  this.workitemService.asignarAutomaticamente(itemId).subscribe({
    next: (response: any) => {
      console.log('Respuesta de asignación automática:', response);
      
      // Mostrar diálogo con el resultado
      this.dialog.open(DialogoResultadoAsignacion, {
        width: '500px',
        data: {
          titulo: '✅ Asignación Exitosa',
          mensaje: response.mensaje,
          asignacion: response.data
        }
      });
      
      // También mostrar un snackBar de notificación
      this.snackBar.open(
        response.mensaje || 'Item asignado automáticamente', 
        'Cerrar', 
        { duration: 5000, panelClass: ['success-snackbar'] }
      );
      
      // Recargar la lista
      this.cargarItems();
    },
    error: (error) => {
      console.error('Error en asignación automática:', error);
      
      const errorData = error.error;
      
      // Abrir diálogo de error
      this.dialog.open(DialogoResultadoAsignacion, {
        width: '450px',
        data: {
          titulo: '❌ Error en Asignación',
          mensaje: errorData?.mensaje || 'No se pudo asignar automáticamente',
          codigo: errorData?.codigo,
          esError: true
        }
      });
      
      // También mostrar snackBar de error
      this.snackBar.open(
        errorData?.mensaje || 'Error al asignar automáticamente', 
        'Cerrar', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
    }
  });
}

}
