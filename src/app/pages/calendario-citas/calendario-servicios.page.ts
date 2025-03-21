import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-calendario-servicios',
  templateUrl: './calendario-servicios.page.html',
  styleUrls: ['./calendario-servicios.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioServiciosPage implements OnInit {
  // Datos del nuevo servicio a agregar
  servicio = {
    cliente: '',
    vehiculo: '',
    tipoServicio: '',
    fechaHora: '',
    autolavado: '',
  };

  serviciosProximos: Array<any> = [];
  serviciosPasados: Array<any> = [];

  constructor(private serviciosService: ServiciosService) { }

  async ngOnInit() {
    await this.cargarServicios();
  
    const seleccionado = localStorage.getItem('autolavadoSeleccionado');
    if (seleccionado) {
      const lugar = JSON.parse(seleccionado);
      this.servicio.autolavado = lugar.name;
      localStorage.removeItem('autolavadoSeleccionado');
    }
  }
  


  async cargarServicios() {
    try {
      const servicios = (await this.serviciosService.obtenerServicios().toPromise()) || []; // ✅ Asegurar que `servicios` nunca sea undefined

      const ahora = new Date();
      this.serviciosPasados = servicios.filter(
        (servicio) => servicio && servicio.fechaHora && new Date(servicio.fechaHora) < ahora
      );
      this.serviciosProximos = servicios.filter(
        (servicio) => servicio && servicio.fechaHora && new Date(servicio.fechaHora) >= ahora
      );

      console.log('✅ Servicios cargados correctamente:', {
        serviciosPasados: this.serviciosPasados,
        serviciosProximos: this.serviciosProximos,
      });
    } catch (error) {
      console.error('❌ Error al obtener servicios:', error);
      this.serviciosPasados = [];
      this.serviciosProximos = []; // ✅ En caso de error, asignar arrays vacíos para evitar más errores
    }
  }


  async agregarServicio() {
    if (
      this.servicio.cliente.trim() &&
      this.servicio.vehiculo.trim() &&
      this.servicio.tipoServicio.trim() &&
      this.servicio.fechaHora.trim()
    ) {
      const fecha = new Date(this.servicio.fechaHora);

      if (fecha && !isNaN(fecha.getTime())) {
        const nuevoServicio = {
          ...this.servicio,
          fechaHora: fecha.toISOString(), // Convertir a formato ISO
          estado: 'pendiente',
        };

        try {
          await this.serviciosService.agregarServicio(nuevoServicio);
          console.log('✅ Servicio agregado:', nuevoServicio);
          alert('Servicio agregado exitosamente.');
          this.limpiarFormulario();
          await this.cargarServicios(); // Recargar servicios
        } catch (error) {
          console.error('❌ Error al agregar servicio:', error);
        }
      } else {
        alert('Por favor, selecciona una fecha y hora válida.');
      }
    } else {
      alert('Todos los campos son obligatorios.');
    }
  }

  async eliminarServicio(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await this.serviciosService.eliminarServicio(id);
        console.log('✅ Servicio eliminado:', id);
        alert('Servicio eliminado exitosamente.');
        await this.cargarServicios(); // Recargar servicios
      } catch (error) {
        console.error('❌ Error al eliminar servicio:', error);
      }
    }
  }

  limpiarFormulario() {
    this.servicio = {
      cliente: '',
      vehiculo: '',
      tipoServicio: '',
      fechaHora: '',
      autolavado: ''
    };
  }
}
