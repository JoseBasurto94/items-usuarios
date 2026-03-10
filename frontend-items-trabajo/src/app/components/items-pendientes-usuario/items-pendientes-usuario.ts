import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkItem1 } from '../../models/WorkItem1';

@Component({
  selector: 'app-items-pendientes-usuario',
  standalone: false,
  templateUrl: './items-pendientes-usuario.html',
  styleUrl: './items-pendientes-usuario.css',
})
export class ItemsPendientesUsuario {

  constructor(
    public dialogRef: MatDialogRef<ItemsPendientesUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: {
      usuario: string;
      items: WorkItem1[];
    }
  ) {}

  get totalItems(): number {
    return this.data.items.length;
  }

  get itemsAlta(): number {
    return this.data.items.filter(i => i.relevancia?.toLowerCase() === 'alta').length;
  }

  get itemsMedia(): number {
    return this.data.items.filter(i => i.relevancia?.toLowerCase() === 'media').length;
  }

  get itemsBaja(): number {
    return this.data.items.filter(i => i.relevancia?.toLowerCase() === 'baja').length;
  }

  getUrgencia(item: WorkItem1): string {
    if (item.diasParaEntrega < 0) return 'VENCIDO';
    if (item.diasParaEntrega === 0) return 'HOY';
    if (item.diasParaEntrega <= 2) return 'URGENTE';
    return 'PROGRAMADO';
  }

  getUrgenciaIcon(item: WorkItem1): string {
    if (item.diasParaEntrega < 0) return 'error';
    if (item.diasParaEntrega === 0) return 'today';
    if (item.diasParaEntrega <= 2) return 'warning';
    return 'event';
  }

  getUrgenciaColor(item: WorkItem1): string {
    if (item.diasParaEntrega < 0) return 'warn';
    if (item.diasParaEntrega === 0) return 'accent';
    if (item.diasParaEntrega <= 2) return 'primary';
    return '';
  }

  getRelevanciaIcon(item: WorkItem1): string {
    switch (item.relevancia?.toLowerCase()) {
      case 'alta': return 'priority_high';
      case 'media': return 'remove';
      case 'baja': return 'arrow_downward';
      default: return 'task';
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
