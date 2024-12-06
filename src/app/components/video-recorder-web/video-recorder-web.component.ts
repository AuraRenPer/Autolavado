import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-recorder-web',
  templateUrl: './video-recorder-web.component.html',
  styleUrls: ['./video-recorder-web.component.scss'],
})
export class VideoRecorderWebComponent {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];
  videoBlobUrl: string | null = null;
  isRecording = false;

  constructor() {}

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();

      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
        this.videoBlobUrl = URL.createObjectURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      alert('No se pudo acceder a la cámara.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  downloadVideo() {
    if (this.videoBlobUrl) {
      const link = document.createElement('a');
      link.href = this.videoBlobUrl;
      link.download = `video_${new Date().getTime()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No hay video para descargar.');
    }
  }

  shareVideo() {
    if (navigator.share && this.videoBlobUrl) {
      fetch(this.videoBlobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], `video_${new Date().getTime()}.mp4`, {
            type: 'video/mp4',
          });

          navigator.share({
            title: 'Mira este video',
            text: 'Acabo de grabar este video en mi navegador.',
            files: [file],
          });
        })
        .catch((error) => {
          console.error('Error al compartir el video:', error);
          alert('No se pudo compartir el video.');
        });
    } else {
      alert('Compartir no está disponible en este navegador.');
    }
  }
}
