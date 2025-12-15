import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonItem,
  IonIcon,
  IonInput,
  IonLabel,
  IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  personOutline,
  homeOutline,
  idCardOutline,
  checkmarkCircleOutline,
  alertCircleOutline, 
  logoGoogle, 
  logoApple,
  cameraOutline,
  scanOutline,
  closeCircleOutline } from 'ionicons/icons';
import { FacialRecognitionService } from '../../services/facial-recognition.service';

interface Usuario {
  nombre: string;
  rut: string;
  direccion: string;
  email: string;
  password: string;
  edad?: number;
  estatura?: number;
  peso?: number;
  faceData?: {
    imageDataUrl: string;
    descriptor: number[];
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonItem,
    IonIcon,
    IonInput,
    IonLabel,
    IonSpinner,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  // Control de vista
  enRegistro = false;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;

  // Datos de login
  loginEmail: string = '';
  loginPassword: string = '';
  
  // Reconocimiento facial
  fotoRegistro: string | null = null;
  descriptorFacialRegistro: number[] = [];
  procesandoFoto = false;
  loginConRostro = false;

  // Datos de registro
  registroNombre: string = '';
  registroRut: string = '';
  registroDireccion: string = '';
  registroEmail: string = '';
  registroPassword: string = '';
  registroPasswordConfirm: string = '';

  // Mensajes
  mensaje: string = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  constructor(
    private router: Router,
    private facialService: FacialRecognitionService
  ) {
    addIcons({checkmarkCircleOutline,mailOutline,scanOutline,lockClosedOutline,cameraOutline,personOutline,idCardOutline,homeOutline,closeCircleOutline,logoGoogle,logoApple,eyeOutline,eyeOffOutline,alertCircleOutline});
  }

  ngOnInit() {
  }

  // Cambiar entre login y registro
  cambiarVista() {
    this.enRegistro = !this.enRegistro;
    this.limpiarFormularios();
    this.mensaje = '';
  }

  // Limpiar formularios
  limpiarFormularios() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registroNombre = '';
    this.registroRut = '';
    this.registroDireccion = '';
    this.registroEmail = '';
    this.registroPassword = '';
    this.registroPasswordConfirm = '';
    this.fotoRegistro = null;
    this.descriptorFacialRegistro = [];
    this.loginConRostro = false;
  }

  // Capturar foto para registro
  async capturarFotoRegistro() {
    this.procesandoFoto = true;
    
    try {
      console.log('🎯 Iniciando captura de foto para registro...');
      this.mostrarMensaje('Selecciona la fuente de tu imagen', 'exito');
      
      const foto = await this.facialService.capturarFoto();
      
      if (!foto) {
        console.log('⚠️ No se capturó ninguna foto');
        this.mostrarMensaje('Captura cancelada', 'error');
        this.fotoRegistro = null;
        return;
      }
      
      console.log('📸 Foto capturada, procesando imagen...');
      this.mostrarMensaje('Procesando tu foto...', 'exito');
      this.fotoRegistro = foto;
      
      this.descriptorFacialRegistro = await this.facialService.extraerCaracteristicasFaciales(foto);
      
      if (this.descriptorFacialRegistro && this.descriptorFacialRegistro.length > 0) {
        console.log('✓ Características extraídas:', this.descriptorFacialRegistro.length);
        this.mostrarMensaje('✓ Foto guardada exitosamente', 'exito');
      } else {
        console.error('❌ No se pudieron extraer características');
        this.fotoRegistro = null;
        this.descriptorFacialRegistro = [];
        this.mostrarMensaje('No se pudo procesar la imagen. Intenta nuevamente', 'error');
      }
    } catch (error: any) {
      console.error('❌ Error en capturarFotoRegistro:', error);
      this.fotoRegistro = null;
      this.descriptorFacialRegistro = [];
      
      if (error.message && (error.message.includes('cancel') || error.message.includes('cancelled'))) {
        this.mostrarMensaje('Captura cancelada', 'error');
      } else if (error.message && error.message.includes('permisos')) {
        this.mostrarMensaje('Por favor, permite el acceso a la cámara', 'error');
      } else {
        this.mostrarMensaje('Error al procesar. Intenta nuevamente', 'error');
      }
    } finally {
      this.procesandoFoto = false;
    }
  }

  // Eliminar foto de registro
  eliminarFotoRegistro() {
    this.fotoRegistro = null;
    this.descriptorFacialRegistro = [];
  }

  // Validar email
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validar RUT chileno
  validarRut(rut: string): boolean {
    const rutLimpio = rut.replace(/[^0-9k]/gi, '').toUpperCase();
    if (rutLimpio.length < 8) return false;
    return true;
  }

