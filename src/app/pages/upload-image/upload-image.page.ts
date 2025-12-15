import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from '../../services/api.service';
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
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonAlert
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonAlert
  ]
})
export class UploadImagePage {
  selectedImage: string | null = null;
  uploadedImages: any[] = [];
  isLoading = false;
  showAlert = false;
  alertMessage = '';

  constructor(private apiService: ApiService) {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.selectedImage = image.dataUrl || null;
    } catch (error) {
      console.error('Error al tomar foto:', error);
      this.showMessage('Error al tomar la foto');
    }
  }

  async selectFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      this.selectedImage = image.dataUrl || null;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      this.showMessage('Error al seleccionar la imagen');
    }
  }

  async uploadImage() {
    if (!this.selectedImage) {
      this.showMessage('Por favor, selecciona una imagen primero');
      return;
    }

    this.isLoading = true;

    try {
      // Convertir DataUrl a Blob
      const blob = this.dataURLtoBlob(this.selectedImage);
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Subir al backend Spring Boot
      this.apiService.uploadImage(file).subscribe({
        next: (response) => {
          console.log('Imagen subida exitosamente:', response);
          this.showMessage('¡Imagen subida exitosamente!');
          this.selectedImage = null;
          this.loadImages(); // Recargar lista de imágenes
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al subir imagen:', error);
          this.showMessage('Error al subir la imagen. Verifica la conexión con el backend.');
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.showMessage('Error al procesar la imagen');
      this.isLoading = false;
    }
  }

  loadImages() {
    this.isLoading = true;
    this.apiService.getImages().subscribe({
      next: (images) => {
        this.uploadedImages = images;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar imágenes:', error);
        this.showMessage('Error al cargar las imágenes del servidor');
        this.isLoading = false;
      }
    });
  }

  deleteImage(id: number) {
    this.apiService.deleteImage(id).subscribe({
      next: () => {
        this.showMessage('Imagen eliminada exitosamente');
        this.loadImages();
      },
      error: (error) => {
        console.error('Error al eliminar imagen:', error);
        this.showMessage('Error al eliminar la imagen');
      }
    });
  }

  // Convertir DataURL a Blob
  private dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private showMessage(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }
}
