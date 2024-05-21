import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path : '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      
    ]
  },
{ path: '**', component: LoginComponent },
];