  // Validar contraseña
  validarPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Iniciar sesión
  login() {
    // Validar campos
    if (!this.loginEmail || !this.loginPassword) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    if (!this.validarEmail(this.loginEmail)) {
      this.mostrarMensaje('Correo electrónico inválido', 'error');
      return;
    }

    // Obtener usuarios registrados
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');

    // Buscar usuario
    const usuarioEncontrado = usuariosRegistrados.find((u: any) => u.email === this.loginEmail);

    if (!usuarioEncontrado) {
      this.mostrarMensaje('Usuario no encontrado', 'error');
      return;
    }

    if (usuarioEncontrado.password !== this.loginPassword) {
      this.mostrarMensaje('Contraseña incorrecta', 'error');
      return;
    }

    // Login exitoso
    this.mostrarMensaje('¡Bienvenido ' + usuarioEncontrado.nombre + '!', 'exito');
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);
  }

  // Activar/desactivar login con rostro
  toggleLoginConRostro() {
    this.loginConRostro = !this.loginConRostro;
    if (this.loginConRostro) {
      this.loginEmail = '';
      this.loginPassword = '';
    }
  }

  // Login con reconocimiento facial
  async loginConReconocimientoFacial() {
    this.procesandoFoto = true;
    
    try {
      console.log('🎯 Iniciando login con reconocimiento facial...');
      this.mostrarMensaje('Selecciona la fuente de tu imagen', 'exito');
      
      const foto = await this.facialService.capturarFoto();
      
      if (!foto) {
        console.log('⚠️ No se capturó ninguna foto');
        this.mostrarMensaje('Captura cancelada', 'error');
        return;
      }
      
      console.log('📸 Foto capturada, extrayendo características...');
      this.mostrarMensaje('Analizando tu rostro...', 'exito');
      
      const descriptorActual = await this.facialService.extraerCaracteristicasFaciales(foto);
      
      if (!descriptorActual || descriptorActual.length === 0) {
        console.error('❌ No se pudieron extraer características');
        this.mostrarMensaje('No se pudo analizar la imagen. Intenta nuevamente', 'error');
        return;
      }
      
      console.log('✓ Características extraídas, buscando coincidencia...');
      this.mostrarMensaje('Verificando identidad...', 'exito');
      
      const emailEncontrado = await this.facialService.buscarUsuarioPorRostro(descriptorActual);
      
      if (emailEncontrado) {
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        const usuario = usuariosRegistrados.find((u: any) => u.email === emailEncontrado);
        
        if (usuario) {
          console.log('✓ Usuario reconocido:', usuario.nombre);
          this.mostrarMensaje('¡Bienvenido ' + usuario.nombre + '!', 'exito');
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        } else {
          console.error('❌ Usuario no encontrado en localStorage');
          this.mostrarMensaje('Error: Usuario no encontrado', 'error');
        }
      } else {
        console.log('⚠️ Rostro no reconocido');
        this.mostrarMensaje('Rostro no reconocido. Regístrate primero', 'error');
      }
    } catch (error: any) {
      console.error('❌ Error en login facial:', error);
      if (error.message && (error.message.includes('cancel') || error.message.includes('cancelled'))) {
        this.mostrarMensaje('Captura cancelada', 'error');
      } else {
        this.mostrarMensaje('Error al procesar. Intenta nuevamente', 'error');
      }
    } finally {
      this.procesandoFoto = false;
    }
  }

  // Registrarse
  registrarse() {
    // Validar campos
    if (!this.registroNombre || !this.registroRut || !this.registroDireccion || !this.registroEmail || !this.registroPassword || !this.registroPasswordConfirm) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    if (!this.validarEmail(this.registroEmail)) {
      this.mostrarMensaje('Correo electrónico inválido', 'error');
      return;
    }

    if (!this.validarRut(this.registroRut)) {
      this.mostrarMensaje('RUT inválido', 'error');
      return;
    }

    if (!this.validarPassword(this.registroPassword)) {
      this.mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (this.registroPassword !== this.registroPasswordConfirm) {
      this.mostrarMensaje('Las contraseñas no coinciden', 'error');
      return;
    }

    // Obtener usuarios existentes
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');

    // Verificar si el email ya existe
    if (usuariosRegistrados.some((u: any) => u.email === this.registroEmail)) {
      this.mostrarMensaje('Este correo ya está registrado', 'error');
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario: Usuario = {
      nombre: this.registroNombre,
      rut: this.registroRut,
      direccion: this.registroDireccion,
      email: this.registroEmail,
      password: this.registroPassword
    };

    // Guardar datos faciales si están disponibles
    if (this.fotoRegistro && this.descriptorFacialRegistro.length > 0) {
      nuevoUsuario.faceData = {
        imageDataUrl: this.fotoRegistro,
        descriptor: this.descriptorFacialRegistro
      };
      this.facialService.guardarDatosFaciales(
        this.registroEmail,
        this.fotoRegistro,
        this.descriptorFacialRegistro
      );
    }

    // Guardar usuario
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

    // Mensaje de éxito
    const mensajeExito = this.fotoRegistro 
      ? '¡Registro exitoso con reconocimiento facial! Ahora puedes iniciar sesión'
      : '¡Registro exitoso! Ahora puedes iniciar sesión';
    this.mostrarMensaje(mensajeExito, 'exito');

    // Cambiar a login automáticamente
    setTimeout(() => {
      this.enRegistro = false;
      this.limpiarFormularios();
      this.loginEmail = this.registroEmail;
    }, 1500);
  }

  // Mostrar mensaje
  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensaje = texto;
    this.tipoMensaje = tipo;

    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  // Toggle password visibility
  togglePassword(campo: string) {
    if (campo === 'login') {
      this.mostrarPassword = !this.mostrarPassword;
    } else if (campo === 'confirm') {
      this.mostrarPasswordConfirm = !this.mostrarPasswordConfirm;
    } else {
      this.mostrarPassword = !this.mostrarPassword;
    }
  }
}
