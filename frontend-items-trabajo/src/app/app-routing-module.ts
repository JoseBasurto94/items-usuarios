import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Usuarios } from './pages/usuarios/usuarios';
import { ItemsTrabajo } from './pages/items-trabajo/items-trabajo';

const routes: Routes = [
  { path: '', component: Usuarios },
  { path: 'workitems', component: ItemsTrabajo }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
