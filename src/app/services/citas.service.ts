import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // Creamos un BehaviorSubject con un array vacío inicialmente.
  private citasSubject = new BehaviorSubject<Array<{ fechaHora: Date }>>([]);
  citas$ = this.citasSubject.asObservable();  // Exponemos el observable de citas.

  constructor() {
    // Inicializa con datos simulados (puedes obtenerlos de una API o base de datos).
    const citasIniciales = [
      { fechaHora: new Date('2024-11-13T21:32:00.000Z') },
      { fechaHora: new Date('2024-11-12T21:38:00.000Z') },
      { fechaHora: new Date('2024-11-13T21:44:00.000Z') }
    ];
    this.citasSubject.next(citasIniciales);  // Emitimos las citas iniciales.
  }

  // Método para obtener las citas próximas (puedes agregar lógica adicional aquí).
  obtenerCitasProximas(): Array<{ fechaHora: Date }> {
    return this.citasSubject.value;  // Retorna las citas actuales desde el BehaviorSubject.
  }

  // Método para agregar una nueva cita.
  agregarCita(cita: { fechaHora: Date }) {
    const citasActuales = this.citasSubject.value;  // Obtenemos las citas actuales.
    citasActuales.push(cita);  // Agregamos la nueva cita.
    this.citasSubject.next(citasActuales);  // Emitimos la lista actualizada de citas.
    console.log('Cita agregada:', cita);
  }
}
