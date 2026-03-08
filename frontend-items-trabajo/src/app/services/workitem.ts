import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Workitem {

  apiUrl = "http://localhost:32771/api/ItemTrabajo";

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
    return this.http.put(
      `${this.apiUrl}/${workItemId}/assign`,
      { usuario },
      { responseType: 'text' as 'json' }
    );
  }

  eliminarItem(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

}
