import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class FacialRecognitionService {

  constructor() { }

  /**
   * Solicita permisos de cámara
   */
  async solicitarPermisos(): Promise<boolean> {
    try {
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera === 'granted' && permissions.photos === 'granted') {
        return true;
      }
      
      // Solicitar permisos
      const result = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });
      
      return result.camera === 'granted' && result.photos === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  }

  /**
   * Captura una foto usando la cámara del dispositivo o webcam con opción de elegir
   */
  async capturarFoto(): Promise<string | null> {
    try {
      // Verificar y solicitar permisos primero
      const tienePermisos = await this.solicitarPermisos();
      
      if (!tienePermisos) {
        console.error('No se tienen permisos de cámara');
        throw new Error('Se requieren permisos de cámara para continuar');
      }

      // Mostrar opciones al usuario
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Selecciona una opción',
        promptLabelPhoto: 'Desde Galería',
        promptLabelPicture: 'Tomar Foto',
        promptLabelCancel: 'Cancelar',
        correctOrientation: true,
        width: 640,
        height: 640,
        presentationStyle: 'popover',
        saveToGallery: false
      });

      if (!image.dataUrl) {
        console.error('No se obtuvo dataUrl de la imagen');
        return null;
      }

      return image.dataUrl;
    } catch (error: any) {
      // Si el usuario cancela, no es un error real
      if (error.message && error.message.includes('cancel')) {
        console.log('Usuario canceló la captura de foto');
        return null;
      }
      
      console.error('Error al capturar foto:', error);
      throw error;
    }
  }

  /**
   * Captura una foto directamente desde la cámara
   */
  async capturarFotoDirecta(): Promise<string | null> {
    try {
      // Verificar y solicitar permisos primero
      const tienePermisos = await this.solicitarPermisos();
      
      if (!tienePermisos) {
        console.error('No se tienen permisos de cámara');
        throw new Error('Se requieren permisos de cámara para continuar');
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true,
        width: 640,
        height: 640,
        saveToGallery: false
      });

      if (!image.dataUrl) {
        console.error('No se obtuvo dataUrl de la imagen');
        return null;
      }

      return image.dataUrl;
    } catch (error: any) {
      if (error.message && error.message.includes('cancel')) {
        console.log('Usuario canceló la captura de foto');
        return null;
      }
      
      console.error('Error al capturar foto directa:', error);
      throw error;
    }
  }

  /**
   * Extrae características faciales simplificadas de una imagen
   * En una implementación real, usarías face-api.js con modelos pre-entrenados
   */
  async extraerCaracteristicasFaciales(imageDataUrl: string): Promise<number[]> {
    // Validar que la imagen no esté vacía
    if (!imageDataUrl || imageDataUrl.trim() === '') {
      console.error('ImageDataUrl está vacía');
      return [];
    }

    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              console.error('No se pudo obtener contexto 2D del canvas');
              resolve([]);
              return;
            }

            ctx.drawImage(img, 0, 0, 64, 64);
            const imageData = ctx.getImageData(0, 0, 64, 64);
            
            // Generar un "descriptor" simplificado basado en la imagen
            const descriptor: number[] = [];
            const blockSize = 8;
            
            for (let y = 0; y < 64; y += blockSize) {
              for (let x = 0; x < 64; x += blockSize) {
                let r = 0, g = 0, b = 0, count = 0;
                
                for (let by = 0; by < blockSize && y + by < 64; by++) {
                  for (let bx = 0; bx < blockSize && x + bx < 64; bx++) {
                    const idx = ((y + by) * 64 + (x + bx)) * 4;
                    if (idx + 2 < imageData.data.length) {
                      r += imageData.data[idx];
                      g += imageData.data[idx + 1];
                      b += imageData.data[idx + 2];
                      count++;
                    }
                  }
                }
                
                if (count > 0) {
                  descriptor.push(r / count / 255);
                  descriptor.push(g / count / 255);
                  descriptor.push(b / count / 255);
                }
              }
            }
            
            console.log('✓ Características extraídas:', descriptor.length, 'valores');
            resolve(descriptor.length > 0 ? descriptor : []);
          } catch (error) {
            console.error('Error al procesar imagen:', error);
            resolve([]);
          }
        };
        
        img.onerror = (error) => {
          console.error('Error al cargar imagen:', error);
          resolve([]);
        };
        
        img.src = imageDataUrl;
      } catch (error) {
        console.error('Error general en extracción:', error);
        resolve([]);
      }
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
