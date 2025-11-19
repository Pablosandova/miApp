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
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonBadge,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  playOutline, 
  pauseOutline, 
  stopOutline, 
  timerOutline, 
  fitnessOutline,
  flameOutline,
  checkmarkCircleOutline 
} from 'ionicons/icons';

interface Usuario {
  nombre: string;
  edad: number;
  estatura: number;
  peso: number;
}

interface Rutina {
  nombre: string;
  tipo: string;
  intensidad: string;
  duracion: number;
  calorias: number;
  ejercicios: number;
  descripcion: string;
  imagen: string;
}

interface Ejercicio {
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: number;
  descripcion: string;
}

@Component({
  selector: 'app-rutina-personalizada',
  templateUrl: './rutina-personalizada.page.html',
  styleUrls: ['./rutina-personalizada.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonBadge,
    IonLabel
  ]
})
export class RutinaPersonalizadaPage implements OnInit {
  rutina: Rutina | null = null;
  usuario: Usuario | null = null;
  ejercicios: Ejercicio[] = [];
  
  tiempoTranscurrido = 0;
  tiempoTotal = 0;
  ejercicioActual = 0;
  enProgreso = false;
  completado = false;
  
  calorias_quemadas = 0;
  duracion_minutos = 0;

  constructor(private router: Router) {
    addIcons({arrowBackOutline, playOutline, pauseOutline, stopOutline, timerOutline, fitnessOutline, flameOutline, checkmarkCircleOutline});
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.rutina = navigation.extras.state['rutina'];
      this.usuario = navigation.extras.state['usuario'];
      this.generarRutina();
    }
  }

  generarRutina() {
    if (!this.rutina || !this.usuario) return;

    // Calcular calorías personalizadas
    this.calorias_quemadas = Math.round(this.rutina.calorias * (this.usuario.peso / 70));
    this.duracion_minutos = this.rutina.duracion;
    this.tiempoTotal = this.rutina.duracion * 60; // en segundos

    // Generar ejercicios según el tipo de rutina
    this.ejercicios = this.generarEjercicios();
  }

  generarEjercicios(): Ejercicio[] {
    if (!this.rutina) return [];

    const baseDatos: { [key: string]: Ejercicio[] } = {
      'Fuerza': [
        { nombre: 'Sentadillas', series: 4, repeticiones: '8-10', descanso: 90, descripcion: 'Profundidad controlada, espalda recta' },
        { nombre: 'Press de banca', series: 4, repeticiones: '8-10', descanso: 90, descripcion: 'Movimiento controlado, activación pectoral' },
        { nombre: 'Peso muerto', series: 3, repeticiones: '5-6', descanso: 120, descripcion: 'Posición correcta de espalda' },
        { nombre: 'Dominadas', series: 3, repeticiones: '6-8', descanso: 60, descripcion: 'Amplitud completa de movimiento' },
        { nombre: 'Flexiones', series: 3, repeticiones: '10-15', descanso: 60, descripcion: 'Cuerpo recto, codos controlados' },
        { nombre: 'Remos', series: 3, repeticiones: '8-10', descanso: 60, descripcion: 'Tracción hacia el pecho' }
      ],
      'Resistencia': [
        { nombre: 'Burpees', series: 3, repeticiones: '30 segundos', descanso: 30, descripcion: 'Máxima intensidad, movimiento rápido' },
        { nombre: 'Montaña alpinista', series: 3, repeticiones: '45 segundos', descanso: 15, descripcion: 'Ritmo acelerado' },
        { nombre: 'Saltos al cajón', series: 3, repeticiones: '20', descanso: 45, descripcion: 'Explosividad máxima' },
        { nombre: 'Sentadillas dinámicas', series: 3, repeticiones: '40 segundos', descanso: 20, descripcion: 'Ritmo constante' },
        { nombre: 'Cuerda para saltar', series: 2, repeticiones: '1 min', descanso: 30, descripcion: 'Velocidad de muñecas' },
        { nombre: 'Sprints', series: 3, repeticiones: '30 seg', descanso: 30, descripcion: 'Esfuerzo máximo' }
      ],
      'Recuperación': [
        { nombre: 'Yoga suave', series: 1, repeticiones: '5 minutos', descanso: 0, descripcion: 'Respiración profunda y estiramientos' },
        { nombre: 'Movilidad de cadera', series: 2, repeticiones: '8 reps', descanso: 30, descripcion: 'Movimientos lentos y controlados' },
        { nombre: 'Stretching completo', series: 1, repeticiones: '10 min', descanso: 0, descripcion: 'Todos los grupos musculares' },
        { nombre: 'Foam rolling', series: 1, repeticiones: '8 min', descanso: 0, descripcion: 'Liberación miofascial' },
        { nombre: 'Respiración y meditación', series: 1, repeticiones: '5 min', descanso: 0, descripcion: 'Relajación profunda' }
      ]
    };

    const tipo = this.rutina.tipo;
    return baseDatos[tipo] || baseDatos['Fuerza'];
  }

  iniciarEntrenamiento() {
    this.enProgreso = true;
  }

  pausarEntrenamiento() {
    this.enProgreso = false;
  }

  finalizarEntrenamiento() {
    this.completado = true;
    this.enProgreso = false;
  }

  siguienteEjercicio() {
    if (this.ejercicioActual < this.ejercicios.length - 1) {
      this.ejercicioActual++;
    } else {
      this.finalizarEntrenamiento();
    }
  }

  ejercicioAnterior() {
    if (this.ejercicioActual > 0) {
      this.ejercicioActual--;
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  calcularProgreso(): number {
    return (this.ejercicioActual / this.ejercicios.length) * 100;
  }
}
