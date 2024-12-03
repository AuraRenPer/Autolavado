import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getDatabase, ref, set, onValue, push, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private citasSubject = new BehaviorSubject<Array<{ id: string; fechaHora: Date; imagenUrl?: string }>>([]);
  citas$ = this.citasSubject.asObservable();

  private database = getDatabase();
  private auth = getAuth();
  private userId: string | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.userId = currentUser.uid;
      this.cargarCitasDesdeDatabase();
    } else {
      console.error('Usuario no autenticado. No se puede cargar citas.');
    }
  }

  private cargarCitasDesdeDatabase() {
    if (!this.userId) return;

    const citasRef = ref(this.database, `users/${this.userId}/citas`);
    onValue(citasRef, (snapshot) => {
      const data = snapshot.val();
      const citasArray = data
        ? Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            fechaHora: new Date(value.fechaHora), // Reconstruir la fecha como objeto Date
            imagenUrl: value.imagenUrl,
          }))
        : [];
      this.citasSubject.next(citasArray);
      console.log('Citas cargadas desde la base de datos:', citasArray);
    });
  }

  obtenerCitasProximas(): Array<{ id: string; fechaHora: Date; imagenUrl?: string }> {
    return this.citasSubject.value.map((cita) => ({
      ...cita,
      fechaHora: new Date(cita.fechaHora),
    }));
  }

  async agregarCita(cita: { fechaHora: Date; imagenUrl?: string }) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const citasRef = ref(this.database, `users/${this.userId}/citas`);
    const newCitaRef = push(citasRef);

    // Convertir la fecha a formato ISO antes de guardarla
    const citaConFechaISO = {
      ...cita,
      fechaHora: cita.fechaHora.toISOString(),
    };

    await set(newCitaRef, citaConFechaISO);
    console.log('Cita agregada:', citaConFechaISO);
  }

  async actualizarCita(id: string, nuevaCita: { fechaHora: Date; imagenUrl?: string }) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const citaRef = ref(this.database, `users/${this.userId}/citas/${id}`);
    const citaActualizada = {
      ...nuevaCita,
      fechaHora: nuevaCita.fechaHora.toISOString(), // Convertir a ISO
    };

    await update(citaRef, citaActualizada);
    console.log('Cita actualizada:', citaActualizada);
  }

  async eliminarCita(id: string) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const citaRef = ref(this.database, `users/${this.userId}/citas/${id}`);
    await remove(citaRef);
    console.log('Cita eliminada:', id);
  }
}
