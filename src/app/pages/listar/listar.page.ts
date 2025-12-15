import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  fitnessOutline,
  timeOutline,
  pulseOutline,
  informationCircleOutline,
  barbellOutline,
  trashOutline,
  createOutline,
  addCircleOutline, closeOutline } from 'ionicons/icons';

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
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule
  ]
})
export class ListarPage implements OnInit {
  rutinas: Rutina[] = [];
  viendoRutina: Rutina | null = null;

  constructor(private router: Router) {
    addIcons({addCircleOutline,closeOutline,informationCircleOutline,barbellOutline,createOutline,trashOutline,fitnessOutline,timeOutline,pulseOutline});
  }

  ngOnInit() {
    this.cargarRutinas();
  }

  ionViewWillEnter() {
    // Recargar rutinas cada vez que se entre a la vista
    this.cargarRutinas();
  }

  // Cargar rutinas desde localStorage
  cargarRutinas() {
    const rutinasGuardadas = localStorage.getItem('rutinas');
    if (rutinasGuardadas) {
      this.rutinas = JSON.parse(rutinasGuardadas);
    }
  }

  // Ver detalles de una rutina
  verRutina(rutina: Rutina) {
    this.viendoRutina = rutina;
  }

  // Cerrar vista de rutina
  cerrarVistaRutina() {
    this.viendoRutina = null;
  }

  // Editar rutina - redirige a la página de rutinas con los datos
  editarRutina(rutina: Rutina) {
    this.router.navigate(['/rutinas'], {
      state: { rutina: rutina }
    });
  }

  // Eliminar rutina
  eliminarRutina(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      this.rutinas = this.rutinas.filter(r => r.id !== id);
      localStorage.setItem('rutinas', JSON.stringify(this.rutinas));
      if (this.viendoRutina && this.viendoRutina.id === id) {
        this.viendoRutina = null;
      }
    }
  }

  // Refrescar lista
  handleRefresh(event: any) {
    this.cargarRutinas();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  // Ir a crear nueva rutina
  irACrearRutina() {
    this.router.navigate(['/rutinas']);
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
