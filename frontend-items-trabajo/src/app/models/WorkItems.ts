export interface WorkItems {
  id: number;
  titulo: string;
  fechaEntrega: Date;
  relevancia: string;
  usuarioAsignado: string;
  completado: boolean;
}