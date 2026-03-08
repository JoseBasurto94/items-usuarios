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
import { AsignarUsuario } from './components/asignar-usuario/asignar-usuario';
import { MatListModule } from '@angular/material/list';
import { NuevoUsuario } from './components/nuevo-usuario/nuevo-usuario';

@NgModule({
  declarations: [
    App,
    Usuarios,
    EditarUsuario,
    ItemsTrabajo,
    WorkitemDialog,
    ConfirmDialog,
    AsignarUsuario,
    NuevoUsuario,
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
    MatListModule
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
