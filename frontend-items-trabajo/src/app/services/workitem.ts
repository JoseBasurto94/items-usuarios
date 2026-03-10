import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AsignacionResponse} from '../models/AsignacionResponse'
import { WorkItem1 } from '../models/WorkItem1';

@Injectable({
  providedIn: 'root',
})
export class WorkitemServive {

  apiUrl = "http://localhost:32770/api/ItemTrabajo";

  constructor(private http: HttpClient) {}

  obtenerItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearItem(item:any){
  return this.http.post(this.apiUrl, item, { responseType: 'text' });
  }

  obtenerItem(id:number){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  completarItem(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {}, { responseType: 'text' as 'json'});
  }

  asignarItem(workItemId: number, usuario: string) {
    return this.http.put<AsignacionResponse>(
      `${this.apiUrl}/${workItemId}/assign`,
      { usuario }
    );
  }

  asignarAutomaticamente(itemId: number): Observable<AsignacionResponse> {
    return this.http.post<AsignacionResponse>(`${this.apiUrl}/${itemId}/asignar-automatico`, {});
  }


  eliminarItem(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  obtenerItemsPendientesPorUsuario(usuario: string): Observable<WorkItem1[]> {
    return this.http.get<WorkItem1[]>(`${this.apiUrl}/usuario/${usuario}/pendientes`);
  }

}
