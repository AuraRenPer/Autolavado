import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.page.html',
  styleUrls: ['./panel-control.page.scss'],
})
export class PanelControlPage implements OnInit {
  citasProximas: Array<{ fechaHora: Date }> = [];  // Variable para almacenar las citas próximas

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Inicializa las citas al cargar la página
    this.cargarCitas();
  }

  cargarCitas() {
    // Carga las citas próximas desde el servicio
    this.citasProximas = this.citasService.obtenerCitasProximas();
    console.log('Citas próximas al cargar:', this.citasProximas);
  }
}