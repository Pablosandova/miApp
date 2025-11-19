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

  // Agregar nuevo usuario
  agregarUsuario() {
    if (this.formulario.nombre && this.formulario.edad && this.formulario.estatura && this.formulario.peso) {
      const nuevoUsuario: Usuario = {
        nombre: this.formulario.nombre,
        edad: Number(this.formulario.edad),
        estatura: Number(this.formulario.estatura),
        peso: Number(this.formulario.peso)
      };

      this.usuarios.push(nuevoUsuario);
      this.guardarUsuarios();
      this.limpiarFormulario();
      this.mostrarConfirmacion();
    }
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
  }

  // Calcular IMC
  calcularIMC(usuario: Usuario): number {
    const estaturaEnMetros = usuario.estatura / 100;
    return usuario.peso / (estaturaEnMetros * estaturaEnMetros);
  }

  // Mostrar confirmación
  mostrarConfirmacion() {
    alert('¡Usuario registrado correctamente!');
  }
}
