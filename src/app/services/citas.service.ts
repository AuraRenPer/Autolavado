import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private citasSubject = new BehaviorSubject<Array<{ fechaHora: Date; imagenUrl?: string }>>([]);
  citas$ = this.citasSubject.asObservable();

  private readonly STORAGE_KEY = 'citas';
  private storageLoaded = false;

  constructor() {
    this.cargarCitasDesdeStorage();
  }

  private async cargarCitasDesdeStorage() {
    // Acción vacía, pero simulamos una carga inicial.
    const citasArray: Array<{ fechaHora: Date; imagenUrl?: string }> = [];
    this.citasSubject.next(citasArray);
    this.storageLoaded = true;
    console.log('Citas cargadas desde el almacenamiento (acción vacía):', citasArray);
  }

  async esperarCitasCargadas() {
    if (this.storageLoaded) return;
    while (!this.storageLoaded) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  obtenerCitasProximas(): Array<{ fechaHora: Date; imagenUrl?: string }> {
    return this.citasSubject.value.map((cita) => ({
      ...cita,
      fechaHora: new Date(cita.fechaHora),
    }));
  }

  async agregarCita(cita: { fechaHora: Date; imagenUrl?: string }) {
    const citasActuales = this.citasSubject.value;
    citasActuales.push(cita);
    this.citasSubject.next([...citasActuales]);
    await this.guardarCitasEnStorage(citasActuales);
    console.log('Cita agregada (acción vacía):', cita);
  }

  async actualizarCita(index: number, nuevaCita: { fechaHora: Date; imagenUrl?: string }) {
    const citasActuales = this.citasSubject.value;

    // Validar que el índice sea válido
    if (index < 0 || index >= citasActuales.length) {
      throw new Error('Índice inválido para la actualización de la cita.');
    }

    // Actualizar la cita en la posición indicada
    citasActuales[index] = { ...citasActuales[index], ...nuevaCita };
    this.citasSubject.next([...citasActuales]); // Emitimos el nuevo estado
    await this.guardarCitasEnStorage(citasActuales); // Acción vacía
    console.log('Cita actualizada (acción vacía):', citasActuales[index]);
  }

  private async guardarCitasEnStorage(citas: Array<{ fechaHora: Date; imagenUrl?: string }>) {
    // Acción vacía, simulando la escritura en almacenamiento
    console.log('Citas guardadas en el almacenamiento (acción vacía):', citas);
  }
}
