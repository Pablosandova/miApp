import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonBackButton,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';

interface Rutina {
  id: string;
  nombre: string;
  tipo: string;
  duracion: number;
  nivel: string;
  descripcion: string;
  ejercicios: string[];
}

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.page.html',
  styleUrls: ['./rutinas.page.scss'],
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
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule
  ]
})
export class RutinasPage implements OnInit {
  formulario = {
    nombre: '',
    tipo: 'Fuerza',
    duracion: '',
    nivel: 'Principiante',
    descripcion: '',
    ejercicios: ''
  };

  rutinas: Rutina[] = [];
  editandoId: string = '';
  modoEdicion: boolean = false;
  viendoRutina: Rutina | null = null;

  tiposRutina = ['Fuerza', 'Cardio', 'Flexibilidad', 'HIIT', 'Funcional', 'Yoga'];
  niveles = ['Principiante', 'Intermedio', 'Avanzado'];

  constructor(private router: Router) {
    // Verificar si viene de la página de listar con una rutina para editar
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['rutina']) {
      const rutina = navigation.extras.state['rutina'];
      this.cargarRutinaParaEditar(rutina);
    }
  }

  ngOnInit() {
    this.cargarRutinas();
  }

  ionViewWillEnter() {
    // Recargar rutinas cada vez que se entre a la vista
    this.cargarRutinas();
  }

  // Cargar rutina para editar desde otra página
  cargarRutinaParaEditar(rutina: Rutina) {
    this.formulario = {
      nombre: rutina.nombre,
      tipo: rutina.tipo,
      duracion: rutina.duracion.toString(),
      nivel: rutina.nivel,
      descripcion: rutina.descripcion,
      ejercicios: rutina.ejercicios.join('\n')
    };
    this.editandoId = rutina.id;
    this.modoEdicion = true;
  }

  // CREATE - Agregar o actualizar rutina
  guardarRutina() {
    if (this.formulario.nombre && this.formulario.duracion && this.formulario.descripcion) {
      const ejerciciosArray = this.formulario.ejercicios
        .split('\n')
        .map(e => e.trim())
        .filter(e => e.length > 0);

      const rutina: Rutina = {
        id: this.modoEdicion ? this.editandoId : this.generarId(),
        nombre: this.formulario.nombre,
        tipo: this.formulario.tipo,
        duracion: Number(this.formulario.duracion),
        nivel: this.formulario.nivel,
        descripcion: this.formulario.descripcion,
        ejercicios: ejerciciosArray
      };

      if (this.modoEdicion) {
        // UPDATE - Actualizar rutina existente
        const indice = this.rutinas.findIndex(r => r.id === this.editandoId);
        if (indice !== -1) {
          this.rutinas[indice] = rutina;
          this.mostrarMensaje('Rutina actualizada correctamente');
        }
      } else {
        // CREATE - Agregar nueva rutina
        this.rutinas.push(rutina);
        this.mostrarMensaje('Rutina creada correctamente');
      }

      this.guardarEnStorage();
      this.limpiarFormulario();
      
      // No mostrar la rutina recién agregada en la lista
      // El usuario debe ir a "Listar" para verla
    }
  }

  // READ - Cargar rutinas desde localStorage
  cargarRutinas() {
    const rutinasGuardadas = localStorage.getItem('rutinas');
    if (rutinasGuardadas) {
      this.rutinas = JSON.parse(rutinasGuardadas);
    }
  }

  // READ - Ver detalles de una rutina
  verRutina(rutina: Rutina) {
    this.viendoRutina = rutina;
  }

  // UPDATE - Editar rutina
  editarRutina(rutina: Rutina) {
    this.formulario = {
      nombre: rutina.nombre,
      tipo: rutina.tipo,
      duracion: rutina.duracion.toString(),
      nivel: rutina.nivel,
      descripcion: rutina.descripcion,
      ejercicios: rutina.ejercicios.join('\n')
    };
    this.editandoId = rutina.id;
    this.modoEdicion = true;
    this.viendoRutina = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // DELETE - Eliminar rutina
  eliminarRutina(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      this.rutinas = this.rutinas.filter(r => r.id !== id);
      this.guardarEnStorage();
      this.mostrarMensaje('Rutina eliminada');
      if (this.viendoRutina && this.viendoRutina.id === id) {
        this.viendoRutina = null;
      }
    }
  }

  // Guardar en localStorage
  guardarEnStorage() {
    localStorage.setItem('rutinas', JSON.stringify(this.rutinas));
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.formulario = {
      nombre: '',
      tipo: 'Fuerza',
      duracion: '',
      nivel: 'Principiante',
      descripcion: '',
      ejercicios: ''
    };
    this.modoEdicion = false;
    this.editandoId = '';
  }

  // Cancelar edición
  cancelarEdicion() {
    this.limpiarFormulario();
  }

  // Cerrar vista de rutina
  cerrarVistaRutina() {
    this.viendoRutina = null;
  }

  // Generar ID único
  generarId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Mostrar mensaje
  mostrarMensaje(mensaje: string) {
    alert(mensaje);
  }

  // Obtener color según tipo
  getColorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      'Fuerza': 'danger',
      'Cardio': 'warning',
      'Flexibilidad': 'success',
      'HIIT': 'tertiary',
      'Funcional': 'primary',
      'Yoga': 'secondary'
    };
    return colores[tipo] || 'medium';
  }

  // Obtener color según nivel
  getColorNivel(nivel: string): string {
    const colores: { [key: string]: string } = {
      'Principiante': 'success',
      'Intermedio': 'warning',
      'Avanzado': 'danger'
    };
    return colores[nivel] || 'medium';
  }
}
