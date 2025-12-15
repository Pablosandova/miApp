import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'listar',
    loadComponent: () => import('../pages/listar/listar.page').then( m => m.ListarPage)
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'agregar',
    loadComponent: () => import('../pages/agregar/agregar.page').then( m => m.AgregarPage)
  },
  {
    path: 'running-tracker',
    loadComponent: () => import('../pages/running-tracker/running-tracker.page').then(m => m.RunningTrackerPage)
  },
  {
    path: 'rutina-personalizada',
    loadComponent: () => import('../pages/rutina-personalizada/rutina-personalizada.page').then(m => m.RutinaPersonalizadaPage)
  },
  {
    path: 'rutinas',
    loadComponent: () => import('../pages/rutinas/rutinas.page').then(m => m.RutinasPage)
  },
  {
    path: 'registro-diario',
    loadComponent: () => import('../pages/registro-diario/registro-diario.page').then(m => m.RegistroDiarioPage)
  },
  {
    path: 'upload-image',
    loadComponent: () => import('../pages/upload-image/upload-image.page').then(m => m.UploadImagePage)
  },
  {
    path: 'saludo',
    loadComponent: () => import('../pages/saludo/saludo.page').then(m => m.SaludoPage)
  }


];
