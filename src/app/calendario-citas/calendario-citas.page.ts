import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-calendario-citas',
  templateUrl: './calendario-citas.page.html',
  styleUrls: ['./calendario-citas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Usar OnPush si aplica
})
export class CalendarioCitasPage implements OnInit {
  fechaHoraCita: string = ''; // Variable para almacenar fecha y hora en formato string
  citasProximas: Array<{ fechaHora: Date; imagenUrl?: string }> = []; // Variable para almacenar las citas próximas

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Nos suscribimos al BehaviorSubject para recibir las citas actualizadas
    this.citasService.citas$.subscribe((citas) => {
      this.citasProximas = citas; // Actualizamos el array local
      console.log('Citas próximas al cargar:', this.citasProximas);
    });
  }

  agregarCita() {
    if (this.fechaHoraCita) {
      console.log('Fecha ingresada:', this.fechaHoraCita); // Verificar el valor ingresado
      const fecha = new Date(this.fechaHoraCita); // Convertimos la fecha en objeto Date

      if (fecha && !isNaN(fecha.getTime())) {
        const nuevaCita = { fechaHora: fecha }; // Creamos la nueva cita
        this.citasService.agregarCita(nuevaCita); // Agregamos la cita al servicio
        console.log('Cita agregada:', nuevaCita);

        // Mensaje de confirmación y limpieza del input
        alert('Cita agregada exitosamente.');
        this.fechaHoraCita = ''; // Limpiamos el campo después de agregar
      } else {
        console.error('Formato de fecha inválido:', this.fechaHoraCita);
        alert('Error al formatear la fecha y hora.');
      }
    } else {
      alert('Por favor, selecciona una fecha y hora para la cita.');
    }
  }
}
