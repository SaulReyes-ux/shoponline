import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // Verificar si estamos en un entorno de navegador
  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem('email')) {
      return true;
    } else {
      const router = inject(Router);
      return router.navigate(['login']);
    }
  } else {
    // Si no estamos en un navegador, simplemente denegar el acceso
    return false;
  }
};