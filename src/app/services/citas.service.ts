import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  // Creamos un BehaviorSubject con un array vacío inicialmente.
  private citasSubject = new BehaviorSubject<Array<{ fechaHora: Date, imagenUrl?: string }>>([]);
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

  // Método para obtener las citas próximas.
  obtenerCitasProximas(): Array<{ fechaHora: Date, imagenUrl?: string }> {
    return this.citasSubject.value;  // Retorna las citas actuales desde el BehaviorSubject.
  }

  // Método para agregar una nueva cita (imagenUrl es opcional).
  agregarCita(cita: { fechaHora: Date, imagenUrl?: string }) {
    const citasActuales = this.citasSubject.value;  // Obtenemos las citas actuales.
    citasActuales.push(cita);  // Agregamos la nueva cita.
    this.citasSubject.next(citasActuales);  // Emitimos la lista actualizada de citas.
    console.log('Cita agregada:', cita);
  }

  // Método para actualizar las citas (después de agregar una imagen).
  actualizarCitas(citas: Array<{ fechaHora: Date, imagenUrl?: string }>) {
    this.citasSubject.next(citas);  // Emitimos la lista actualizada de citas
  }
}
