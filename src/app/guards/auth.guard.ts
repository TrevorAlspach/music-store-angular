import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticated = await firstValueFrom(authService.isTokenValid());
  
   if (authenticated) {
    console.log('valid')
    return true;
  } else {
    // Redirect to login page if not authenticated
    router.navigate(['/login']);
    return false; 
  }
};
