import { Component } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.scss'],
})
export class VideoRecorderComponent {
  videoPath: string | null = null;

  constructor(
    private modalController: ModalController,
    private mediaCapture: MediaCapture,
    private platform: Platform
  ) {}  

  async recordVideo() {
    if (!this.platform.is('cordova')) {
      alert('La grabación de video solo está disponible en dispositivos móviles.');
      return;
    }
  
    const options: CaptureVideoOptions = { limit: 1, duration: 60 };
    try {
      const mediaFiles = await this.mediaCapture.captureVideo(options);
      if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
        this.videoPath = mediaFiles[0].fullPath || null;
      } else {
        alert('No se grabó ningún video.');
      }
    } catch (error) {
      console.error('Error al grabar video:', error);
      alert('Ocurrió un error al intentar grabar el video.');
    }
  }
  
  async shareVideo() {
    if (!this.videoPath) {
      alert('No hay video para compartir.');
      return;
    }

    try {
      const fileName = `shared_video_${new Date().getTime()}.mp4`;
      const videoData = await Filesystem.readFile({
        path: this.videoPath,
      });

      // Escribe el archivo en el directorio Cache para compartir
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: videoData.data,
        directory: Directory.Cache,
      });

      // Comparte el archivo desde el directorio Cache
      await Share.share({
        title: 'Mira este video',
        text: 'Acabo de grabar este video.',
        url: savedFile.uri,
        dialogTitle: 'Compartir video',
      });
    } catch (error) {
      console.error('Error al compartir el video:', error);
      alert('No se pudo compartir el video.');
    }
  }

  async saveToGallery() {
    if (!this.videoPath) {
      alert('No hay video para guardar.');
      return;
    }

    try {
      const response = await Filesystem.readFile({
        path: this.videoPath,
      });

      const fileName = `video_${new Date().getTime()}.mp4`;
      await Filesystem.writeFile({
        path: fileName,
        data: response.data,
        directory: Directory.External, // Guarda en el almacenamiento externo
      });

      alert('Video guardado en la galería.');
    } catch (error) {
      console.error('Error al guardar el video:', error);
      alert('No se pudo guardar el video en la galería.');
    }
  }
  closeModal() {
    this.modalController.dismiss({
      videoPath: this.videoPath,
    });
  }
}
