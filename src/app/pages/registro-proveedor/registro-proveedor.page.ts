import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthService } from '../../services/auth.service';  // Importar el servicio AuthService
import { AlertController, NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-registro-proveedor',
  templateUrl: './registro-proveedor.page.html',
  styleUrls: ['./registro-proveedor.page.scss'],
})
export class RegistroProveedorPage {
  proveedorForm: FormGroup;
  imagenBase64: string = '';
  imagenUrl: string = '';

  diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  diasSeleccionados: { [key: string]: boolean } = {
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  };

  horaInicio: string = '';
  horaFin: string = '';
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.proveedorForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      direccion: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      idCategoria: ['', Validators.required],
    });

  }

  ionViewDidEnter() {
    this.mostrarMensajeBienvenida();
    this.cargarCategorias();
  }

  async mostrarMensajeBienvenida() {
    const alert = await this.alertController.create({
      header: 'Bienvenido',
      message: 'Complete el siguiente formulario para registrarse como proveedor de servicios.',
      buttons: ['OK']
    });

    await alert.present();
  }

  categorias: any[] = [];

  async cargarCategorias() {
    try {
      const response: any = await this.http.get('https://api-cog73kiucq-uc.a.run.app/api/categorias_servilink/obtenercategorias').toPromise();
      this.categorias = response.filter((cat: any) => cat.estatus === 'activo');
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }


  async registrarProveedor() {
    if (this.proveedorForm.invalid) {
      this.mostrarMensaje('Por favor, completa todos los campos.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Registrando proveedor...' });
    await loading.present();

    try {
      // 🔹 Subir imagen a Firebase Storage si se seleccionó
      if (this.imagenBase64) {
        const storage = getStorage();
        const storageRef = ref(storage, `proveedores/${Date.now()}.jpg`);
        const imageBlob = await fetch(this.imagenBase64).then(res => res.blob());

        await uploadBytes(storageRef, imageBlob);
        this.imagenUrl = await getDownloadURL(storageRef);
      }

      const token = this.authService.getToken();
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      const idUsuario = payload.id;

      const diasActivos = Object.entries(this.diasSeleccionados)
        .filter(([_, activo]) => activo)
        .map(([dia]) => dia.charAt(0).toUpperCase() + dia.slice(1));

      const horarioServicio = `${diasActivos.join(', ')} ${this.horaInicio} - ${this.horaFin}`;

      // Convertimos las horas a minutos para comparar
      const [horaI, minutoI] = this.horaInicio.split(':').map(Number);
      const [horaF, minutoF] = this.horaFin.split(':').map(Number);
      const totalInicio = horaI * 60 + minutoI;
      const totalFin = horaF * 60 + minutoF;

      if (totalFin <= totalInicio) {
        const alert = await this.alertController.create({
          header: 'Horario inválido',
          message: 'La hora de cierre debe ser posterior a la hora de apertura.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }


      const proveedorData = {
        nombreEmpresa: this.proveedorForm.value.nombreEmpresa,
        correo: this.proveedorForm.value.correo,
        telefono: this.proveedorForm.value.telefono,
        ubicacion: {
          direccion: this.proveedorForm.value.direccion,
          lat: parseFloat(this.proveedorForm.value.latitud),
          lng: parseFloat(this.proveedorForm.value.longitud)
        },
        horarioServicio: horarioServicio,
        idCategoria: this.proveedorForm.value.idCategoria,
        idUsuario: idUsuario,
        imagen: this.imagenUrl || '',
        estado: "activo"
      };

      const response: any  = await this.http.post('https://api-cog73kiucq-uc.a.run.app/api/proveedores_servilink/crearproveedor', proveedorData).toPromise();

      // 🔹 Actualizar rol del usuario a proveedor
      if (response && response.idProveedor) {
        const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
      
        userData.idProveedor = response.idProveedor;
        userData.rol = 'proveedor'; // ✅ ACTUALIZA EL ROL AQUÍ
      
        localStorage.setItem('usuario', JSON.stringify(userData));
        //this.authService.setUsuario(userData);

      }
      

      await loading.dismiss();
      this.mostrarMensaje('Proveedor registrado exitosamente.');
      this.router.navigate(['/home']);

    } catch (error) {
      await loading.dismiss();
      this.mostrarMensaje('Error al registrar el proveedor.');
      console.error(error);
    }
  }

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastCtrl.create({ message: mensaje, duration: 3000, position: 'bottom' });
    await toast.present();
  }

  async regresar() {
    const alert = await this.alertController.create({
      header: '¿Cancelar registro?',
      message: 'Si regresas al menú principal, perderás los datos ingresados. ¿Deseas continuar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.navCtrl.navigateBack('/profile');
          }
        }
      ]
    });

    await alert.present();
  }

  async obtenerUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.center = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    // Puedes llenar los campos del formulario si deseas:
    this.proveedorForm.patchValue({
      latitud: this.center.lat,
      longitud: this.center.lng
    });
  }

  actualizarUbicacion(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center = event.latLng.toJSON();
      this.proveedorForm.patchValue({
        latitud: this.center.lat,
        longitud: this.center.lng
      });
    }
  }
}
