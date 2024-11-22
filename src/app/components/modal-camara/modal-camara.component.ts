import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-modal-camara',
  templateUrl: './modal-camara.component.html',
  styleUrls: ['./modal-camara.component.scss'],
})
export class ModalCamaraComponent implements AfterViewInit {
  imageUrl: string | undefined;
  isDesktop: boolean = false;
  videoStreamActive = false;

  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  constructor(private modalController: ModalController) {
    this.isDesktop = !this.isMobile();
  }

  ngAfterViewInit() {
    if (this.isDesktop) {
      this.takePhotoWithWebCamera();
    }
  }

  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  async takePhoto() {
    if (this.isDesktop) {
      await this.takePhotoWithWebCamera();
    } else {
      await this.takePhotoWithCapacitorCamera();
    }
  }

  async takePhotoWithWebCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      this.videoStreamActive = true;
      this.video.nativeElement.srcObject = stream;

      setTimeout(() => {
        this.captureImageFromVideo(stream);
      }, 1000);
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
    }
  }

  captureImageFromVideo(stream: MediaStream) {
    const canvas = document.createElement('canvas');
    const video = this.video.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageUrl = canvas.toDataURL('image/png'); // Captura la imagen como DataURL
    }

    stream.getTracks().forEach((track) => track.stop());
    this.videoStreamActive = false;
  }

  async takePhotoWithCapacitorCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.imageUrl = image.dataUrl;
  }

  dismissModal() {
    this.modalController.dismiss({
      imageUrl: this.imageUrl,
    });
  }

async saveToGallery() {
  if (this.imageUrl) {
    const fileName = `photo_${new Date().getTime()}.png`;

    try {
      if (this.isMobile()) {
        // Guardar en la galería en dispositivos móviles
        await Filesystem.writeFile({
          path: fileName,
          data: this.imageUrl.split(',')[1], // Quita el prefijo data:image/png;base64
          directory: Directory.External, // Guarda en la galería si es compatible
        });
        alert('Imagen guardada en la galería.');
      } else {
        // Descargar directamente la imagen en escritorio
        const link = document.createElement('a');
        link.href = this.imageUrl; // DataURL de la imagen
        link.download = fileName; // Nombre sugerido para la descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('Imagen descargada.');
      }
    } catch (error) {
      console.error('Error al guardar o descargar la imagen:', error);
      alert('No se pudo guardar o descargar la imagen.');
    }
  } else {
    alert('No hay imagen disponible para guardar.');
  }
}

  async shareImage() {
    if (this.imageUrl) {
      try {
        const fileName = `photo_${new Date().getTime()}.png`;
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: this.imageUrl.split(',')[1],
          directory: Directory.Cache,
        });

        await Share.share({
          title: 'Check out this photo!',
          text: 'I just captured this image.',
          url: savedFile.uri,
          dialogTitle: 'Share Image',
        });
      } catch (error) {
        console.error('Error sharing image:', error);
        alert('Unable to share the image.');
      }
    } else {
      alert('No image to share.');
    }
  }
}
