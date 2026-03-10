import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HttpClientModule } from '@angular/common/http';

import { Usuarios } from './pages/usuarios/usuarios';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EditarUsuario } from './usuarios/editar-usuario/editar-usuario';
import { ItemsTrabajo } from './pages/items-trabajo/items-trabajo';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkitemDialog } from './components/workitem-dialog/workitem-dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AsignarUsuarioComponent } from './components/asignar-usuario/asignar-usuario';
import { MatListModule } from '@angular/material/list';
import { NuevoUsuario } from './components/nuevo-usuario/nuevo-usuario';
import { DialogoSugerencia } from './components/dialogo-sugerencia/dialogo-sugerencia';
import { ConfirmarAsignacion } from './components/confirmar-asignacion/confirmar-asignacion';
import { DialogoSaturacion } from './components/dialogo-saturacion/dialogo-saturacion';
import { DialogoNoOptimo } from './components/dialogo-no-optimo/dialogo-no-optimo';
import { ConfirmarAsignacionAutomatica } from './components/confirmar-asignacion-automatica/confirmar-asignacion-automatica';
import { DialogoResultadoAsignacion } from './components/dialogo-resultado-asignacion/dialogo-resultado-asignacion';
import { ItemsPendientesUsuario } from './components/items-pendientes-usuario/items-pendientes-usuario';
import { MatExpansionModule } from '@angular/material/expansion'; // <-- Agregar esta importación

@NgModule({
  declarations: [
    App,
    Usuarios,
    EditarUsuario,
    ItemsTrabajo,
    WorkitemDialog,
    ConfirmDialog,
    AsignarUsuarioComponent,
    NuevoUsuario,
    DialogoSugerencia,
    ConfirmarAsignacion,
    DialogoSaturacion,
    DialogoNoOptimo,
    ConfirmarAsignacionAutomatica,
    DialogoResultadoAsignacion,
    ItemsPendientesUsuario
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
