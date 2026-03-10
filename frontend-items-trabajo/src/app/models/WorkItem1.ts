export interface WorkItem1 {
  id: number;
  titulo: string;
  fechaEntrega: string | null;
  relevancia: string;
  usuarioAsignado: string | null;
  completado: boolean | null;
  diasParaEntrega: number;
  prioridad: number;
  estadoPrioridad: string;
}