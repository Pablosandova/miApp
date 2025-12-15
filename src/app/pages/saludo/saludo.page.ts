import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-saludo',
  templateUrl: './saludo.page.html',
  styleUrls: ['./saludo.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SaludoPage {
  nombre: string = '';
  respuesta: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService) {}

  obtenerSaludo() {
    if (!this.nombre.trim()) {
      this.error = 'Por favor ingresa un nombre';
      return;
    }

    this.loading = true;
    this.error = '';
    this.respuesta = null;

    this.apiService.getSaludo(this.nombre).subscribe({
      next: (response) => {
        this.respuesta = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener saludo:', err);
        this.error = 'No se pudo conectar con el servidor. Asegúrate de que Spring Boot esté corriendo en el puerto 8080';
        this.loading = false;
      }
    });
  }

  limpiar() {
    this.nombre = '';
    this.respuesta = null;
    this.error = '';
  }
}
