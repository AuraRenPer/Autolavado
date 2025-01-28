import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getDatabase, ref, set, onValue, push, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private serviciosSubject = new BehaviorSubject<
    Array<{ id: string; cliente: string; vehiculo: string; tipoServicio: string; fechaHora: string; estado: string }>
  >([]);
  servicios$ = this.serviciosSubject.asObservable();

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
      this.cargarServiciosDesdeDatabase();
    } else {
      console.error('Usuario no autenticado. No se puede cargar servicios.');
    }
  }

  private cargarServiciosDesdeDatabase() {
    if (!this.userId) return;

    const serviciosRef = ref(this.database, `users/${this.userId}/servicios`);
    onValue(serviciosRef, (snapshot) => {
      const data = snapshot.val();
      const serviciosArray = data
        ? Object.entries(data).map(([key, value]: [string, any]) => ({
            id: key,
            cliente: value.cliente,
            vehiculo: value.vehiculo,
            tipoServicio: value.tipoServicio,
            fechaHora: value.fechaHora, // Mantener como string (ISO 8601)
            estado: value.estado,
          }))
        : [];
      this.serviciosSubject.next(serviciosArray);
      console.log('Servicios cargados desde la base de datos:', serviciosArray);
    });
  }

  async agregarServicio(servicio: {
    cliente: string;
    vehiculo: string;
    tipoServicio: string;
    fechaHora: string; // ISO 8601
    estado: string;
  }) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const serviciosRef = ref(this.database, `users/${this.userId}/servicios`);
    const newServicioRef = push(serviciosRef);

    await set(newServicioRef, servicio);
    console.log('Servicio agregado:', servicio);
  }

  async actualizarServicio(
    id: string,
    nuevoServicio: {
      cliente: string;
      vehiculo: string;
      tipoServicio: string;
      fechaHora: string; // ISO 8601
      estado: string;
    }
  ) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const servicioRef = ref(this.database, `users/${this.userId}/servicios/${id}`);
    await update(servicioRef, nuevoServicio);
    console.log('Servicio actualizado:', nuevoServicio);
  }

  async eliminarServicio(id: string) {
    if (!this.userId) throw new Error('Usuario no autenticado.');

    const servicioRef = ref(this.database, `users/${this.userId}/servicios/${id}`);
    await remove(servicioRef);
    console.log('Servicio eliminado:', id);
  }
}
