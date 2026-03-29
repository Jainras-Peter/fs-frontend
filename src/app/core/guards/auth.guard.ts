import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fwd_token');
    if (token) {
      return true;
    }
  }

  messageService.add({ severity: 'error', summary: 'Authentication Required', detail: 'Please login in first' });
  router.navigate(['/login']);
  return false;
};
