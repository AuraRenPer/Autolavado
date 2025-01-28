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
  };

  // Listado de servicios próximos
  serviciosProximos: Array<{
    id: string;
    cliente: string;
    vehiculo: string;
    tipoServicio: string;
    fechaHora: string;
    estado: string;
  }> = [];

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit() {
    // Suscribirse al Observable para recibir servicios en tiempo real
    this.serviciosService.servicios$.subscribe((servicios) => {
      this.serviciosProximos = servicios;
      console.log('Servicios próximos al cargar:', this.serviciosProximos);
    });
  }

  agregarServicio() {
    // Validar campos
    if (
      this.servicio.cliente.trim() &&
      this.servicio.vehiculo.trim() &&
      this.servicio.tipoServicio.trim() &&
      this.servicio.fechaHora.trim()
    ) {
      const fecha = new Date(this.servicio.fechaHora); // Convertir a objeto Date

      if (fecha && !isNaN(fecha.getTime())) {
        // Crear el nuevo servicio
        const nuevoServicio = {
          ...this.servicio,
          fechaHora: fecha.toISOString(), // Guardar como cadena ISO
          estado: 'pendiente', // Estado inicial del servicio
        };

        // Agregar el servicio a Firebase
        this.serviciosService
          .agregarServicio(nuevoServicio)
          .then(() => {
            console.log('Servicio agregado exitosamente:', nuevoServicio);
            alert('Servicio agregado exitosamente.');
            this.limpiarFormulario(); // Limpiar el formulario después de guardar
          })
          .catch((error) => {
            console.error('Error al agregar servicio:', error);
            alert('Hubo un error al agregar el servicio. Por favor, inténtalo de nuevo.');
          });
      } else {
        alert('Por favor, selecciona una fecha y hora válida.');
      }
    } else {
      alert('Todos los campos son obligatorios. Por favor, complétalos antes de continuar.');
    }
  }

  eliminarServicio(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.serviciosService
        .eliminarServicio(id)
        .then(() => {
          console.log('Servicio eliminado:', id);
          alert('Servicio eliminado exitosamente.');
        })
        .catch((error) => {
          console.error('Error al eliminar servicio:', error);
          alert('Hubo un error al eliminar el servicio. Por favor, inténtalo de nuevo.');
        });
    }
  }

  limpiarFormulario() {
    this.servicio = {
      cliente: '',
      vehiculo: '',
      tipoServicio: '',
      fechaHora: '',
    };
  }
}
