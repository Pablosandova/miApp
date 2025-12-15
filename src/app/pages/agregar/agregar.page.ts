import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonLabel,
  IonIcon,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

interface Usuario {
  nombre: string;
  edad: number;
  estatura: number;
  peso: number;
}

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonLabel,
    IonIcon,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule
  ]
})
export class AgregarPage implements OnInit {
  formulario = {
    nombre: '',
    edad: '',
    estatura: '',
    peso: ''
  };

  usuarios: Usuario[] = [];
  editandoIndice: number = -1;
  modoEdicion: boolean = false;

  constructor() {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Cargar usuarios del localStorage
  cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      this.usuarios = JSON.parse(usuariosGuardados);
    }
  }

  // Agregar o actualizar usuario
  agregarUsuario() {
    if (this.formulario.nombre && this.formulario.edad && this.formulario.estatura && this.formulario.peso) {
      const usuario: Usuario = {
        nombre: this.formulario.nombre,
        edad: Number(this.formulario.edad),
        estatura: Number(this.formulario.estatura),
        peso: Number(this.formulario.peso)
      };

      if (this.modoEdicion && this.editandoIndice >= 0) {
        // Actualizar usuario existente
        this.usuarios[this.editandoIndice] = usuario;
        this.mostrarConfirmacion('Usuario actualizado correctamente');
      } else {
        // Agregar nuevo usuario
        this.usuarios.push(usuario);
        this.mostrarConfirmacion('Usuario registrado correctamente');
      }

      this.guardarUsuarios();
      this.limpiarFormulario();
    }
  }

  // Editar usuario
  editarUsuario(indice: number) {
    const usuario = this.usuarios[indice];
    this.formulario = {
      nombre: usuario.nombre,
      edad: usuario.edad.toString(),
      estatura: usuario.estatura.toString(),
      peso: usuario.peso.toString()
    };
    this.editandoIndice = indice;
    this.modoEdicion = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancelar edición
  cancelarEdicion() {
    this.limpiarFormulario();
  }

  // Eliminar usuario
  eliminarUsuario(indice: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarios.splice(indice, 1);
      this.guardarUsuarios();
    }
  }

  // Guardar usuarios en localStorage
  guardarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.formulario = {
      nombre: '',
      edad: '',
      estatura: '',
      peso: ''
    };
    this.modoEdicion = false;
    this.editandoIndice = -1;
  }

  // Calcular IMC
  calcularIMC(usuario: Usuario): number {
    const estaturaEnMetros = usuario.estatura / 100;
    return usuario.peso / (estaturaEnMetros * estaturaEnMetros);
  }

  // Mostrar confirmación
  mostrarConfirmacion(mensaje: string = '¡Usuario registrado correctamente!') {
    alert(mensaje);
  }
}
