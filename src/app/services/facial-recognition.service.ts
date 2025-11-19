import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class FacialRecognitionService {

  constructor() { }

  /**
   * Captura una foto usando la cámara del dispositivo o webcam con opción de elegir
   */
  async capturarFoto(): Promise<string | null> {
    try {
      // Mostrar opciones al usuario
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Permite elegir entre cámara, galería o cancelar
        promptLabelHeader: 'Selecciona una opción',
        promptLabelPhoto: 'Desde Galería',
        promptLabelPicture: 'Tomar Foto',
        correctOrientation: true,
        width: 640,
        height: 640
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error al capturar foto:', error);
      return null;
    }
  }

  /**
   * Captura una foto directamente desde la cámara
   */
  async capturarFotoDirecta(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true,
        width: 640,
        height: 640
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error al capturar foto:', error);
      return null;
    }
  }

  /**
   * Extrae características faciales simplificadas de una imagen
   * En una implementación real, usarías face-api.js con modelos pre-entrenados
   */
  async extraerCaracteristicasFaciales(imageDataUrl: string): Promise<number[]> {
    // Simulación de extracción de características
    // En producción, aquí usarías face-api.js para extraer descriptores faciales reales
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, 128, 128);
          const imageData = ctx.getImageData(0, 0, 128, 128);
          
          // Generar un "descriptor" simplificado basado en la imagen
          // Este es un método simplificado - en producción usarías face-api.js
          const descriptor: number[] = [];
          const blockSize = 16;
          
          for (let y = 0; y < 128; y += blockSize) {
            for (let x = 0; x < 128; x += blockSize) {
              let r = 0, g = 0, b = 0, count = 0;
              
              for (let by = 0; by < blockSize; by++) {
                for (let bx = 0; bx < blockSize; bx++) {
                  const idx = ((y + by) * 128 + (x + bx)) * 4;
                  r += imageData.data[idx];
                  g += imageData.data[idx + 1];
                  b += imageData.data[idx + 2];
                  count++;
                }
              }
              
              descriptor.push(r / count / 255);
              descriptor.push(g / count / 255);
              descriptor.push(b / count / 255);
            }
          }
          
          resolve(descriptor);
        } else {
          resolve([]);
        }
      };
      
      img.onerror = () => {
        resolve([]);
      };
      
      img.src = imageDataUrl;
    });
  }

  /**
   * Compara dos conjuntos de características faciales
   * Retorna un valor entre 0 y 1, donde 1 es idéntico
   */
  compararCaracteristicas(descriptor1: number[], descriptor2: number[]): number {
    if (descriptor1.length !== descriptor2.length || descriptor1.length === 0) {
      return 0;
    }

    // Calcular distancia euclidiana
    let sumSquares = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      const diff = descriptor1[i] - descriptor2[i];
      sumSquares += diff * diff;
    }
    
    const distance = Math.sqrt(sumSquares);
    
    // Convertir distancia a similitud (0-1)
    // Ajustar el umbral según necesites
    const maxDistance = 2.0; // Ajustable
    const similarity = Math.max(0, 1 - (distance / maxDistance));
    
    return similarity;
  }

  /**
   * Verifica si dos rostros coinciden (umbral de similitud 0.6)
   */
  verificarCoincidencia(descriptor1: number[], descriptor2: number[]): boolean {
    const similarity = this.compararCaracteristicas(descriptor1, descriptor2);
    const umbral = 0.6; // 60% de similitud requerida
    
    console.log('Similitud facial:', similarity);
    return similarity >= umbral;
  }

  /**
   * Guarda los datos faciales del usuario
   */
  guardarDatosFaciales(email: string, imageDataUrl: string, descriptor: number[]): void {
    const faceData = {
      email,
      imageDataUrl,
      descriptor,
      timestamp: new Date().toISOString()
    };

    const faceDataKey = `faceData_${email}`;
    localStorage.setItem(faceDataKey, JSON.stringify(faceData));
  }

  /**
   * Obtiene los datos faciales de un usuario
   */
  obtenerDatosFaciales(email: string): any {
    const faceDataKey = `faceData_${email}`;
    const data = localStorage.getItem(faceDataKey);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Busca un usuario por reconocimiento facial
   */
  async buscarUsuarioPorRostro(descriptorActual: number[]): Promise<string | null> {
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    
    for (const usuario of usuariosRegistrados) {
      const faceData = this.obtenerDatosFaciales(usuario.email);
      
      if (faceData && faceData.descriptor) {
        const coincide = this.verificarCoincidencia(descriptorActual, faceData.descriptor);
        
        if (coincide) {
          return usuario.email;
        }
      }
    }
    
    return null;
  }
}
