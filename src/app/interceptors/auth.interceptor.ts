import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

const apiBaseUrl = environment.apiBaseUrl;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  // Pass on the cloned request instead of the original request
  if (req.url.startsWith(apiBaseUrl)){
    // Clone the request to add the new withCredentials property
    const clonedRequest = req.clone({
      withCredentials: true,
    });

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          router.navigate(['login']);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }
  
};

