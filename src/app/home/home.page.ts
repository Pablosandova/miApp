import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
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
  IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  medalOutline, 
  peopleOutline, 
  barbellOutline, 
  timeOutline, 
  locationOutline, 
  personCircleOutline, 
  chevronForwardOutline, trophyOutline, nutritionOutline, arrowForwardOutline, flashOutline, flameOutline, waterOutline, fitnessOutline, playOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
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
    IonSegmentButton
  ],
})
export class HomePage {
  selectedSegment = 'jiujitsu';
  
  tecnicasJiujitsu = [
    {
      nombre: 'Armbar desde Guardia',
      nivel: 'Principiante',
      categoria: 'Sumisiones',
      descripcion: 'Técnica fundamental de control y sumisión desde la posición de guardia',
      imagen: 'assets/tecnicas/armbar.jpg'
    },
    {
      nombre: 'Triangle Choke',
      nivel: 'Intermedio',
      categoria: 'Estrangulaciones',
      descripcion: 'Estrangulación efectiva utilizando las piernas desde la guardia',
      imagen: 'assets/tecnicas/triangle.jpg'
    },
    {
      nombre: 'Berimbolo',
      nivel: 'Avanzado',
      categoria: 'Inversiones',
      descripcion: 'Técnica moderna de inversión para tomar la espalda',
      imagen: 'assets/tecnicas/berimbolo.jpg'
    }
  ];

  planesNutricionales = [
    {
      titulo: 'Plan Pre-Competencia',
      categoria: 'Rendimiento',
      descripcion: 'Optimiza tu peso y energía para la competencia',
      calorias: 2500,
      proteinas: 180,
      carbohidratos: 300,
      grasas: 70,
      tiempo: 30,
      imagen: 'assets/nutricion/precomp.jpg'
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
      imagen: 'assets/nutricion/recovery.jpg'
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
      imagen: 'assets/nutricion/clean.jpg'
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
      imagen: 'assets/ejercicio/strength.jpg'
    },
    {
      nombre: 'Cardio HIIT',
      tipo: 'Resistencia',
      intensidad: 'Máxima',
      duracion: 30,
      calorias: 400,
      ejercicios: 6,
      descripcion: 'Mejora tu resistencia cardiovascular',
      imagen: 'assets/ejercicio/hiit.jpg'
    },
    {
      nombre: 'Movilidad y Flexibilidad',
      tipo: 'Recuperación',
      intensidad: 'Baja',
      duracion: 40,
      calorias: 200,
      ejercicios: 10,
      descripcion: 'Aumenta tu rango de movimiento',
      imagen: 'assets/ejercicio/mobility.jpg'
    }
  ];

  constructor() {
    addIcons({trophyOutline,nutritionOutline,barbellOutline,arrowForwardOutline,flashOutline,flameOutline,waterOutline,fitnessOutline,playOutline,personCircleOutline,timeOutline,locationOutline,chevronForwardOutline,calendarOutline,medalOutline,peopleOutline});
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
