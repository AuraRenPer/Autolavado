import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalCamaraComponent } from './components/modal-camara/modal-camara.component';
import { VideoRecorderComponent } from './components/video-recorder/video-recorder.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx'; 

// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    ModalCamaraComponent,
    VideoRecorderComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    CallNumber,
    MediaCapture,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, // ✅ Proveer JWT Options
    JwtHelperService, // ✅ Agregar JwtHelperService como proveedor
    provideFirebaseApp(() => initializeApp(environment.firebase)), // 🔥 Corregir referencia a Firebase
    provideAuth(() => getAuth()), // 🔥 Proveer Auth
    provideFirestore(() => getFirestore()) // 🔥 Proveer Firestore
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
