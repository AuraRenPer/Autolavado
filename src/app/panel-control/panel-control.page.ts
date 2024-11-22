import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.page.html',
  styleUrls: ['./panel-control.page.scss'],
})
export class PanelControlPage implements OnInit {
  citasProximas: Array<{ fechaHora: Date; imagenUrl?: string }> = [];

  constructor(private citasService: CitasService) {}

  async ngOnInit() {
    await this.citasService.esperarCitasCargadas(); // Esperar a que se carguen las citas
    this.cargarCitas();
  }

  cargarCitas() {
    const ahora = new Date();
    const todasLasCitas = this.citasService.obtenerCitasProximas();

    console.log('Citas obtenidas antes de filtrar:', todasLasCitas);

    this.citasProximas = todasLasCitas
      .map((cita) => ({
        ...cita,
        fechaHora: new Date(cita.fechaHora),
      }))
      .filter((cita) => cita.fechaHora > ahora);

    console.log('Citas próximas después de la fecha actual:', this.citasProximas);
  }
}
