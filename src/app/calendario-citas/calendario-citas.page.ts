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
  fechaHoraCita: string = '';  // Variable para almacenar fecha y hora en formato string
  citasProximas: Array<{ fechaHora: Date }> = [];  // Variable para almacenar las citas próximas

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Nos suscribimos al BehaviorSubject para recibir las citas actualizadas
    this.citasService.citas$.subscribe(citas => {
      this.citasProximas = citas;  // Asignamos las citas al array local
      console.log('Citas próximas al cargar:', this.citasProximas);
    });
  }

  agregarCita() {
    if (this.fechaHoraCita) {
      const fecha = new Date(this.fechaHoraCita);  // Convertimos la fecha en objeto Date

      if (fecha && !isNaN(fecha.getTime())) {
        const nuevaCita = { fechaHora: fecha };  // Creamos la nueva cita
        this.citasService.agregarCita(nuevaCita);  // Agregamos la cita usando el servicio
        console.log('Cita agregada:', nuevaCita);
      } else {
        alert('Error al formatear la fecha y hora.');
      }
    } else {
      alert('Por favor, selecciona una fecha y hora para la cita.');
    }
  }
}
