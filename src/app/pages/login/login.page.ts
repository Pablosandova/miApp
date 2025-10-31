import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonItem,
  IonIcon,
  IonInput
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  logoGoogle,
  logoApple
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonItem,
    IonIcon,
    IonInput,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {


  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {
    addIcons({ 
      mailOutline, 
      lockClosedOutline, 
      eyeOutline, 
      eyeOffOutline,
      logoGoogle,
      logoApple
    });
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginWithSocial(provider: string) {
    console.log(`Login with ${provider}`);
  }

  forgot() {
    console.log('Recuperar contraseña');
  }

  onSubmit() {
    console.log('Iniciar sesión', this.email, this.password);
  }

}
