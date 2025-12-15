import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // 🔥 URL usando IP local (funciona si estás en la misma red WiFi)
  private apiUrl = 'http://192.168.100.49:8080/api';

  constructor(private http: HttpClient) { }

  /**
   * Subir imagen al backend Spring Boot
   * @param file - Archivo de imagen
   * @returns Observable con la respuesta del servidor
   */
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Obtener todas las imágenes del backend
   * @returns Observable con array de imágenes
   */
  getImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/images`);
  }

  /**
   * Obtener imagen por ID
   * @param id - ID de la imagen
   * @returns Observable con la imagen
   */
  getImageById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/images/${id}`);
  }

  /**
   * Eliminar imagen
   * @param id - ID de la imagen
   * @returns Observable con la respuesta
   */
  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/images/${id}`);
  }

  /**
   * Actualizar URL de la API (útil cuando cambias de túnel)
   * @param newUrl - Nueva URL del backend
   */
  setApiUrl(newUrl: string): void {
    this.apiUrl = newUrl;
  }

  /**
   * Obtener URL actual de la API
   * @returns URL de la API
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
