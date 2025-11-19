import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';

declare var L: any; // Leaflet

interface Ubicacion {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: number;
}

interface Ruta {
  distancia: number;
  tiempo: number;
  puntos: Ubicacion[];
  fecha: Date;
}

@Component({
  selector: 'app-running-tracker',
  templateUrl: './running-tracker.page.html',
  styleUrls: ['./running-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class RunningTrackerPage implements OnInit {
  @ViewChild('mapElement') mapElement!: ElementRef;

  // Estado de la carrera
  corriendo = false;
  cargando = false;
  distancia = 0;
  velocidad = 0;
  tiempoFormato = '00:00:00';

  // GPS y ubicación
  ubicacionActual: Ubicacion | null = null;
  puntosRuta: Ubicacion[] = [];
  historialRutas: Ruta[] = [];

  // Mapa y tracking
  mapa: any;
  marcador: any;
  polyline: any;
  intervaloTiempo: any;
  tiempoTranscurrido = 0;
  watchId: string | null = null;

  constructor() {}

  ngOnInit() {
    this.inicializarMapa();
  }

  ngOnDestroy() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  // Inicializar mapa
  inicializarMapa() {
    setTimeout(() => {
      try {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        this.mapa = L.map('map').setView([4.7110, -74.0721], 15); // Centro en Bogotá

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(this.mapa);

        console.log('Mapa inicializado');
      } catch (error) {
        console.error('Error inicializando mapa:', error);
      }
    }, 500);
  }

  // Iniciar tracking
  async toggleCorrer() {
    if (!this.corriendo) {
      await this.iniciarTracking();
    } else {
      this.pausarTracking();
    }
  }

  // Iniciar tracking GPS
  async iniciarTracking() {
    this.cargando = true;
    try {
      // Obtener ubicación inicial
      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.ubicacionActual = {
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
        accuracy: posicion.coords.accuracy,
        altitude: posicion.coords.altitude || undefined,
        timestamp: Date.now()
      };

      this.puntosRuta = [this.ubicacionActual];

      // Centrar mapa en ubicación inicial
      if (this.mapa) {
        this.mapa.setView([this.ubicacionActual.latitude, this.ubicacionActual.longitude], 15);

        // Agregar marcador inicial
        if (this.marcador) {
          this.mapa.removeLayer(this.marcador);
        }
        this.marcador = L.marker([this.ubicacionActual.latitude, this.ubicacionActual.longitude], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        }).addTo(this.mapa);
      }

      // Iniciar contador de tiempo
      this.tiempoTranscurrido = 0;
      this.intervaloTiempo = setInterval(() => {
        this.tiempoTranscurrido++;
        this.actualizarTiempoFormato();
      }, 1000);

      // Monitorear cambios de ubicación
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (posicion) => {
          if (posicion && this.corriendo) {
            const nuevaUbicacion: Ubicacion = {
              latitude: posicion.coords.latitude,
              longitude: posicion.coords.longitude,
              accuracy: posicion.coords.accuracy,
              altitude: posicion.coords.altitude || undefined,
              timestamp: Date.now()
            };

            this.ubicacionActual = nuevaUbicacion;

            // Calcular distancia y velocidad
            if (this.puntosRuta.length > 0) {
              const ultimoPunto = this.puntosRuta[this.puntosRuta.length - 1];
              const distanciaSegmento = this.calcularDistancia(
                ultimoPunto.latitude,
                ultimoPunto.longitude,
                nuevaUbicacion.latitude,
                nuevaUbicacion.longitude
              );

              // Solo agregar punto si la distancia es significativa (>5 metros)
              if (distanciaSegmento > 0.005) {
                this.distancia += distanciaSegmento;
                this.puntosRuta.push(nuevaUbicacion);

                // Calcular velocidad
                const tiempoSegundo = (nuevaUbicacion.timestamp - ultimoPunto.timestamp) / 1000;
                if (tiempoSegundo > 0) {
                  this.velocidad = (distanciaSegmento / tiempoSegundo) * 3.6; // Convertir a km/h
                }

                // Actualizar visualización en el mapa
                this.actualizarMapa();
              }
            } else {
              this.puntosRuta.push(nuevaUbicacion);
            }
          }
        }
      );

      this.corriendo = true;
      this.cargando = false;
    } catch (error) {
      console.error('Error iniciando tracking:', error);
      this.cargando = false;
    }
  }

  // Pausar tracking
  pausarTracking() {
    this.corriendo = false;
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  // Detener y guardar ruta
  detenerYGuardar() {
    this.corriendo = false;

    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }

    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }

    if (this.distancia > 0) {
      const ruta: Ruta = {
        distancia: this.distancia,
        tiempo: Math.floor(this.tiempoTranscurrido / 60),
        puntos: [...this.puntosRuta],
        fecha: new Date()
      };

      this.historialRutas.push(ruta);

      // Guardar en localStorage
      localStorage.setItem('rutasHistorial', JSON.stringify(this.historialRutas));

      alert(`¡Ruta guardada! ${this.distancia.toFixed(2)} km en ${ruta.tiempo} minutos`);
      this.reiniciar();
    }
  }

  // Reiniciar tracker
  reiniciar() {
    this.distancia = 0;
    this.velocidad = 0;
    this.tiempoTranscurrido = 0;
    this.tiempoFormato = '00:00:00';
    this.puntosRuta = [];
    this.ubicacionActual = null;
    this.corriendo = false;

    if (this.polyline) {
      this.mapa.removeLayer(this.polyline);
      this.polyline = null;
    }

    if (this.marcador) {
      this.mapa.removeLayer(this.marcador);
      this.marcador = null;
    }
  }

  // Actualizar visualización del mapa
  actualizarMapa() {
    if (!this.mapa || this.puntosRuta.length < 2) return;

    // Remover polyline anterior
    if (this.polyline) {
      this.mapa.removeLayer(this.polyline);
    }

    // Crear array de coordenadas
    const coordenadas = this.puntosRuta.map(punto => [punto.latitude, punto.longitude]);

    // Dibujar polyline
    this.polyline = L.polyline(coordenadas, {
      color: '#3498db',
      weight: 4,
      opacity: 0.8,
      className: 'ruta-polyline'
    }).addTo(this.mapa);

    // Actualizar marcador de posición actual
    if (this.marcador) {
      this.mapa.removeLayer(this.marcador);
    }

    const ultimoPunto = this.puntosRuta[this.puntosRuta.length - 1];
    this.marcador = L.marker([ultimoPunto.latitude, ultimoPunto.longitude], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
    }).addTo(this.mapa);

    // Centrar mapa en ruta
    this.mapa.fitBounds(this.polyline.getBounds());
  }

  // Mostrar ruta guardada
  mostrarRuta(ruta: Ruta) {
    if (!this.mapa || ruta.puntos.length < 2) return;

    const coordenadas = ruta.puntos.map(punto => [punto.latitude, punto.longitude]);

    if (this.polyline) {
      this.mapa.removeLayer(this.polyline);
    }

    this.polyline = L.polyline(coordenadas, {
      color: '#2ecc71',
      weight: 4,
      opacity: 0.8
    }).addTo(this.mapa);

    this.mapa.fitBounds(this.polyline.getBounds());
  }

  // Calcular distancia entre dos puntos (Fórmula de Haversine)
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Actualizar formato de tiempo
  actualizarTiempoFormato() {
    const horas = Math.floor(this.tiempoTranscurrido / 3600);
    const minutos = Math.floor((this.tiempoTranscurrido % 3600) / 60);
    const segundos = this.tiempoTranscurrido % 60;

    this.tiempoFormato = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }
}
