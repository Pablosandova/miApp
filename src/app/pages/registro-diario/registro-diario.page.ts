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
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  timeOutline,
  checkmarkCircleOutline,
  trashOutline,
  fitnessOutline,
  flameOutline
} from 'ionicons/icons';

interface Rutina {
  id: string;
  nombre: string;
  tipo: string;
  duracion: number;
}

interface RegistroDiario {
  id: string;
  fecha: string;
  rutinaId: string;
  rutinaNombre: string;
  tiempoReal: number;
  notas: string;
  completado: boolean;
}

@Component({
  selector: 'app-registro-diario',
  templateUrl: './registro-diario.page.html',
  styleUrls: ['./registro-diario.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonBadge,
    CommonModule,
    FormsModule
  ]
})
export class RegistroDiarioPage implements OnInit {
  formulario = {
    fecha: '',
    rutinaId: '',
    tiempoReal: '',
    notas: ''
  };

  rutinasDisponibles: Rutina[] = [];
  registros: RegistroDiario[] = [];
  racha: number = 0;

  constructor() {
    addIcons({
      calendarOutline,
      timeOutline,
      checkmarkCircleOutline,
      trashOutline,
      fitnessOutline,
      flameOutline
    });
  }

  ngOnInit() {
    this.cargarRutinas();
    this.cargarRegistros();
    this.formulario.fecha = this.obtenerFechaHoy();
    this.calcularRacha();
  }

  ionViewWillEnter() {
    this.cargarRutinas();
    this.cargarRegistros();
    this.calcularRacha();
  }

  // Cargar rutinas desde localStorage
  cargarRutinas() {
    const rutinasGuardadas = localStorage.getItem('rutinas');
    if (rutinasGuardadas) {
      const rutinasCompletas = JSON.parse(rutinasGuardadas);
      this.rutinasDisponibles = rutinasCompletas.map((r: any) => ({
        id: r.id,
        nombre: r.nombre,
        tipo: r.tipo,
        duracion: r.duracion
      }));
    }
  }

  // Cargar registros desde localStorage
  cargarRegistros() {
    const registrosGuardados = localStorage.getItem('registrosDiarios');
    if (registrosGuardados) {
      this.registros = JSON.parse(registrosGuardados);
      // Ordenar por fecha descendente
      this.registros.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
  }

  // Agregar registro
  agregarRegistro() {
    if (this.formulario.fecha && this.formulario.rutinaId && this.formulario.tiempoReal) {
      const rutinaSeleccionada = this.rutinasDisponibles.find(r => r.id === this.formulario.rutinaId);
      
      if (rutinaSeleccionada) {
        const registro: RegistroDiario = {
          id: this.generarId(),
          fecha: this.formulario.fecha,
          rutinaId: this.formulario.rutinaId,
          rutinaNombre: rutinaSeleccionada.nombre,
          tiempoReal: Number(this.formulario.tiempoReal),
          notas: this.formulario.notas,
          completado: true
        };

        this.registros.unshift(registro);
        this.guardarRegistros();
        this.limpiarFormulario();
        this.calcularRacha();
        alert('✅ Registro guardado correctamente');
      }
    }
  }

  // Eliminar registro
  eliminarRegistro(id: string) {
    if (confirm('¿Eliminar este registro?')) {
      this.registros = this.registros.filter(r => r.id !== id);
      this.guardarRegistros();
      this.calcularRacha();
    }
  }

  // Guardar en localStorage
  guardarRegistros() {
    localStorage.setItem('registrosDiarios', JSON.stringify(this.registros));
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.formulario = {
      fecha: this.obtenerFechaHoy(),
      rutinaId: '',
      tiempoReal: '',
      notas: ''
    };
  }

  // Calcular racha de días consecutivos
  calcularRacha() {
    if (this.registros.length === 0) {
      this.racha = 0;
      return;
    }

    const fechasUnicas = [...new Set(this.registros.map(r => r.fecha))].sort().reverse();
    let rachaActual = 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 0; i < fechasUnicas.length; i++) {
      const fechaRegistro = new Date(fechasUnicas[i]);
      const diasDiferencia = Math.floor((hoy.getTime() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24));

      if (diasDiferencia === rachaActual) {
        rachaActual++;
      } else {
        break;
      }
    }

    this.racha = rachaActual;
  }

  // Obtener fecha de hoy en formato YYYY-MM-DD
  obtenerFechaHoy(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', opciones);
  }

  // Generar ID único
  generarId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Verificar si hay registros hoy
  tieneRegistroHoy(): boolean {
    const hoy = this.obtenerFechaHoy();
    return this.registros.some(r => r.fecha === hoy);
  }
}
