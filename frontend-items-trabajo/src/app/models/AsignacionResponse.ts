import { WorkItem1 } from "./WorkItem1";

export interface AsignacionResponse {
  success: boolean;
  mensaje: string;
  data?: WorkItem1;
  codigo?: string;
}