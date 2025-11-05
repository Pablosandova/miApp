import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'listar',
    loadComponent: () => import('./pages/listar/listar.page').then( m => m.ListarPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'agregar',
    loadComponent: () => import('./pages/agregar/agregar.page').then( m => m.AgregarPage)
  },
  {
    path: 'testfoto',
    loadComponent: () => import('./pages/testfoto/testfoto.page').then( m => m.TestfotoPage)
  },
];
