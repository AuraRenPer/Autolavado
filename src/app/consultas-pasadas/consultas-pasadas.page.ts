import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';  // Importamos el servicio de citas
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';  // Importamos la cámara

@Component({
  selector: 'app-consultas-pasadas',
  templateUrl: './consultas-pasadas.page.html',
  styleUrls: ['./consultas-pasadas.page.scss'],
})
export class ConsultasPasadasPage implements OnInit {

  // Lista de citas que se obtienen desde el servicio
  citasPasadas: Array<{ fechaHora: Date, imagenUrl?: string }> = [];

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    // Obtenemos las citas cuando la página se inicializa
    this.citasService.citas$.subscribe(citas => {
      this.citasPasadas = citas;  // Asignamos las citas al arreglo de citasPasadas
    });
  }

  // Función para abrir la cámara o galería y asociar la imagen con la cita
  async agregarImagen(citaIndex: number) {
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,  // Permite al usuario elegir entre cámara o galería
      resultType: CameraResultType.Uri,  // Solo obtenemos la URI de la imagen
    });

    // Aquí obtenemos la URL de la imagen seleccionada
    const imageUrl = image.webPath;

    // Actualizamos la cita en el servicio con la imagen seleccionada
    const citas = this.citasService.obtenerCitasProximas();  // Obtenemos todas las citas
    citas[citaIndex].imagenUrl = imageUrl;  // Asignamos la nueva imagen a la cita correspondiente
    this.citasService.actualizarCitas(citas);  // Emitimos la nueva lista de citas
  }
}
