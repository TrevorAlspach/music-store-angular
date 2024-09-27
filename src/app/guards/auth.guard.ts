import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/syncify/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  /* const authService = inject(AuthService);
  const router = inject(Router);

  let authenticated;
  await firstValueFrom(authService.isTokenValid()).then((res)=>{
    authenticated = res;
  }
  ).catch((e)=>{
    authenticated = false;
  });
  
   if (authenticated) {
    console.log('valid')
    return true;
  } else {
    // Redirect to login page if not authenticated
    router.navigate(['/login']);
    return false; 
  } */
  return true;
};
