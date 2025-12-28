import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Lazy-load the Pollution feature module
  { path: '', redirectTo: '/pollution/list', pathMatch: 'full' },
  {
    path: 'pollution',
    loadChildren: () =>
      import('./pollution/pollution.module').then(
        (lazyLoadedModule) => lazyLoadedModule.PollutionModule
      ),
  },
  { path: '**', redirectTo: '/pollution/list' },
];
