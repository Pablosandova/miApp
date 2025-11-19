import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trophyOutline, 
  nutritionOutline, 
  barbellOutline, 
  arrowForwardOutline, 
  flashOutline, 
  flameOutline, 
  waterOutline, 
  fitnessOutline, 
  playOutline, personCircleOutline, personAddOutline, schoolOutline, checkmarkCircleOutline, rocketOutline } from 'ionicons/icons';

interface Usuario {
  nombre: string;
  edad: number;
  estatura: number;
  peso: number;
}

interface Plan {
  titulo: string;
  categoria: string;
  descripcion: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  tiempo: number;
  imagen: string;
  usuarioAsignado?: string;
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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    RouterLink,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonLabel,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonBadge
  ],
})
export class HomePage implements OnInit, OnDestroy {
  selectedSegment = 'jiujitsu';
  usuarioSeleccionado: Usuario | null = null;
  usuarios: Usuario[] = [];
  private refreshInterval: any;
  
  tecnicasJiujitsu = [
    {
      nombre: 'Armbar desde Guardia',
      nivel: 'Principiante',
      categoria: 'Sumisiones',
      descripcion: 'Técnica fundamental de control y sumisión desde la posición de guardia',
      imagen: 'assets/bjj1.jpeg'
    },
    {
      nombre: 'Triangle Choke',
      nivel: 'Intermedio',
      categoria: 'Estrangulaciones',
      descripcion: 'Estrangulación efectiva utilizando las piernas desde la guardia',
      imagen: 'assets/bjj2.jpeg'
    },
    {
      nombre: 'Berimbolo',
      nivel: 'Avanzado',
      categoria: 'Inversiones',
      descripcion: 'Técnica moderna de inversión para tomar la espalda',
      imagen: 'assets/bjj3.jpeg'
    }
  ];

  planesNutricionales: Plan[] = [
    {
      titulo: 'Plan Pre-Competencia',
      categoria: 'Rendimiento',
      descripcion: 'Optimiza tu peso y energía para la competencia',
      calorias: 2500,
      proteinas: 180,
      carbohidratos: 300,
      grasas: 70,
      tiempo: 30,
      imagen: 'assets/nate1.jpeg'
    },
    {
      titulo: 'Recuperación Post-Entreno',
      categoria: 'Recuperación',
      descripcion: 'Maximiza la recuperación muscular y energética',
      calorias: 2200,
      proteinas: 160,
      carbohidratos: 250,
      grasas: 60,
      tiempo: 20,
      imagen: 'assets/recovery.jpeg'
    },
    {
      titulo: 'Dieta Limpia',
      categoria: 'Mantenimiento',
      descripcion: 'Mantén tu peso y energía de forma saludable',
      calorias: 2000,
      proteinas: 150,
      carbohidratos: 200,
      grasas: 55,
      tiempo: 25,
      imagen: 'assets/bjj3.jpeg'
    }
  ];

  rutinasEjercicio = [
    {
      nombre: 'Fuerza para BJJ',
      tipo: 'Fuerza',
      intensidad: 'Alta',
      duracion: 45,
      calorias: 450,
      ejercicios: 8,
      descripcion: 'Desarrolla fuerza específica para jiu-jitsu',
      imagen: 'assets/fuerza.jpeg'
    },
    {
      nombre: 'Cardio HIIT',
      tipo: 'Resistencia',
      intensidad: 'Máxima',
      duracion: 30,
      calorias: 400,
      ejercicios: 6,
      descripcion: 'Mejora tu resistencia cardiovascular',
      imagen: 'assets/fuerza1.jpeg'
    },
    {
      nombre: 'Movilidad y Flexibilidad',
      tipo: 'Recuperación',
      intensidad: 'Baja',
      duracion: 40,
      calorias: 200,
      ejercicios: 10,
      descripcion: 'Aumenta tu rango de movimiento',
      imagen: 'assets/fuerza2.jpeg'
    }
  ];

  constructor(private router: Router) {
    addIcons({personCircleOutline,personAddOutline,rocketOutline,trophyOutline,nutritionOutline,barbellOutline,flashOutline,schoolOutline,checkmarkCircleOutline,arrowForwardOutline,flameOutline,waterOutline,fitnessOutline,playOutline});
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.seleccionarPrimerUsuario();
    
    // Actualizar usuarios cada vez que regresa a esta página
    this.refreshInterval = setInterval(() => {
      this.cargarUsuarios();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // Cargar usuarios desde localStorage
  cargarUsuarios() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      this.usuarios = JSON.parse(usuariosGuardados);
    }
  }

  // Seleccionar el primer usuario por defecto
  seleccionarPrimerUsuario() {
    if (this.usuarios.length > 0) {
      this.usuarioSeleccionado = this.usuarios[0];
    }
  }

  // Cambiar usuario seleccionado
  cambiarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
  }

  // Cambiar segmento
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  // Calcular calorías personalizadas según el usuario
  calcularCaloriasPersonalizadas(calorias: number, usuario: Usuario | null): number {
    if (!usuario) return calorias;
    
    // Fórmula Harris-Benedict para calcular TMB (Tasa Metabólica Basal)
    const isMale = true; // Puedes ajustar según género
    let tmb = 88.362 + (13.397 * usuario.peso) + (4.799 * usuario.estatura) - (5.677 * usuario.edad);
    
    // Ajustar calorías basado en TMB
    const factor = calorias / 2500; // 2500 es el valor base
    return Math.round(tmb * factor);
  }

  // Calcular macronutrientes personalizados
  calcularMacronutrientes(usuario: Usuario | null) {
    if (!usuario) {
      return {
        proteinas: 100,
        carbohidratos: 150,
        grasas: 55
      };
    }

    const factorPeso = usuario.peso / 75; // 75 kg es el peso base
    
    return {
      proteinas: Math.round(100 * factorPeso),
      carbohidratos: Math.round(150 * factorPeso),
      grasas: Math.round(55 * factorPeso)
    };
  }


  // Obtener recomendación de ejercicio según el usuario
  obtenerRecomendacionEjercicio(usuario: Usuario | null) {
    if (!usuario) return '';
    
    const imc = usuario.peso / ((usuario.estatura / 100) * (usuario.estatura / 100));
    
    if (imc < 18.5) return 'Enfoque en ganancia muscular y fuerza';
    if (imc < 25) return 'Mantén tu rutina de fuerza y cardio balanceado';
    if (imc < 30) return 'Aumenta cardio y reduce calorías ligeramente';
    return 'Aumenta intensidad de cardio y movilidad';
  }

  // Iniciar rutina personalizada
  iniciarRutina(rutina: Rutina) {
    if (!this.usuarioSeleccionado) {
      alert('Por favor selecciona un usuario');
      return;
    }

    this.router.navigate(['/rutina-personalizada'], {
      state: {
        rutina: rutina,
        usuario: this.usuarioSeleccionado
      }
    });
  }

  // Manejo de errores de carga de imagen
  onImageError(event: any) {
    console.error('Error cargando imagen:', event.target.src);
    // Establecer una imagen por defecto o placeholder
    event.target.src = 'assets/icon/favicon.png';
  }
}
