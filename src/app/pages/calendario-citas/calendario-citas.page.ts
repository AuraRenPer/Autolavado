import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-calendario-citas',
  templateUrl: './calendario-citas.page.html',
  styleUrls: ['./calendario-citas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioCitasPage implements OnInit {
  fechaHoraCita: string = ''; // Variable para almacenar fecha y hora en formato string
  citasProximas: Array<{ id: string; fechaHora: Date; imagenUrl?: string }> = [];

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Suscribirse al Observable para recibir citas en tiempo real
    this.citasService.citas$.subscribe((citas) => {
      this.citasProximas = citas; // Actualizamos el estado local
      console.log('Citas próximas al cargar:', this.citasProximas);
    });
  }

  agregarCita() {
    if (this.fechaHoraCita) {
      console.log('Fecha ingresada:', this.fechaHoraCita);
      const fecha = new Date(this.fechaHoraCita); // Convertir a objeto Date

      if (fecha && !isNaN(fecha.getTime())) {
        const nuevaCita = { fechaHora: fecha, imagenUrl: '' }; // Crear nueva cita
        this.citasService.agregarCita(nuevaCita)
          .then(() => {
            console.log('Cita agregada exitosamente:', nuevaCita);
            alert('Cita agregada exitosamente.');
            this.fechaHoraCita = ''; // Limpiar el campo
          })
          .catch((error) => {
            console.error('Error al agregar cita:', error);
            alert('Hubo un error al agregar la cita. Por favor, inténtalo de nuevo.');
          });
      } else {
        alert('Error al formatear la fecha y hora.');
      }
    } else {
      alert('Por favor, selecciona una fecha y hora para la cita.');
    }
  }

  eliminarCita(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.citasService.eliminarCita(id)
        .then(() => {
          console.log('Cita eliminada:', id);
          alert('Cita eliminada exitosamente.');
        })
        .catch((error) => {
          console.error('Error al eliminar cita:', error);
          alert('Hubo un error al eliminar la cita. Por favor, inténtalo de nuevo.');
        });
    }
  }
}
