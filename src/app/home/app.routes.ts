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
  }


];
