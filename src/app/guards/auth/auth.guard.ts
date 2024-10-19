import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = await authService.isAuthenticated();

  if (isAuth) {
    return true;
  } else {
    //router.navigate(['/login']);
    return false;
  }
};
